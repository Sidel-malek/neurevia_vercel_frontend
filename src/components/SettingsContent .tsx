"use client"

import { useState, useEffect , useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hook/useAuth"
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Download,
  Upload,
  Moon,
  Sun,
  Save,
  X,
  Key,
  Mail,
  Phone,
  Building,
  Calendar,
  CreditCard,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Users,
  BarChart3,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Sidebar from "@/components/Sidebar"
import HeaderInside from "@/components/headerInside"

// Interfaces
interface UserData {
  username: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  gender: string
  role: string
}

interface DoctorData {
  speciality: string
  numero_ordre: string
  grade: string
  experience: string
  hopital: string
  is_approved: boolean
  verification_status: string
}

interface SubscriptionData {
  current_type: string
  current_status: string
  start_date: string
  end_date: string
  price: number
  payment_method: string
}

interface VerificationData {
  total_documents: number
  approved_documents: number
  pending_documents: number
  rejected_documents: number
}

interface StatisticsData {
  total_patients: number
  total_analyses: number
  recent_analyses: number
}

interface SubscriptionHistoryItem {
  type: string
  date_debut: string
  date_fin: string
  statut: string
  prix: number
}

interface ApiResponse {
  user: UserData
  doctor: DoctorData
  subscription: SubscriptionData
  verification: VerificationData
  subscription_history: SubscriptionHistoryItem[]
  statistics: StatisticsData
}

export default function SettingsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const router = useRouter()
  const { logout, isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [profileData, setProfileData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState("")

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    analysis_completed: true,
    new_patient: true,
    monthly_report: false,
    security_alerts: true
  })

  const [privacySettings, setPrivacySettings] = useState({
    data_collection: true,
    analytics: false,
    marketing_emails: false,
    share_anonymous_data: false,
    auto_backup: true,
    backup_frequency: "weekly"
  })


useEffect(() => {
  const fetchProfile = async () => {
    if (!isAuthenticated) {
      if (!authLoading) {
        router.push("/home");
      }
      return;
    }

    try {
      setError("");
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/profile/`, {
        credentials: "include",
      });
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setProfileData(data);
      } else if (response.status === 401) {
        await logout();
        router.push("/home");
      } else if (response.status === 404) {
        // fallback data
        const errorData = await response.json();
        if (errorData.user) {
          setProfileData({
            user: errorData.user,
            doctor: {
              speciality: "",
              numero_ordre: "",
              grade: "",
              experience: "",
              hopital: "",
              is_approved: false,
              verification_status: "pending"
            },
            subscription: {
              current_type: "FreeTrial",
              current_status: "inactive",
              start_date: "",
              end_date: "",
              price: 0,
              payment_method: ""
            },
            verification: {
              total_documents: 0,
              approved_documents: 0,
              pending_documents: 0,
              rejected_documents: 0
            },
            subscription_history: [],
            statistics: {
              total_patients: 0,
              total_analyses: 0,
              recent_analyses: 0
            }
          })
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  if (!authLoading && isAuthenticated) {
    fetchProfile();
  }
}, [isAuthenticated, authLoading]); // seulement ces deux dépendances


  const handleSaveProfile = async () => {
    if (!profileData) return
    
    setSaving(true)
    try {
      const updateData = {
        first_name: profileData.user.first_name,
        last_name: profileData.user.last_name,
        phone: profileData.user.phone,
        date_of_birth: profileData.user.date_of_birth,
        address: profileData.user.address,
        gender: profileData.user.gender,
        speciality: profileData.doctor.speciality,
        numero_ordre: profileData.doctor.numero_ordre,
        grade: profileData.doctor.grade,
        experience: profileData.doctor.experience,
        hopital: profileData.doctor.hopital
      }

      const response = await fetch(`${apiUrl}/api/profile/update/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        console.log("Profile updated successfully")
        // Refetch data to ensure consistency
        const updatedResponse = await fetch(`${apiUrl}/api/profile/`, {
          credentials: "include",
        })
        if (updatedResponse.ok) {
          const updatedData: ApiResponse = await updatedResponse.json()
          setProfileData(updatedData)
        }
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setError("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/export-data/`, {
        credentials: "include",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `medical_data_export_${new Date().toISOString().split('T')[0]}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      setError("Failed to export data")
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark')
  }

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const handleInputChange = (section: 'user' | 'doctor', field: string, value: string) => {
    if (!profileData) return
    
    setProfileData(prev => {
      if (!prev) return null
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }
    })
  }

  // Loading states
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
        <div className="flex h-screen">
          <Sidebar/>
          <div className="flex-1 overflow-auto">
            <HeaderInside/>
            <div className="p-6">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96 mb-8" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 relative overflow-hidden">
      <div className="flex h-screen">
        <Sidebar/>
        <div className="flex-1 overflow-auto">
          <HeaderInside/>
          
          <div className="p-6">
            {/* Header with Logout */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <SettingsIcon className="h-8 w-8 text-blue-600" />
                  Settings
                </h1>
                <p className="text-gray-600">Manage your account settings and preferences</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <XCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy & Security
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Data Management
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profileData && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profileData.user.first_name}
                              onChange={(e) => handleInputChange('user', 'first_name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profileData.user.last_name}
                              onChange={(e) => handleInputChange('user', 'last_name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.user.email}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={profileData.user.phone}
                              onChange={(e) => handleInputChange('user', 'phone', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="speciality">Speciality</Label>
                            <Input
                              id="speciality"
                              value={profileData.doctor.speciality}
                              onChange={(e) => handleInputChange('doctor', 'speciality', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hospital">Hospital</Label>
                            <Input
                              id="hospital"
                              value={profileData.doctor.hopital}
                              onChange={(e) => handleInputChange('doctor', 'hopital', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button onClick={handleSaveProfile} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button variant="outline" onClick={() => window.location.reload()}>
                            Cancel
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Other tabs content would go here */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Notification settings content...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Privacy settings content...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleExportData} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}