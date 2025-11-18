"use client"

import { useState, useRef, useEffect } from "react"
import {
  BarChart3,
  Brain,
  Download,
  FileText,
  Filter,
  Sun,
  Moon,
  Users,
  Activity,
  TrendingUp,
  Search,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"

import HeaderInside from "@/components/headerInside"

export default function AnalyticsPage() {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("month")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
 

  const handleThemeChange = (newTheme: "dark" | "light") => {
   
      setCurrentTheme(newTheme)
  
  }
useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false)   // après 2 secondes → loading terminé
  }, 50)

  return () => clearTimeout(timer)
}, [])


 // Neural network background effect
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

    constructor(canvas: HTMLCanvasElement) { // ✓ Ajoutez canvas en paramètre
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

    update(canvas: HTMLCanvasElement) { // ✓ Ajoutez canvas en paramètre
      this.x += this.speedX
      this.y += this.speedY

      if (this.x > canvas.width) this.x = 0
      if (this.x < 0) this.x = canvas.width
      if (this.y > canvas.height) this.y = 0
      if (this.y < 0) this.y = canvas.height
    }

    draw(ctx: CanvasRenderingContext2D) { // ✓ Ajoutez ctx en paramètre
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

    draw(ctx: CanvasRenderingContext2D) { // ✓ Ajoutez ctx en paramètre
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

  // Créez les particules en passant le canvas
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas))
  }

  // Create connections between particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      connections.push(new Connection(particles[i], particles[j]))
    }
  }

  function animate() {
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const particle of particles) {
      particle.update(canvas) // ✓ Passez canvas
      particle.draw(ctx) // ✓ Passez ctx
    }

    for (const connection of connections) {
      connection.update()
      connection.draw(ctx) // ✓ Passez ctx
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

  // Si en cours de chargement ou vérification d'authentification
  if (isLoading) {
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

  // Theme-dependent styles
  const bgStyle =
    currentTheme === "dark"
      ? "bg-gradient-to-br from-black to-slate-900 text-slate-100"
      : "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800"

  const cardBgStyle =
    currentTheme === "dark" ? "bg-slate-900/50 border-slate-700/50" : "bg-white shadow-md border-2 border-gray-300"

  const tabsBgStyle = currentTheme === "dark" ? "bg-slate-800/50" : "bg-gray-200"

  const tabsActiveStyle =
    currentTheme === "dark"
      ? "data-[state=active]:bg-slate-700 data-[state=active]:text-blue-400"
      : "data-[state=active]:bg-blue-600 data-[state=active]:text-white"

  const inputBgStyle =
    currentTheme === "dark" ? "bg-slate-800 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-800"

  const buttonPrimaryStyle =
    currentTheme === "dark"
      ? "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/50"
      : "bg-blue-600 hover:bg-blue-400 text-white border border-blue-500"

  const buttonOutlineStyle =
    currentTheme === "dark"
      ? "border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
      : "border-gray-400 text-gray-700 hover:bg-gray-200 hover:text-gray-900"

  const textPrimaryStyle = currentTheme === "dark" ? "text-slate-100" : "text-gray-900"

  const textSecondaryStyle = currentTheme === "dark" ? "text-slate-400" : "text-gray-700"

  const textTertiaryStyle = currentTheme === "dark" ? "text-slate-500" : "text-gray-500"

  const positiveStyle = currentTheme === "dark" ? "text-green-400" : "text-green-600"

  const negativeStyle = currentTheme === "dark" ? "text-red-400" : "text-red-600"

  return (
    <div className="flex ">
     <Sidebar/>
     <div className={` ${bgStyle} w-full`}>
      {/* Background neural network effect */}
      {/*<canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />*/}
    
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-blue-400 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-600 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-blue-400 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-blue-400 font-mono text-sm tracking-wider">CHARGEMENT DES DONNÉES</div>
          </div>
        </div>
      )}
      
      <div className="sticky top-0 z-10 ">
         {/* Header */}
        <HeaderInside />
      </div>

      
      <div className=" mx-auto p-6 relative rounded-xl  shadow">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${textPrimaryStyle}`}>Analytics Dashboard</h1>
            <p className={`mt-1 ${textSecondaryStyle}`}>Visualize your medical performance and statistics</p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className={`w-[180px] ${inputBgStyle}`}>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 3 months</SelectItem>
                <SelectItem value="year">Current year</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className={buttonPrimaryStyle}
              onClick={() => 
                // Action d'export ici
                console.log("Exporting data...")}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className={cardBgStyle}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${textSecondaryStyle}`}>Total Patients</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className={`text-2xl font-bold ${textPrimaryStyle}`}>124</h3>
                    <Badge className={`ml-2 ${positiveStyle} bg-green-500/10`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8%
                    </Badge>
                  </div>
                  <p className={`text-xs mt-1 ${textTertiaryStyle}`}>vs previous period</p>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === "dark" ? "bg-blue-900/20" : "bg-blue-100"}`}>
                  <Users className={`h-5 w-5 ${currentTheme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cardBgStyle}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${textSecondaryStyle}`}>Alzheimer&apos;s Diagnoses</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className={`text-2xl font-bold ${textPrimaryStyle}`}>42</h3>
                    <Badge className={`ml-2 ${positiveStyle} bg-green-500/10`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12%
                    </Badge>
                  </div>
                  <p className={`text-xs mt-1 ${textTertiaryStyle}`}>vs previous period</p>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === "dark" ? "bg-purple-900/20" : "bg-blue-100"}`}>
                  <Brain className={`h-5 w-5 ${currentTheme === "dark" ? "text-purple-400" : "text-blue-600"}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cardBgStyle}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${textSecondaryStyle}`}>Diagnostic Accuracy</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className={`text-2xl font-bold ${textPrimaryStyle}`}>92%</h3>
                    <Badge className={`ml-2 ${positiveStyle} bg-green-500/10`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3%
                    </Badge>
                  </div>
                  <p className={`text-xs mt-1 ${textTertiaryStyle}`}>vs previous period</p>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === "dark" ? "bg-green-900/20" : "bg-blue-100"}`}>
                  <Activity className={`h-5 w-5 ${currentTheme === "dark" ? "text-green-400" : "text-blue-600"}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className={`grid w-full grid-cols-3 ${tabsBgStyle} p-1`}>
            <TabsTrigger value="overview" className={`flex items-center gap-2 ${tabsActiveStyle}`}>
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="patients" className={`flex items-center gap-2 ${tabsActiveStyle}`}>
              <Users className="h-4 w-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className={`flex items-center gap-2 ${tabsActiveStyle}`}>
              <Brain className="h-4 w-4" />
              Diagnostics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className={`${cardBgStyle} lg:col-span-2`}>
                <CardHeader className="pb-2 bg-gray-900 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Diagnoses by Month</CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                  <CardDescription className="text-gray-300">
                    Distribution of diagnoses over the last 12 months
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px] w-full">
                    <BarChartComponent theme={currentTheme} />
                  </div>
                </CardContent>
              </Card>

              <Card className={cardBgStyle}>
                <CardHeader className="pb-2 bg-gray-900 text-white">
                  <CardTitle className="text-xl">Diagnosis Distribution</CardTitle>
                  <CardDescription className="text-gray-300">Breakdown by disease type</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <PieChartComponent theme={currentTheme} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className={cardBgStyle}>
              <CardHeader className="pb-2 bg-gray-900 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-300">Latest analyses and diagnoses performed</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-300">
                  <ActivityRow
                    id="A-1024"
                    patient="Benabdallah Ali"
                    type="Alzheimer"
                    date="12 Mai 2025"
                    status="Complété"
                    theme={currentTheme}
                  />
                  <ActivityRow
                    id="A-1025"
                    patient="Dahou Fatima"
                    type="Parkinson"
                    date="11 Mai 2025"
                    status="En cours"
                    theme={currentTheme}
                  />
                  <ActivityRow
                    id="A-1026"
                    patient="Bouchnak Mohammed"
                    type="Alzheimer"
                    date="10 Mai 2025"
                    status="Complété"
                    theme={currentTheme}
                  />

                  <ActivityRow
                    id="A-1028"
                    patient="Bouzid Boualam"
                    type="Parkinson"
                    date="8 Mai 2025"
                    status="Complété"
                    theme={currentTheme}
                  />
                </div>
              </CardContent>
              <CardFooter
                className={`p-4 border-t ${currentTheme === "dark" ? "border-slate-700/50" : "border-gray-300"}`}
              >
                <Button variant="ghost" className={`w-full ${buttonOutlineStyle}`}>
                  View All Activities
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="mt-6 space-y-6">
            {/* Patient Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={cardBgStyle}>
                <CardHeader className="pb-2 bg-gray-900 text-white">
                  <CardTitle className="text-xl">Age Distribution</CardTitle>
                  <CardDescription className="text-gray-300">Distribution of patients by age group</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm ${textSecondaryStyle}`}>40-50 years</span>
                        <span className={`text-sm ${textSecondaryStyle}`}>12 patients (10%)</span>
                      </div>
                      <Progress
                        value={10}
                        className={`h-2 ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm ${textSecondaryStyle}`}>51-60 years</span>
                        <span className={`text-sm ${textSecondaryStyle}`}>24 patients (19%)</span>
                      </div>
                      <Progress
                        value={19}
                        className={`h-2 ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm ${textSecondaryStyle}`}>61-70 years</span>
                        <span className={`text-sm ${textSecondaryStyle}`}>38 patients (31%)</span>
                      </div>
                      <Progress
                        value={31}
                        className={`h-2 ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm ${textSecondaryStyle}`}>71-80 years</span>
                        <span className={`text-sm ${textSecondaryStyle}`}>32 patients (26%)</span>
                      </div>
                      <Progress
                        value={26}
                        className={`h-2 ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm ${textSecondaryStyle}`}>81+ years</span>
                        <span className={`text-sm ${textSecondaryStyle}`}>18 patients (14%)</span>
                      </div>
                      <Progress
                        value={14}
                        className={`h-2 ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={cardBgStyle}>
                <CardHeader className="pb-2 bg-gray-900 text-white">
                  <CardTitle className="text-xl">New Patients</CardTitle>
                  <CardDescription className="text-gray-300">Evolution of new patient numbers</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[250px] w-full">
                    <LineChartComponent theme={currentTheme} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patient Search */}
            <Card className={cardBgStyle}>
              <CardHeader className="pb-2 bg-gray-900 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Patient Search</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-300 hover:text-white border-gray-600 hover:bg-gray-800"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Advanced Filters
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative mb-6">
                  <Search className={`absolute left-3 top-3 h-4 w-4 ${textSecondaryStyle}`} />
                  <Input placeholder="Rechercher par nom, ID ou diagnostic..." className={`pl-10 ${inputBgStyle}`} />
                </div>
                <div className="divide-y divide-gray-300">
                  <PatientRow
                    name="Benabdallah Ali"
                    id="P-5678"
                    age={68}
                    condition="Alzheimer"
                    lastVisit="12 Mai 2025"
                    theme={currentTheme}
                  />
                  <PatientRow
                    name="Dahou Fatima"
                    id="P-5679"
                    age={72}
                    condition="Parkinson"
                    lastVisit="11 Mai 2025"
                    theme={currentTheme}
                  />
                  <PatientRow
                    name="Bouchnak Mohammed"
                    id="P-5680"
                    age={65}
                    condition="Alzheimer"
                    lastVisit="10 Mai 2025"
                    theme={currentTheme}
                  />

                  <PatientRow
                    name="Bouzid Boualam"
                    id="P-5682"
                    age={76}
                    condition="Parkinson"
                    lastVisit="8 Mai 2025"
                    theme={currentTheme}
                  />
                </div>
              </CardContent>
              <CardFooter
                className={`p-4 border-t ${currentTheme === "dark" ? "border-slate-700/50" : "border-gray-300"}`}
              >
                <div className="flex justify-between w-full items-center">
                  <div className={`text-sm ${textSecondaryStyle}`}>Showing 5 of 124 patients</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className={buttonOutlineStyle} disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className={buttonOutlineStyle}>
                      Next
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="diagnostics" className="mt-6 space-y-6">
            {/* Diagnostic Accuracy */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <Card className={cardBgStyle}>
                <CardHeader className="pb-2 bg-gray-900 text-white">
                  <CardTitle className="text-xl">Accuracy by Diagnosis Type</CardTitle>
                  <CardDescription className="text-gray-300">
                    Accuracy rates by neurodegenerative disease
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm ${textSecondaryStyle}`}>Alzheimer</span>
                        <span className={`text-sm ${textSecondaryStyle}`}>92%</span>
                      </div>
                      <Progress
                        value={92}
                        className={`h-2 ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}
                      />
                      {/*idicator :`bg-gradient-to-r from-blue-600 to-blue-400`*/}

                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm ${textSecondaryStyle}`}>Parkinson</span>
                        <span className={`text-sm ${textSecondaryStyle}`}>88%</span>
                      </div>
                      <Progress
                        value={88}
                        className={`h-2 ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm ${textSecondaryStyle}`}>Vascular Dementia</span>
                        <span className={`text-sm ${textSecondaryStyle}`}>79%</span>
                      </div>
                      <Progress
                        value={79}
                        className={`h-2 ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Diagnostics */}
            <Card className={cardBgStyle}>
              <CardHeader className="pb-2 bg-gray-900 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Recent Diagnostics</CardTitle>
                  <Select defaultValue="all">
                    <SelectTrigger className={`w-[180px] ${inputBgStyle}`}>
                      <SelectValue placeholder="Type de diagnostic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="alzheimer">Alzheimer&apos;s</SelectItem>
                      <SelectItem value="parkinson">Parkinson&apos;s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-300">
                  <DiagnosticRow
                    id="D-1024"
                    patient="Benabdallah Ali"
                    type="Alzheimer"
                    date="12 Mai 2025"
                    score={72}
                    theme={currentTheme}
                  />
                  <DiagnosticRow
                    id="D-1025"
                    patient="Dahou Fatima"
                    type="Parkinson"
                    date="11 Mai 2025"
                    score={28}
                    theme={currentTheme}
                  />
                  <DiagnosticRow
                    id="D-1026"
                    patient="Bouchnak Mohammed "
                    type="Alzheimer"
                    date="10 Mai 2025"
                    score={45}
                    theme={currentTheme}
                  />

                  <DiagnosticRow
                    id="D-1028"
                    patient="Bouzid Boualam"
                    type="Parkinson"
                    date="8 Mai 2025"
                    score={62}
                    theme={currentTheme}
                  />
                </div>
              </CardContent>
              <CardFooter
                className={`p-4 border-t ${currentTheme === "dark" ? "border-slate-700/50" : "border-gray-300"}`}
              >
                <Button variant="ghost" className={`w-full ${buttonOutlineStyle}`}>
                  View All Diagnostics
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
     </div>
    </div>
  )
}

// ... Les composants restants (ActivityRow, PatientRow, DiagnosticRow, BarChartComponent, LineChartComponent, PieChartComponent) restent inchangés ...

// Composant pour les lignes d'activité
function ActivityRow({
  id,
  patient,
  type,
  date,
  status,
  theme,
}: {
  id: string
  patient: string
  type: string
  date: string
  status: string
  theme: "dark" | "light"
}) {
  const textPrimaryStyle = theme === "dark" ? "text-slate-100" : "text-gray-900"
  const textSecondaryStyle = theme === "dark" ? "text-slate-400" : "text-gray-700"

  return (

    <div className="grid grid-cols-12 py-3 px-4 text-sm hover:bg-gray-100">
      <div className="col-span-1 text-gray-500">{id}</div>
      <div className={`col-span-3 ${textPrimaryStyle}`}>{patient}</div>
      <div className={`col-span-2 ${textSecondaryStyle}`}>{type}</div>
      <div className={`col-span-2 ${textSecondaryStyle}`}>{date}</div>
      <div
        className={`col-span-2 ${status === "Complété" ? (theme === "dark" ? "text-green-400" : "text-green-600") : theme === "dark" ? "text-amber-400" : "text-amber-600"}`}
      >
        {status}
      </div>
      <div className="col-span-2 flex space-x-2">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <FileText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Activity className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Composant pour les lignes de patients
function PatientRow({
  name,
  id,
  age,
  condition,
  lastVisit,
  theme,
}: {
  name: string
  id: string
  age: number
  condition: string
  lastVisit: string
  theme: "dark" | "light"
}) {
  const textPrimaryStyle = theme === "dark" ? "text-slate-100" : "text-gray-900"
  const textSecondaryStyle = theme === "dark" ? "text-slate-400" : "text-gray-700"

  return (
    <div className="grid grid-cols-12 py-3 px-4 text-sm hover:bg-gray-100">
      <div className={`col-span-3 ${textPrimaryStyle}`}>{name}</div>
      <div className="col-span-2 text-gray-500">{id}</div>
      <div className={`col-span-1 ${textSecondaryStyle}`}>{age}</div>
      <div className={`col-span-2 ${textSecondaryStyle}`}>{condition}</div>
      <div className={`col-span-2 ${textSecondaryStyle}`}>{lastVisit}</div>
      <div className="col-span-2 flex space-x-2">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <FileText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Users className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Composant pour les lignes de diagnostics
function DiagnosticRow({
  id,
  patient,
  type,
  date,
  score,
  theme,
}: {
  id: string
  patient: string
  type: string
  date: string
  score: number
  theme: "dark" | "light"
}) {
  const textPrimaryStyle = theme === "dark" ? "text-slate-100" : "text-gray-900"
  const textSecondaryStyle = theme === "dark" ? "text-slate-400" : "text-gray-700"

  const getScoreColor = (score: number) => {
    if (score > 70) return theme === "dark" ? "text-red-400" : "text-red-600"
    if (score > 40) return theme === "dark" ? "text-amber-400" : "text-amber-600"
    return theme === "dark" ? "text-green-400" : "text-green-600"
  }

  return (
    <div className="grid grid-cols-12 py-3 px-4 text-sm hover:bg-gray-100">
      <div className="col-span-1 text-gray-500">{id}</div>
      <div className={`col-span-3 ${textPrimaryStyle}`}>{patient}</div>
      <div className={`col-span-2 ${textSecondaryStyle}`}>{type}</div>
      <div className={`col-span-2 ${textSecondaryStyle}`}>{date}</div>
      <div className={`col-span-2 ${getScoreColor(score)}`}>{score}%</div>
      <div className="col-span-2 flex space-x-2">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <FileText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Activity className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Composant pour le graphique en barres
function BarChartComponent({ theme, isWorkload = false }: { theme: "dark" | "light"; isWorkload?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const barWidth = isWorkload ? canvas.width / 8 : canvas.width / 13
    const barSpacing = isWorkload ? barWidth * 0.4 : barWidth * 0.3
    const maxBarHeight = canvas.height - 40

    // Données simulées
    const data = isWorkload ? [12, 18, 22, 15, 10, 5, 0] : [8, 12, 15, 10, 14, 18, 22, 19, 16, 12, 9, 11]

    const labels = isWorkload
      ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
      : ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]

    const maxValue = Math.max(...data)

    // Dessiner les barres
    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / maxValue) * maxBarHeight
      const x = i * (barWidth + barSpacing) + barSpacing
      const y = canvas.height - barHeight - 20

      // Couleur unie pour les barres, selon le thème
const barColor = theme === "dark" ? "#3B82F6" : "#2563EB" // blue-500 / blue-600

ctx.fillStyle = barColor
ctx.beginPath()
ctx.roundRect(x, y, barWidth, barHeight, 4)
ctx.fill()


      // Étiquettes
      ctx.fillStyle = theme === "dark" ? "rgba(148, 163, 184, 0.8)" : "rgba(71, 85, 105, 0.8)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(labels[i], x + barWidth / 2, canvas.height - 5)

      // Valeurs
      ctx.fillStyle = theme === "dark" ? "rgba(226, 232, 240, 0.8)" : "rgba(15, 23, 42, 0.8)"
      ctx.fillText(data[i].toString(), x + barWidth / 2, y - 5)
    }
  }, [theme, isWorkload])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

// Composant pour le graphique en ligne
function LineChartComponent({
  theme,
  isAccuracy = false,
  isProductivity = false,
}: {
  theme: "dark" | "light"
  isAccuracy?: boolean
  isProductivity?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Données simulées
    let data: number[]
    if (isAccuracy) {
      data = [78, 80, 82, 85, 87, 89, 90, 91, 92]
    } else if (isProductivity) {
      data = [65, 70, 68, 75, 82, 88, 92, 95, 94, 96, 98]
    } else {
      data = [5, 8, 12, 10, 15, 18, 14, 16, 12, 10, 14, 16]
    }

    const maxValue = Math.max(...data)
    const minValue = isAccuracy || isProductivity ? Math.min(...data) * 0.9 : 0
    const range = maxValue - minValue

    const pointSpacing = canvas.width / (data.length - 1)
    const points = data.map((value, index) => ({
      x: index * pointSpacing,
      y: canvas.height - ((value - minValue) / range) * (canvas.height - 40) - 20,
    }))

    // Dessiner la grille
    ctx.strokeStyle = theme === "dark" ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.5)"
    ctx.lineWidth = 0.5

    // Lignes horizontales
    for (let i = 0; i <= 4; i++) {
      const y = 20 + (i * (canvas.height - 40)) / 4
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Dessiner la ligne
    ctx.strokeStyle = theme === "dark" ? "rgba(56, 189, 248, 0.8)" : "rgba(37, 99, 235, 0.8)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    // Dessiner la zone sous la ligne
    ctx.fillStyle = theme === "dark" ? "rgba(56, 189, 248, 0.1)" : "rgba(37, 99, 235, 0.1)"
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }

    ctx.lineTo(points[points.length - 1].x, canvas.height - 20)
    ctx.lineTo(points[0].x, canvas.height - 20)
    ctx.closePath()
    ctx.fill()

    // Dessiner les points
    for (const point of points) {
      ctx.fillStyle = theme === "dark" ? "rgba(14, 165, 233, 1)" : "rgba(37, 99, 235, 1)"
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.8)"
      ctx.beginPath()
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Étiquettes
    const labels =
      isAccuracy || isProductivity
        ? ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov"]
        : ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]

    ctx.fillStyle = theme === "dark" ? "rgba(148, 163, 184, 0.8)" : "rgba(71, 85, 105, 0.8)"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    // Afficher quelques étiquettes (pas toutes pour éviter l'encombrement)
    const step = Math.ceil(labels.length / 6)
    for (let i = 0; i < points.length; i += step) {
      if (i < labels.length) {
        ctx.fillText(labels[i], points[i].x, canvas.height - 5)
      }
    }
  }, [theme, isAccuracy, isProductivity])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

// Composant pour le graphique en camembert
function PieChartComponent({ theme }: { theme: "dark" | "light" }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
  
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
  
      const ctx = canvas.getContext("2d")
      if (!ctx) return
  
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
  
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2 - 20 // Légère remontée pour libérer de la place en bas
      const radius = Math.min(centerX, centerY) - 40
  
      const data = [
        { label: "Alzheimer", value: 42, color: theme === "dark" ? "#3b82f6" : "#2563eb" },
        { label: "Parkinson", value: 28, color: theme === "dark" ? "#8b5cf6" : "#7c3aed" },
        { label: "Autres", value: 24, color: theme === "dark" ? "#10b981" : "#059669" },
      ]
  
      const total = data.reduce((sum, item) => sum + item.value, 0)
      let startAngle = -Math.PI / 2
  
      // Dessiner les parts
      for (const item of data) {
        const sliceAngle = (2 * Math.PI * item.value) / total
  
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
        ctx.closePath()
  
        ctx.fillStyle = item.color
        ctx.fill()
  
        ctx.strokeStyle = theme === "dark" ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.8)"
        ctx.lineWidth = 1
        ctx.stroke()
  
        const midAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 0.7
        const labelX = centerX + labelRadius * Math.cos(midAngle)
        const labelY = centerY + labelRadius * Math.sin(midAngle)
  
        const percentage = Math.round((item.value / total) * 100)
        ctx.fillStyle = "white"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${percentage}%`, labelX, labelY)
  
        startAngle += sliceAngle
      }
  
      // ✅ Légende en bas, centrée
      const legendY = canvas.height - 60
      const boxSize = 12
      const spacing = 20
      const textPadding = 6
      const totalLegendWidth = data.length * (boxSize + spacing + 60) // approx largeur totale
      let legendX = (canvas.width - totalLegendWidth) / 2
  
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const x = legendX + i * (boxSize + spacing + 60)
  
        // Carré
        ctx.fillStyle = item.color
        ctx.fillRect(x, legendY, boxSize, boxSize)
  
        // Label
        ctx.fillStyle = theme === "dark" ? "rgba(226, 232, 240, 0.8)" : "rgba(15, 23, 42, 0.8)"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        ctx.fillText(item.label, x + boxSize + textPadding, legendY + boxSize / 2)
      }
    }, [theme])
  
    return <canvas ref={canvasRef} className="w-full h-full" />
  }
  

  
