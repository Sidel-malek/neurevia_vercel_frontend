"use client"

import {
  Activity,
  Brain,
  FileText,
  LineChart,
  User,
  X,
  Users,
  Share
} from "lucide-react"

import Link from "next/link"
import { useRef } from "react"
import { useState, useEffect } from "react"
import { Clock, Shield, Check, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Sidebar from "@/components/Sidebar"
import HeaderInside from "@/components/headerInside"
import { motion } from "framer-motion"
import PricingSwitcher from "@/components/pricingComponents/PricingSwitcher"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const [theme, setTheme] = useState<"dark" | "light">("light")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("diagnostic")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [doctorName, setDoctorName] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null> (null);
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string>("")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [hasSubscription, setHasSubscription] = useState(false)
  const [selectedDisease, setSelectedDisease] = useState<"alzheimer" | "parkinson">("alzheimer")

  // États pour les patients et analyses
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [patientAnalyses, setPatientAnalyses] = useState<any[]>([]);
  const [showAnalysisReport, setShowAnalysisReport] = useState(false);

  // États pour les données
  const [diagnosticTools, setDiagnosticTools] = useState<any[]>([]);
  const [patientRecords, setPatientRecords] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter()

  // Configuration centralisée des couleurs
  const resultColors = {
    CN: {
      text: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
      light: "text-green-600",
      badge: "bg-green-100 text-green-800 border-green-200",
      progress: "bg-green-500"
    },
    AD: {
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      light: "text-red-600",
      badge: "bg-red-100 text-red-800 border-red-200",
      progress: "bg-red-500"
    },
    PD: {
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      light: "text-red-600",
      badge: "bg-red-100 text-red-800 border-red-200",
      progress: "bg-red-500"
    },
    MCI: {
      text: "text-yellow-700",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      light: "text-yellow-600",
      badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
      progress: "bg-yellow-500"
    },
    default: {
      text: "text-gray-700",
      bg: "bg-gray-50",
      border: "border-gray-200",
      light: "text-gray-600",
      badge: "bg-gray-100 text-gray-800 border-gray-200",
      progress: "bg-gray-500"
    }
  } as const;

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
    "Parkinson": "Parkinson's Disease",
    "HC":"No Parkinson's Disease"
  } 

  const result_code_map = {
    "CN": "CN",
    "HC": "CN",
    "Healthy": "CN",
    "AD": "AD",
    "MCI": "MCI",
    "EMCI": "MCI",
    "LMCI": "MCI",
    "0": "CN",
    "1": "AD",
    "2": "MCI",
    "PD": "PD",
    "Parkinson": "PD"
  } 

  // Fonction helper pour obtenir les couleurs
  const getResultColorConfig = (result: string) => {
    if (!result) return resultColors.default;
    
    const code = result_code_map[result as keyof typeof result_code_map] || "default";
    
    if (code === "CN") return resultColors.CN;
    if (code === "AD" || code === "PD") return resultColors.AD;
    if (code === "MCI") return resultColors.MCI;
    
    return resultColors.default;
  };

  // Fetch des données du dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Analyses récentes
        const analysesResponse = await fetch(`${apiUrl}/api/analyses/recent/`, {
          credentials: 'include',
        });

        if (analysesResponse.ok) {
          const analysesData = await analysesResponse.json();
          
          if (analysesData.success && analysesData.analyses) {
            setDiagnosticTools(analysesData.analyses);
          } else {
            console.error('Invalid response structure:', analysesData);
            setDiagnosticTools([]);
          }
        } else {
          console.error('Failed to fetch analyses:', analysesResponse.status);
        }

        // Patients
        const patientsResponse = await fetch(`${apiUrl}/api/doctor/patients/`, {
          credentials: 'include'
        });

        if (patientsResponse.ok) {
          const patientsData = await patientsResponse.json();
          setPatientRecords(patientsData || []);
        } else {
          console.error('Failed to fetch patients:', patientsResponse.status);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [apiUrl]);

  const handleUseToolClick = async (diseaseType: "alzheimer" | "parkinson") => {
    setSelectedDisease(diseaseType);
    
    try {
      if (diseaseType === 'alzheimer') {
        router.push("/diagnosis/alzheimer");
      } else if (diseaseType === 'parkinson') {
        router.push("/diagnosis/parkinson");
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setShowPricingModal(true);
    }
  };

  // États pour les analyses
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [showAnalysisDetails, setShowAnalysisDetails] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light")

  // Gestion du clic sur une analyse
  const handleAnalysisClick = async (analysis: any) => {
    setSelectedAnalysis(analysis);
    setShowAnalysisDetails(true);
    
    try {
      const response = await fetch(`${apiUrl}/api/analysis/${analysis.id}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedAnalysis(data);
      }
    } catch (error) {
      console.error('Error fetching analysis details:', error);
    }
  };

  const handlePatientClick = async (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
    
    try {
      const response = await fetch(`${apiUrl}/api/doctor/patients/${patient.id}/analyses/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setPatientAnalyses(data || []);
      } else {
        console.error('Failed to fetch patient analyses');
      }
    } catch (error) {
      console.error('Error fetching patient analyses:', error);
    }
  };

  const handleViewReport = (analysis: any) => {
    setSelectedAnalysis(analysis);
    setShowAnalysisDetails(true);
    setShowPatientDetails(false);
  };

  // Simulation du chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Mise à jour de l'heure
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Effet de fond neural network
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const connections: Connection[] = []
    const particleCount = 80

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.color =
          currentTheme === "dark"
            ? `rgba(0, 128, 255, ${Math.random() * 0.5 + 0.2})`
            : `rgba(37, 99, 235, ${Math.random() * 0.5 + 0.2})`
      }

      update(canvas: HTMLCanvasElement) {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    class Connection {
      particle1: Particle
      particle2: Particle
      distance: number
      color: string

      constructor(particle1: Particle, particle2: Particle) {
        this.particle1 = particle1
        this.particle2 = particle2
        this.distance = Math.sqrt(Math.pow(particle1.x - particle2.x, 2) + Math.pow(particle1.y - particle2.y, 2))
        this.color =
          currentTheme === "dark"
            ? `rgba(0, 128, 255, ${Math.max(0, 0.8 - this.distance / 200)})`
            : `rgba(37, 99, 235, ${Math.max(0, 0.8 - this.distance / 200)})`
      }

      update() {
        this.distance = Math.sqrt(
          Math.pow(this.particle1.x - this.particle2.x, 2) + Math.pow(this.particle1.y - this.particle2.y, 2),
        )
        this.color =
          currentTheme === "dark"
            ? `rgba(0, 128, 255, ${Math.max(0, 0.2 - this.distance / 300)})`
            : `rgba(37, 99, 235, ${Math.max(0, 0.2 - this.distance / 300)})`
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.distance < 150) {
          ctx.strokeStyle = this.color
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(this.particle1.x, this.particle1.y)
          ctx.lineTo(this.particle2.x, this.particle2.y)
          ctx.stroke()
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas))
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        connections.push(new Connection(particles[i], particles[j]))
      }
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update(canvas)
        particle.draw(ctx)
      }

      for (const connection of connections) {
        connection.update()
        connection.draw(ctx)
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [currentTheme])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    const body = document.querySelector('body');
    body?.classList.add('theme-transition');
    setTimeout(() => {
      body?.classList.remove('theme-transition');
    }, 500);
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return "Unknown";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const textPrimaryStyle = theme === "dark" ? "text-slate-100" : "text-gray-900"
  const textSecondaryStyle = theme === "dark" ? "text-slate-400" : "text-gray-700"

  const viewPdf = (analysis: any) => {
    if (analysis.rapport) {
      const pdfUrl = analysis.rapport.startsWith('http') 
        ? analysis.rapport 
        : `${apiUrl}${analysis.rapport}`;
      
      window.open(pdfUrl, '_blank');
    } else {
      console.warn('PDF report not available in analysis data:', analysis);
      alert('PDF report not available for this analysis.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-800 relative overflow-hidden">

      <style jsx global>{`
        @keyframes loader {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-loader {
          animation: loader 2s ease-in-out;
        }
        .theme-transition {
          animation: flash 0.5s;
        }
        @keyframes flash {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.5); }
          100% { filter: brightness(1); }
        }
      `}</style>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-blue-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-400 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-blue-300 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-blue-600 font-mono text-sm tracking-wider">SYSTEM INITIALIZING</div>
            <div className="mt-4 w-48 bg-gray-200 rounded-full h-1">
              <div className="bg-blue-600 h-1 rounded-full animate-loader"></div>
            </div>
            <div className="mt-2 text-gray-500 text-xs">Loading neural networks...</div>
          </div>
        </div>
      )}

      <div className="flex h-screen justify">
        <Sidebar/>
        
        <div className="flex-1 overflow-auto">
          <HeaderInside/>

          <div className="px-6 pt-6">
            <h1 className={`text-3xl font-bold ${textPrimaryStyle}`}>Welcome Back Doctor</h1>
            <p className={`mt-1 ${textSecondaryStyle}`}>Manage your diagnostic tools and patient records</p>
          </div>  

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Alzheimer's Card */}
              <Card
                onMouseEnter={() => setHoveredCard("alzheimers")}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white border-gray-200 shadow-md overflow-hidden transition-shadow group ${hoveredCard === "alzheimers" ? "shadow-xl shadow-blue-50 scale-[1.01] -translate-y-1" : ""}`}
              >
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white relative">
                  <CardTitle className="text-xl text-gray-800 flex items-center">
                    <Brain className={`mr-2 h-5 w-5 text-blue-600 ${hoveredCard === "alzheimers" ? "animate-pulse" : ""}`} />
                    Alzheimer&apos;s Disease
                  </CardTitle>
                  <p className="text-sm text-gray-600">Early detection and diagnosis tools</p>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 mb-3 mt-3">
                    Access MRI analysis, biomarker evaluation, and combined diagnostic tools for Alzheimer&apos;s disease.
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["MRI Analysis", "Biomarkers"].map((label) => (
                      <span
                        key={label}
                        className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full border border-blue-100 flex items-center"
                      >
                        <span className={`mr-1 h-1 w-1 bg-orange-600 rounded-full ${hoveredCard === "alzheimers" ? "animate-ping" : ""}`}></span>
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className={`bg-blue-500 h-2  rounded-full w-11/12 relative ${hoveredCard === "alzheimers" ? "animate-pulse" : ""}`}
                    >
                      <div className="absolute right-0 h-full w-8 rounded-r-full opacity-70"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Detection accuracy</span>
                    <span>+90%</span>
                  </div>
                  <Button onClick={() => handleUseToolClick('alzheimer')} className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm flex items-center justify-center px-4 py-2 rounded-lg font-medium gap-2 ${hoveredCard === "alzheimers" ? "shadow-lg shadow-blue-100" : ""} border-r-4 border-blue-600`}>
                    <Activity className="h-5 w-5" />
                    Let&apos; use this tool
                  </Button>
                </CardContent>
              </Card>

              {/* Parkinson's Card */}
              <Card
                onMouseEnter={() => setHoveredCard("parkinsons")}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white border-gray-200 shadow-md overflow-hidden transition-shadow group ${hoveredCard === "parkinsons" ? "shadow-lg shadow-teal-50 scale-[1.01] -translate-y-1" : ""}`}
              >
                <CardHeader className="pb-2 bg-gradient-to-r from-teal-50 to-white relative">
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <Activity className={`mr-2 h-5 w-5 text-teal-600 ${hoveredCard === "parkinsons" ? "animate-pulse" : ""}`} />
                    Parkinson&apos;s Disease
                  </CardTitle>
                  <p className="text-sm text-gray-600">Early detection and diagnosis tools</p>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 mb-3 mt-3">
                    Access MRI analysis, biomarker evaluation, and combined diagnostic tools for Parkinson&apos;s disease.
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["DaTscan Analysis" , "Biomarkers"].map((label) => (
                      <span
                        key={label}
                        className="bg-teal-50 text-teal-600 text-xs px-2 py-1 rounded-full border border-teal-100 flex items-center"
                      >
                        <span className={`mr-1 h-1 w-1 bg-orange-600 rounded-full ${hoveredCard === "parkinsons" ? "animate-ping" : ""}`}></span>
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className={`bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full w-11/12 relative ${hoveredCard === "parkinsons" ? "animate-pulse" : ""}`}
                    >
                      <div className="absolute right-0 h-full w-8rounded-r-full opacity-70"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Detection accuracy</span>
                    <span>+90%</span>
                  </div>
                  <Button onClick={() => handleUseToolClick('parkinson')} className={`mt-4 bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-sm flex items-center justify-center px-4 py-2 rounded-lg font-medium gap-2 ${hoveredCard === "parkinsons" ? "shadow-lg shadow-teal-100" : ""} border-r-4 border-teal-600`}>
                    <LineChart className="h-5 w-5" />
                    Let&apos;s use this tool
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="diagnostic" className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="diagnostic"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    <Activity className="mr-2 h-4 w-4 group-data-[state=active]:animate-pulse" />
                    Diagnostic Tools
                  </span>
                  <span className="absolute inset-0 bg-blue-600 transform -translate-y-full group-data-[state=active]:translate-y-0 transition-transform duration-300"></span>
                </TabsTrigger>
                <TabsTrigger
                  value="patients"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    <Users className="mr-2 h-4 w-4 group-data-[state=active]:animate-pulse" />
                    Patient Records
                  </span>
                  <span className="absolute inset-0 bg-blue-600 transform -translate-y-full group-data-[state=active]:translate-y-0 transition-transform duration-300"></span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="diagnostic" className="mt-6">
                <Card className="bg-white border-gray-200 shadow-md overflow-hidden">
                  <CardHeader className="border-b border-gray-200 pb-3 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-800 flex items-center">
                        <Activity className="mr-2 h-5 w-5 text-blue-600" />
                        Recent Diagnostic Activities
                      </CardTitle>
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-300 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-1 animate-pulse"></div>
                        LIVE
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200">
                      {loadingData ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <div key={index} className="grid grid-cols-12 py-3 px-4 text-sm">
                            {Array.from({ length: 12 }).map((_, colIndex) => (
                              <div key={colIndex} className="col-span-1 bg-gray-200 h-4 rounded animate-pulse"></div>
                            ))}
                          </div>
                        ))
                      ) : diagnosticTools.length > 0 ? (
                        diagnosticTools.map((tool) => (
                          <DiagnosticRow key={tool.id} tool={tool} onAnalysisClick={handleAnalysisClick} getResultColorConfig={getResultColorConfig} />
                        ))
                      ) : (
                        <div className="py-8 text-center text-gray-500">
                          <Activity className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                          <p>No diagnostic activities found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="patients" className="mt-6">
                <Card className="bg-white border-gray-200 shadow-md overflow-hidden">
                  <CardHeader className="border-b border-gray-200 pb-3 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-800 flex items-center">
                        <Users className="mr-2 h-5 w-5 text-blue-600" />
                        Recent Patients
                      </CardTitle>
                      <Link href="/patients">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs border-blue-300 text-blue-600 hover:text-blue-600 hover:bg-blue-50"
                        >
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200">
                      {loadingData ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <div key={index} className="grid grid-cols-12 py-3 px-4 text-sm">
                            {Array.from({ length: 12 }).map((_, colIndex) => (
                              <div key={colIndex} className="col-span-1 bg-gray-200 h-4 rounded animate-pulse"></div>
                            ))}
                          </div>
                        ))
                      ) : patientRecords.length > 0 ? (
                        patientRecords.slice(0, 10).map((patient) => (
                          <PatientRow key={patient.id} patient={patient} onPatientClick={handlePatientClick} />
                        ))
                      ) : (
                        <div className="py-8 text-center text-gray-500">
                          <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                          <p>No patient records found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="relative z-10 flex flex-col min-h-screen ">
              <div className="sticky top-0 z-20 flex justify-end p-2">
                <button
                  onClick={() => setShowPricingModal(false)}
                  className=" hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <motion.div
                className="flex-1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="container mx-auto">
                  <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h1 className="text-5xl font-bold text-gray-900 mb-4 ">
                      Plan & Pricing
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                      We offer different options to meet your needs. Start for free or choose a plan that suits you.
                    </p>
                  </motion.div>
      
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <PricingSwitcher diseaseType={selectedDisease} />
                  </motion.div>
                </div>
              </motion.div>
      
              <motion.div
                className="mb-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <p className="text-slate-500 dark:text-slate-400">
                  Do you have any questions?{" "}
                  <a href="#" className="text-violet-600 hover:underline">
                    Contact our team
                  </a>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Patient Details</h2>
              <Button variant="ghost" onClick={() => setShowPatientDetails(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700">Personal Information</h3>
                <p><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
                <p><strong>ID:</strong> P-{selectedPatient.id}</p>
                <p><strong>Date of Birth:</strong> {selectedPatient.date_of_birth}</p>
                <p><strong>Age:</strong> {calculateAge(selectedPatient.date_of_birth)}</p>
                <p><strong>Gender:</strong> {selectedPatient.gender || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Medical Information</h3>
                <p><strong>Condition:</strong> {selectedPatient.primary_condition || 'Not diagnosed'}</p>
                <p><strong>Last Visit:</strong> {selectedPatient.last_visit_date || 'No visits'}</p>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-700 mb-3">Recent Analyses</h3>
            {patientAnalyses.length > 0 ? (
              <div className="space-y-2">
                {patientAnalyses.map((analysis) => {
                  const colors = getResultColorConfig(analysis.result);
                  return (
                    <div key={analysis.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">Analysis ID-{analysis.id}</p>
                        <p className="text-sm text-gray-600">
                          {analysis.type_analyse} - {new Date(analysis.date).toLocaleDateString()}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>
                          {result_code_map[analysis.result as keyof typeof result_code_map]}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => viewPdf(analysis)}
                        className="flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        View Report
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No analyses found for this patient.</p>
            )}
          </div>
        </div>
      )}

      {/* Analysis Details Modal */}
      {showAnalysisDetails && selectedAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Analysis Details</h2>
              <Button variant="ghost" onClick={() => setShowAnalysisDetails(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Analysis Information</h3>
                <div className="space-y-2">
                  <p><strong>Analysis ID:</strong> D-{selectedAnalysis.id}</p>
                  <p><strong>Disease:</strong> {selectedAnalysis.maladie || 'Unknown'}</p>
                  <p><strong>Type:</strong> {selectedAnalysis.type_analyse || 'Unknown'}</p>
                  <p><strong>Date:</strong> {new Date(selectedAnalysis.created_at || selectedAnalysis.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Patient Information</h3>
                <div className="space-y-2">
                  <p><strong>Patient:</strong> {selectedAnalysis.patientName || 'Unknown'}</p>
                  <p><strong>Patient ID:</strong> {selectedAnalysis.patientId || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Results</h3>
              {(() => {
                const colors = getResultColorConfig(selectedAnalysis.result);
                return (
                  <div className={`p-4 rounded-lg ${colors.badge}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg">
                          {result_map[selectedAnalysis.result as keyof typeof result_map] || selectedAnalysis.result}
                        </p>
                      </div>
                      <div className={`text-2xl font-bold ${colors.text}`}>
                        
                        {result_code_map[selectedAnalysis.result as keyof typeof result_code_map] }
                      </div>
                    </div>
                    {selectedAnalysis.confidence && selectedAnalysis.type_analyse !== "combined" && (
                      <div className="mt-5">
                        <p className="text-sm font-medium text-gray-600">Overall Confidence</p>
                        <p className="text-lg font-bold">{selectedAnalysis.confidence}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${colors.progress}`} 
                            style={{ width: `${selectedAnalysis.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Share className="h-4 w-4" />
                Share Analysis
              </Button>
          
              <Button 
                variant="default" 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => viewPdf(selectedAnalysis)}
              >
                <Activity className="h-4 w-4" />
                View Full Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// DiagnosticRow component avec couleurs unifiées
const DiagnosticRow = ({ 
  tool, 
  onAnalysisClick, 
  getResultColorConfig 
}: { 
  tool: any, 
  onAnalysisClick: (analysis: any) => void,
  getResultColorConfig: (result: string) => any
}) => {
  if (!tool) return null;
  
  const confidence = tool.confidence ? tool.confidence : 0;
  const displayName = tool.patient_name 
    || (tool.patient && `${tool.patient.first_name || ''} ${tool.patient.last_name || ''}`.trim())
    || 'Unknown Patient';
  
  const analysisType = tool.type_analyse || tool.analysis_type || 'Unknown';
  const resultDate = tool.date || tool.created_at;
  const result = tool.result as string;
  
  const colors = getResultColorConfig(result);

  return (
    <div 
      className="grid grid-cols-12 py-3 px-4 text-sm hover:bg-blue-50 transition-colors relative cursor-pointer group"
      onClick={() => onAnalysisClick(tool)}
    >
      <div className="col-span-1 text-gray-500">D-{tool.id || 'N/A'}</div>
      <div className="col-span-3 text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
        {displayName}
      </div>
      <div className="col-span-2 text-gray-600">{analysisType}</div>
      <div className="col-span-2 text-gray-600">
        {resultDate ? new Date(resultDate).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        }) : 'Unknown date'}
      </div>
      <div className={`col-span-2 ${colors.light} font-medium flex items-center`}>
        {confidence}%
        <div className="ml-2 w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${colors.progress}`} 
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>
      <div className="col-span-2 flex space-x-2 opacity-80 group-hover:opacity-100">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          onClick={(e) => {
            e.stopPropagation();
            onAnalysisClick(tool);
          }}
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Activity className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// PatientRow component
const PatientRow = ({ patient, onPatientClick }: { patient: any, onPatientClick: (patient: any) => void }) => {
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return "Unknown";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const initials = patient.first_name && patient.last_name 
    ? `${patient.first_name[0]}${patient.last_name[0]}`.toUpperCase()
    : 'UU';

  const getConditionColor = (condition: string) => {
    if (!condition) return "bg-gray-50 text-gray-700";
    if (condition.includes("Alzheimer")) return "bg-red-50 text-red-700";
    if (condition.includes("Parkinson")) return "bg-amber-50 text-amber-700";
    return "bg-green-50 text-green-700";
  };

  return (
    <div 
      className="grid grid-cols-12 py-3 px-4 text-sm hover:bg-blue-50 transition-colors cursor-pointer group"
      onClick={() => onPatientClick(patient)}
    >
      <div className="col-span-3 text-gray-800 font-medium group-hover:text-blue-600 flex items-center">
        <Avatar className="h-5 w-5 mr-2">
          <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
            {initials}
          </AvatarFallback>
        </Avatar>
        {`${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown'}
      </div>
      <div className="col-span-2 text-gray-500">P-{patient.id}</div>
      <div className="col-span-1 text-gray-600">{calculateAge(patient.date_of_birth)}</div>
      <div className="col-span-2 text-gray-600">
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(patient.primary_condition)}`}>
          {patient.primary_condition || "Not diagnosed"}
        </span>
      </div>
      <div className="col-span-2 text-gray-600">
        {patient.last_visit_date ? new Date(patient.last_visit_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : "No visits"}
      </div>
      <div className="col-span-2 flex space-x-2 opacity-80 group-hover:opacity-100">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          onClick={(e) => e.stopPropagation()}
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          onClick={(e) => e.stopPropagation()}
        >
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
