"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  User,
  FileText,
  ArrowLeft,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Sidebar from "@/components/Sidebar"
import HeaderInside from "@/components/headerInside"

interface Patient {
  id: number
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string
  email: string
  phone: string
  primary_condition: string
  last_visit_date: string
  analysis_count: number
}

interface Analysis {
  id: number
  type_analyse: string
  maladie: string
  result: string
  confidence: number
  created_at: string
  rapport: string
  date: string
}

export default function PatientsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [patientAnalyses, setPatientAnalyses] = useState<Analysis[]>([])
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const patientsPerPage = 10
  

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/doctor/patients/`, {
        credentials: "include",   // this sends the HttpOnly cookie

        })

        if (response.ok) {
          const data = await response.json()
          setPatients(data)
          setFilteredPatients(data)
        }
      } catch (error) {
        console.error('Error fetching patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [router, apiUrl])

  // Filter patients
  useEffect(() => {
    let filtered = patients

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.primary_condition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(patient =>
        statusFilter === "with_analysis" ? patient.analysis_count > 0 : patient.analysis_count === 0
      )
    }

    setFilteredPatients(filtered)
  }, [searchTerm, statusFilter, patients])




  // Fetch patient analyses
  const fetchPatientAnalyses = async (patientId: number) => {
      try {

        const response = await fetch(`${apiUrl}/api/doctor/patients/${patientId}/analyses/`, {
          credentials: "include",   // this sends the HttpOnly cookie
        })

        if (response.ok) {
          const data = await response.json()
          setPatientAnalyses(data.analyses || data || [])
        }
      } catch (error) {
        console.error('Error fetching patient analyses:', error)
      }
  }

  const handlePatientClick = async (patient: Patient) => {
      setSelectedPatient(patient)
      await fetchPatientAnalyses(patient.id)
  }

  const handleAnalysisClick = (analysis: Analysis) => {
    
      //setSelectedAnalysis(analysis)
      const pageResult =  analysis.type_analyse ==="BIOMARKER" ? "biomarker-result": 
      analysis.type_analyse=="MRI" ? "mri-result" : analysis.type_analyse ==="DATSCAN" ? "datscan-result" : "clinical-result"

      const maladie = analysis.maladie === "Alzheimer" ? "alzheimer" : "parkinson"
      router.push(`/results/${maladie}/${pageResult}?analysis_id=${analysis.id}`)
  
  }

  const handleBackToPatients = () => {
    setSelectedPatient(null)
    setSelectedAnalysis(null)
    setPatientAnalyses([])
  }

  const handleBackToAnalyses = () => {
    setSelectedAnalysis(null)
  }

  const viewPdf = (analysis: Analysis) => {
    
      if (analysis.rapport) {
        const pdfUrl = analysis.rapport.startsWith('http') 
          ? analysis.rapport 
          : `${apiUrl}${analysis.rapport}`
        window.open(pdfUrl, '_blank')
      } else {
        alert('PDF report not available for this analysis.')
      }

  }

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return "Unknown"
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const result_map = {
  "CN": "Cognitively Normal – No Alzheimer",
  "AD": "Cognitive Impairment with Alzheimer", 
  "MCI": "Cognitive Impairment without Alzheimer",
  "EMCI": "Early Mild Cognitive Impairment",
  "LMCI": "Late Mild Cognitive Impairment",
  "0": "Cognitively Normal",
  "1": "Cognitive Impairment with Alzheimer",
  "2": "Cognitive Impairment without Alzheimer",
  "PD": "Parkinson's Disease",
  "Parkinson": "Parkinson's Disease"
} as const;
  const result_code_map = {
    "CN": "CN",
    "HC": "CN",
    "Healthy": "CN",
    "AD": "AD",
    "MCI": "MCI",
    "EMCI": "LMCI",
    "LMCI": "EMCI",
    "0": "CN",
    "1": "AD",
    "2": "MCI",
    "PD": "PD",
    "Parkinson": "PD"
  } as const;
 

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient)
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Si en cours de chargement ou vérification d'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-r-blue-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
            <div className="absolute inset-6 border-4 border-b-blue-400 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
            <div className="absolute inset-8 border-4 border-l-blue-300 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
          </div>
          <div className="mt-4 text-blue-600 font-mono text-sm tracking-wider">VERIFYING AUTHENTICATION...</div>
        </div>
      </div>
    );
  }

  // Analysis Detail View
  if (selectedAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 relative overflow-hidden">
        <div className="flex h-screen">
          <Sidebar/>
          <div className="flex-1 overflow-auto">
            <HeaderInside/>
            
            <div className="p-6">
              <Button 
                variant="ghost" 
                onClick={handleBackToAnalyses}
                className="mb-6 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Analyses
              </Button>

              <Card className="bg-white border-gray-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                  <CardTitle className="flex items-center text-xl gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Analysis Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Analysis Information</h3>
                      <p><strong>ID:</strong> D-{selectedAnalysis.id}</p>
                      <p><strong>Type:</strong> {selectedAnalysis.type_analyse}</p>
                      <p><strong>Disease:</strong> {selectedAnalysis.maladie}</p>
                      <p><strong>Date:</strong> {new Date(selectedAnalysis.created_at || selectedAnalysis.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Results</h3>
                      <div className={`p-3 rounded-lg ${
                                  result_code_map[selectedAnalysis.result as keyof typeof result_code_map] === "CN" || "HC" ? "bg-green-50 text-green-800 border-green-200" :
                                  result_code_map[selectedAnalysis.result as keyof typeof result_code_map] === "AD" || "PD" ? "bg-red-50 text-red-800 border-red-200" : 
                                  "bg-blue-50 text-blue-800 border-blue-200"
                                }`}>
                        <p className="font-bold text-lg">
                          {selectedAnalysis.result ? result_map[selectedAnalysis.result as keyof typeof result_map] || selectedAnalysis.result : 'No result available'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Confidence: {selectedAnalysis.confidence}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedAnalysis.rapport && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => viewPdf(selectedAnalysis)} 
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                        View PDF Report
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Patient Analyses View
  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 relative overflow-hidden">
        <div className="flex h-screen">
          <Sidebar/>
          <div className="flex-1 overflow-auto">
            <HeaderInside/>
            
            <div className="p-6">
              <Button 
                variant="ghost" 
                onClick={handleBackToPatients}
                className="mb-6 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Patients
              </Button>

              <Card className="bg-white border-gray-200 shadow-md mb-6">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                  <CardTitle className="flex text-xl items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Patient: {selectedPatient.first_name} {selectedPatient.last_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>Email:</strong> {selectedPatient.email}</p>
                      <p><strong>Phone:</strong> {selectedPatient.phone || 'Not provided'}</p>
                      <p><strong>Gender:</strong> {selectedPatient.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <p><strong>Date of Birth:</strong> {selectedPatient.date_of_birth}</p>
                      <p><strong>Last Visit:</strong> {selectedPatient.last_visit_date || 'No visits'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                  <CardTitle className="flex items-center text-xl gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Medical Analyses ({patientAnalyses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {patientAnalyses.length > 0 ? (
                    <div className="space-y-3">
                      {patientAnalyses.map((analysis) => (
                        <div key={analysis.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Analysis #{analysis.id}</p>
                              <p className="text-sm text-gray-600">
                                {analysis.type_analyse} - {new Date(analysis.created_at || analysis.date).toLocaleDateString()}
                              </p>
                              <Badge className={`mt-2 ${
                                  result_code_map[analysis.result as keyof typeof result_code_map] === "CN" ? "bg-green-100 text-green-800 border-green-200" :
                                  result_code_map[analysis.result as keyof typeof result_code_map] === "AD" || result_code_map[analysis.result as keyof typeof result_code_map] === "PD" ? "bg-red-100 text-red-800 border-red-200" : 
                                  "bg-blue-100 text-blue-800 border-blue-200"
                                } border px-2 py-1 rounded-full text-xs font-medium`}>
                                {result_code_map[analysis.result as keyof typeof result_code_map]}
                              </Badge>
                              <Badge className={`m-2 bg-gray-100 text-gray-800 border-gray-200 border px-2 py-1 rounded-full text-xs font-medium`}>
                                  {analysis.maladie || 'Not diagnosed'}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              {analysis.rapport && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => viewPdf(analysis)}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  PDF
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => handleAnalysisClick(analysis)}
                                className="flex items-center gap-1"
                              >
                                <Activity className="h-4 w-4" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No analyses found for this patient.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Patients List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 relative overflow-hidden">
      <div className="flex h-screen">
        <Sidebar/>
        <div className="flex-1 overflow-auto">
          <HeaderInside/>
          
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Records</h1>
              <p className="text-gray-600">Manage and view all patient records and their medical analyses</p>
            </div>

            {/* Search and Filter */}
            <Card className="bg-white border-gray-200 shadow-md mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search patients by name, email, or condition..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Patients</SelectItem>
                      <SelectItem value="with_analysis">With Analyses</SelectItem>
                      <SelectItem value="without_analysis">Without Analyses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Patients List */}
            <Card className="bg-white border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="flex items-center text-xl gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Patients ({filteredPatients.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {currentPatients.length > 0 ? (
                  <div className="space-y-4">
                    {currentPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-4 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => handlePatientClick(patient)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {patient.first_name[0]}{patient.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">
                                {patient.first_name} {patient.last_name}
                              </p>
                              <p className="text-sm text-gray-600">{patient.email}</p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline">{patient.primary_condition}</Badge>
                                <Badge variant="default">
                                  {patient.analysis_count} analyses
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button variant="default" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No patients found matching your criteria.</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
