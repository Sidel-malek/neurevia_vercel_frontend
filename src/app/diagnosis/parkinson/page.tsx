"use client"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  AlertCircle,
  Brain,
  FileText,
  Info,
  Microscope,
  Upload,
  X,
  Activity,
  ArrowLeft,
  Minus,
  Plus,
  Settings,
} from "lucide-react"
import ProgressBar from "@/components/ProgressBar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Sidebar from "@/components/Sidebar"
import HeaderInside from "@/components/headerInside"
import PatientSelectionHeader from "@/components/PatientSelectionHeader";
import{BiomarkerField}
 from "@/components/BiomarkerField_park"

import { getThemeStyles } from "@/lib/themeStyles";
type Biomarker = {
  label: string
  value: string
}

interface Option {
  value: string | number;
  label: string;
}

const BIOMARKER_CATEGORIES = {
  clinical: {
    title: "Clinical Assessments",
    fields: {
      UPDRS: {
        label: "Unified Parkinson's Disease Rating Scale (UPDRS)",
        type: "number",
        range: "0-199",
        description: "Comprehensive assessment of motor and non-motor symptoms",
      },
      Tremor: {
        label: "Tremor Score",
        type: "number",
        range: "0-10",
        description: "Severity of resting tremor",
      },
      FunctionalAssessment: {
        label: "Functional Assessment",
        type: "number",
        range: "0-100",
        description: "Overall functional capacity score",
      },
      Rigidity: {
        label: "Rigidity Score",
        type: "number",
        range: "0-10",
        description: "Muscle stiffness assessment",
      },
      Bradykinesia: {
        label: "Bradykinesia Score",
        type: "number",
        range: "0-10",
        description: "Slowness of movement assessment",
      },
      MoCA: {
        label: "Montreal Cognitive Assessment (MoCA)",
        type: "number",
        range: "0-30",
        description: "Cognitive function assessment",
      },
      PosturalInstability: {
        label: "Postural Instability Score",
        type: "number",
        range: "0-10",
        description: "Balance and postural control assessment",
      },
      Depression: {
        label: "Depression Score",
        type: "number",
        range: "0-10",
        description: "Depression severity assessment",
      },
      SleepQuality: {
        label: "Sleep Quality Score",
        type: "number",
        range: "0-10",
        description: "Sleep quality rating (0=poor, 10=excellent)",
      },
    },
  },
  demographic: {
    title: "Demographic & Health Metrics",
    fields: {
      Age: {
        label: "Age",
        type: "number",
        range: "18-120",
        unit: "years",
        description: "Patient age in years",
      },
      BMI: {
        label: "Body Mass Index (BMI)",
        type: "number",
        range: "10-50",
        unit: "kg/m²",
        description: "Body mass index",
      },
      DiastolicBP: {
        label: "Diastolic Blood Pressure",
        type: "number",
        range: "40-120",
        unit: "mmHg",
        description: "Diastolic blood pressure measurement",
      },
    },
  },
  medical: {
    title: "Medical History",
    fields: {
      Diabetes: {
        label: "Diabetes",
        type: "select",
        options: [
          { value: "", label: "Select..." },
          { value: "0", label: "No" },
          { value: "1", label: "Yes" },
        ],
        description: "Diabetes diagnosis status",
      },
      Stroke: {
        label: "Stroke History",
        type: "select",
        options: [
          { value: "", label: "Select..." },
          { value: "0", label: "No" },
          { value: "1", label: "Yes" },
        ],
        description: "History of stroke",
      },
    },
  },
}

export default function ParkinsonsTools() {
  const [loading, setLoading] = useState(false)
  const [predictionResult, setPredictionResult] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
 

  // === Auto-generate available labels ===
  const availableLabels = Object.values(BIOMARKER_CATEGORIES)
    .flatMap((category) => Object.values(category.fields))
    .map((field) => field.label)
  const [biomarkerLoading, setBiomarkerLoading] = useState(false)
  const [biomarkerSuccess, setBiomarkerSuccess] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const [activeTab, setActiveTab] = useState("datscan")
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("light")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [patientName, setPatientName] = useState("")
  const [patientAge, setPatientAge] = useState("")
  const [notes, setNotes] = useState("")
  const router = useRouter()
  const [analysisDone, setAnalysisDone] = useState(false)
  const [currentView, setCurrentView] = useState<"input" | "mri-results" | "biomarker-results">("input")
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const [selectedBiomarkers, setSelectedBiomarkers] = useState<{ [key: string]: string | number }>({})
  const [activeCategory, setActiveCategory] = useState("clinical")
  const [progress, setProgress] = useState(0)
  const [biomarkers, setBiomarkers] = useState([
    { label: "Biomarker 1", value: "" },
    { label: "Biomarker 2", value: "" },
  ])

  const [isLoading, setIsLoading] = useState(true)
  const [backendConnected, setBackendConnected] = useState<boolean>(false)
  // Utility function for progress simulation
const simulateProgress = (
  setProgress: (value: number) => void, 
  duration: number = 3000, // 3 seconds default
  interval: number = 100   // Update every 100ms
) => {
  return new Promise<void>((resolve) => {
    let progress = 0;
    const increment = 100 / (duration / interval);
    const progressInterval = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        setProgress(100);
        clearInterval(progressInterval);
        resolve();
      } else {
        setProgress(Math.min(progress, 99)); // Cap at 99% until final resolve
      }
    }, interval);
  });
};

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };
  
   // Handle patient selection from header component
  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setPatientName(
      patient ? `${patient.user.first_name} ${patient.user.last_name}` : "",
    );
    setPatientAge(
      patient?.user.date_of_birth
        ? calculateAge(patient.user.date_of_birth)
        : "",
    );
  };
   const handleNewPatientSelection = () => {
  // Reset all patient-related states
  setSelectedPatient(null)
  setPatientName("")
  setPatientAge("")
  setNotes("")
}
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  
const handleBiomarkerSubmit = async () => {
  setBiomarkerLoading(true);
  setBiomarkerSuccess(false);
  setAnalysisProgress(0);

  if (!selectedBiomarkers) {
    alert("Please write at least 4 biomarkers.");
    return;
  }
  
  if (!selectedPatient) {
    alert("Please select a patient before analysis.");
    return;
  }

  try {
    // Start progress simulation
    const progressPromise = simulateProgress(setAnalysisProgress, 4000);

    const biomarkersData = {
  clinical: {} as Record<string, number>,
  demographic: {} as Record<string, number>,
  medical: {} as Record<string, number>,
}

// ✅ Organiser les biomarqueurs
Object.entries(selectedBiomarkers).forEach(([key, value]) => {
  if (value !== "" && value !== null && value !== undefined) {
    const numericValue = Number(value)

    if (key in BIOMARKER_CATEGORIES.clinical.fields) {
      biomarkersData.clinical[key] = numericValue
    } else if (key in BIOMARKER_CATEGORIES.demographic.fields) {
      biomarkersData.demographic[key] = numericValue
    } else if (key in BIOMARKER_CATEGORIES.medical.fields) {
      biomarkersData.medical[key] = numericValue
    }
  }
})

// ✅ Vérification simple
if (
  Object.keys(biomarkersData.clinical).length === 0 &&
  Object.keys(biomarkersData.demographic).length === 0 &&
  Object.keys(biomarkersData.medical).length === 0
) {
  alert("Veuillez saisir au moins une valeur de biomarqueur")
  setBiomarkerLoading(false)
  return
}


    const requestData = {
      patno: `P_${Date.now()}`,
      patient_name: patientName || "Patient Inconnu",
      patient_age: patientAge || undefined,
      doctor_name: "Dr. Bouchnek",
      notes: notes || "",
      biomarkers: biomarkersData,
      patient_id: (selectedPatient.id ?? selectedPatient.patient_id),
    }

    // Wait for progress simulation to complete or API call to finish
    const [_, response] = await Promise.all([
      progressPromise,
      fetch(`${apiUrl}/api/predict/clinical-data/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      })
    ]);

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const result = await response.json();
    
    // Final progress update
    setAnalysisProgress(100);
    setBiomarkerSuccess(true);

    // Small delay to show 100% completion
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 🔹 Sauvegarder l'ID et rediriger
    router.push(`/results/parkinson/clinical-result?analysis_id=${result.id}`);

  } catch (error: any) {
    console.error("[v0] Error submitting biomarkers:", error);
    alert(`Erreur lors du traitement des biomarqueurs: ${error.message}`);
  } finally {
    setBiomarkerLoading(false);
    setAnalysisProgress(0);
  }
}

const handleCombinedAnalysis = async () => {
  if (!files.length) {
    alert("Please upload at least one DaTscan image before analysis.");
    return;
  }

  if (Object.keys(selectedBiomarkers).length === 0) {
    alert("Please enter at least one biomarker value before analysis.");
    return;
  }

  if (!selectedPatient) {
    alert("Please select a patient before analysis.");
    return;
  }

  setLoading(true);
  setAnalysisProgress(0);

  try {
    // Start progress simulation
    const progressPromise = simulateProgress(setAnalysisProgress, 6000);

    // Préparer les données des biomarqueurs
    const biomarkersData = {
      clinical: {} as Record<string, number>,
      demographic: {} as Record<string, number>,
      medical: {} as Record<string, number>,
    };

    // Organiser les biomarqueurs
    Object.entries(selectedBiomarkers).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        const numericValue = Number(value);

        if (key in BIOMARKER_CATEGORIES.clinical.fields) {
          biomarkersData.clinical[key] = numericValue;
        } else if (key in BIOMARKER_CATEGORIES.demographic.fields) {
          biomarkersData.demographic[key] = numericValue;
        } else if (key in BIOMARKER_CATEGORIES.medical.fields) {
          biomarkersData.medical[key] = numericValue;
        }
      }
    });

    // Préparer FormData pour l'envoi
    const formData = new FormData();
    
    // Ajouter les fichiers DaTscan
    files.forEach((file, index) => {
      formData.append(`datscan_file_${index}`, file);
    });

    // Ajouter les données des biomarqueurs
    formData.append("biomarkers", JSON.stringify(biomarkersData));
    formData.append("patient_id", selectedPatient.id ?? selectedPatient.patient_id);
    formData.append("notes", notes || "");
    formData.append("file_count", files.length.toString());

    console.log("📤 Envoi des données combinées au backend...");

    const [_, response] = await Promise.all([
      progressPromise,
      fetch(`${apiUrl}/api/predict/parkinson_combined/`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
    ]);

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const result = await response.json();

    // Final progress update
    setAnalysisProgress(100);
    await new Promise(resolve => setTimeout(resolve, 300));

    // Sauvegarder et rediriger vers la page de résultats combinés
    localStorage.setItem("parkinson_combined_result", JSON.stringify(result));
    router.push(`/results/parkinson/clinical-result?analysis_id=${result.analyse_id}`);

  } catch (error: any) {
    console.error("[Combined] Error in combined analysis:", error);
    alert(`Erreur lors de l'analyse combinée: ${error.message}`);
  } finally {
    setLoading(false);
    setAnalysisProgress(0);
  }
};

  

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleChange = (index: number, key: keyof Biomarker, value: string) => {
    setBiomarkers((prev) => {
      const newBiomarkers = [...prev]
      newBiomarkers[index][key] = value
      return newBiomarkers
    })
  }

  const handleAdd = () => {
    // Placeholder for handleAdd function
    setBiomarkers((prev) => [...prev, { label: "", value: "" }])
  }

  const handleRemove = () => {
    // Placeholder for handleRemove function
    setBiomarkers((prev) => prev.slice(0, -1))
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
    setIsUploaded(true);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
      setIsUploaded(true);
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setIsUploaded(false)
  }

  const startAnalysis = () => {
    setIsAnalyzing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10
        if (next >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setAnalysisDone(true) // ✅ déclenche useEffect
          return 100
        }
        return next
      })
    }, 300)
  }

  const handleBiomarkerChange = (fieldKey: string, value: string) => {
    setSelectedBiomarkers((prev) => ({
      ...prev,
      [fieldKey]: value,
    }))
  }

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

  const styles = getThemeStyles(currentTheme, isDragging);
  
 
const handleAnalyse = async () => {
  if (!files.length) {
    alert("Please upload at least one MRI scan before analysis.");
    return;
  }
  
  if (!selectedPatient) {
    alert("Please select a patient before analysis.");
    return;
  }

  setLoading(true);
  setAnalysisProgress(0);

  try {
    // Start progress simulation (longer for DATScan)
    const progressPromise = simulateProgress(setAnalysisProgress, 5000);

    const formData = new FormData();
    formData.append("image", files[0]);
    formData.append("patient_id", (selectedPatient.id ?? selectedPatient.patient_id));

    console.log("📤 Envoi de l'image au backend...");
    
    const [_, res] = await Promise.all([
      progressPromise,
      fetch(`${apiUrl}/api/datscan/predict/`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
    ]);

    if (!res.ok) throw new Error("Échec de l'envoi de l'image");

    const postData = await res.json();

    const { analysis_id } = postData;
    if (!analysis_id) throw new Error("Aucun analysis_id retourné par l'API");

    // 🔹 GET avec retry si le résultat n'est pas encore dispo
    let data = null;
    let attempts = 0;
    
    // Continue progress simulation during retry attempts
    const retryProgress = setInterval(() => {
      setAnalysisProgress(prev => Math.min(prev + 5, 95));
    }, 500);

    while (attempts < 3) {
      console.log(`🔎 Tentative ${attempts + 1}/3 pour récupérer le résultat...`);
      try {
        const resultRes = await fetch(`${apiUrl}/api/datscan/result/${analysis_id}/`);
        console.log("🔍 Status GET:", resultRes.status);
        
        if (!resultRes.ok) {
          const errData = await resultRes.json();
          console.error("❌ Erreur GET result:", errData);
          throw new Error(errData.error || "Résultat pas encore disponible");
        }

        data = await resultRes.json();
        clearInterval(retryProgress);
        break; // ✅ Succès, on sort de la boucle
      } catch (err) {
        attempts++;
        if (attempts >= 3) {
          clearInterval(retryProgress);
          throw err;
        }
        console.warn("⚠️ Résultat non prêt, nouvelle tentative dans 1s...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!data) throw new Error("Impossible de récupérer le résultat après plusieurs tentatives");

    // Final progress update
    setAnalysisProgress(100);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 🔹 Sauvegarder et rediriger
    localStorage.setItem("parkinson_result", JSON.stringify(data));
    router.push(`/results/parkinson/datscan-result?analysis_id=${analysis_id}`);

  } catch (err) {
    console.error("❌ Erreur lors de l'analyse :", err);
    alert("Erreur serveur lors de l'analyse. Vérifie le backend ou la connexion.");
  } finally {
    setLoading(false);
    setAnalysisProgress(0);
  }
};

  return (
    <div className="flex">
      <Sidebar />
      <div className={` ${styles.bgStyle} w-full`}>
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

        <div className="px-6 pt-6 flex items-center gap-3">
      <button
        onClick={() => router.push("/diagnostic-tools")}
        className="flex items-center gap-1 text-sm text-gray-900 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
        <h5 className={`text-3xl font-bold ${styles.textPrimaryStyle}`}>
        Parkinson
      </h5>
      </button>

      
    </div> 

        <div className="container mx-auto px-4 py-8">

           {/* Patient Selection Header */}
                  <PatientSelectionHeader
                    onPatientSelect={handlePatientSelect}
                    onCreatePatient={handleNewPatientSelection}
                  />

          {/* Tabs */}
          <Tabs
            defaultValue="datscan"
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className={`grid w-full grid-cols-3 mb-8  ${styles.tabsBgStyle} p-1`}>
              <TabsTrigger
                value="datscan"
                className={`flex items-center gap-2 ${styles.tabsActiveStyle}`}
              >
                <Brain className="h-5 w-5" />
                DaTscan-SPECT Analysis
              </TabsTrigger>
              <TabsTrigger
                value="biomarker"
                className={`flex items-center gap-2 ${styles.tabsActiveStyle} `}
              >
                <Activity className="h-5 w-5" />
                Medical Records Analysis
              </TabsTrigger>
              <TabsTrigger
                value="combined"
                className={`flex items-center gap-2 ${styles.tabsActiveStyle} `}
              >
                <Microscope className="h-5 w-5" />
                Combined Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="datscan">
              <Card className={`${styles.cardBgStyle} backdrop-blur-sm `}>
                <CardContent className="p-6">
                  {/* Info box */}
                  <div className={`${styles.infoBgStyle} p-4 rounded-lg mb-8 flex items-start`}>
                    <Info className={`${styles.infoTextStyle} mr-3 mt-0.5 h-5 w-5 flex-shrink-0`} />
                    <p className={styles.textSecondaryStyle}>
                      Upload DaTscan-SPECT images to analyze dopamine transporter density and detect early signs of
                      Parkinson&apos;s disease. Our AI algorithm will identify affected regions in the striatum and provide a
                      confidence score.
                    </p>
                  </div>

                  {/* Upload section */}
                  <div className="mb-6">
                    <h2 className={`text-xl font-semibold ${styles.textPrimaryStyle} mb-4 flex items-center`}>
                      <Upload className="mr-2 h-5 w-5 text-blue-600" />
                      Secure DaTscan-SPECT Images Upload Interface
                    </h2>

                    <div
                                        className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors ${
                                          isUploaded
                                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                            : styles.uploadBorderStyle
                                        } `}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                      >
                                        <div className="relative w-16 h-16 mb-4">
                                          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <Upload className="h-10 w-10 text-blue-600" />
                                          </div>
                                        </div>
                                        <h3
                                          className={`text-lg font-medium ${styles.textPrimaryStyle} mb-1`}
                                        >
                                          Drag & drop files here
                                        </h3>
                                        <p className={`text-sm mb-4 ${styles.textSecondaryStyle}`}>or</p>

                                    
                                        <Button
                                          onClick={handleBrowseClick}
                                          className={styles.buttonPrimaryStyle}
                                        >
                                          Browse Files
                                        </Button>
                                        <input
                                          type="file"
                                          ref={fileInputRef}
                                          onChange={handleFileChange}
                                          className="hidden"
                                          accept=".jpg ,.png , .jpeg "
                                        />
                                        <p className={`mt-4 text-xs ${styles.textTertiaryStyle}`}>
                                          Supported formats: (.jpeg, .jpg , .png)
                                        </p>
                                        {/* File list */}
                                    {files && (
                                      <div className="m-8">
                                        <div className="space-y-2">
                                          {files.map((file, index) => (
                                            <div
                                              key={index}
                                              className={`flex items-center justify-between ${styles.fileItemBgStyle} p-3 rounded-md`}
                                            >
                                              <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                                                <span className={`text-sm ${styles.textPrimaryStyle}`}>
                                                  {file.name}
                                                </span>
                                                <span
                                                  className={`ml-2 text-xs ${styles.textTertiaryStyle}`}
                                                >
                                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFile(index)}
                                                className={`h-8 w-8 p-0 ${styles.textSecondaryStyle} hover:text-red-400 hover:bg-gray-200`}
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                    
                                        
                                      </div>
                                    )}
                    </div>

                     <div className="mt-8">
  {analysisProgress > 0 && analysisProgress < 100 && files && (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <span className={`text-sm ${styles.textSecondaryStyle}`}>
          Analyzing Clinical data...
        </span>
        <span className="text-sm text-blue-600">
          {analysisProgress}%
        </span>
      </div>
      <ProgressBar progress={analysisProgress} />
      <div
        className={`text-xs ${styles.textTertiaryStyle} animate-pulse`}
      >
        AI model processing Clinical data analysis
      </div>
    </div>
  )}
    <div className="mt-6 flex justify-end">
      <Button
        onClick={handleAnalyse}
        className={styles.buttonPrimaryStyle}
      >
        {loading ? "Analysis in progress..." : "Analyze"}
      </Button>
    </div>
  
                    </div>


                  </div>

                 
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="biomarker">
              <Card className={`${styles.cardBgStyle} backdrop-blur-sm `}>
                <CardContent className="p-6">
                  
                  <div
                    className={`${styles.infoBgStyle} p-4 rounded-lg mb-8 flex items-start`}
                  >
                    <AlertCircle
                      className={`${styles.infoTextStyle} mr-3 mt-0.5 h-5 w-5 flex-shrink-0`}
                    />
                    <p className={styles.textSecondaryStyle}>
                      Enter comprehensive medical records and biomarker data based on standardized Parkinson&apos;s research
                      protocols. Select clinical assessments from different categories and input their values according
                      to established ranges.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h2 className={`text-xl font-semibold ${styles.textPrimaryStyle} mb-4 flex items-center`}>
                      <Microscope className="mr-2 h-5 w-5 text-blue-600" />
                      Comprehensive Medical Records & Biomarker Assessment
                    </h2>

                    {/* Category Navigation */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {Object.entries(BIOMARKER_CATEGORIES).map(([key, category]) => (
                        <Button
                          key={key}
                          variant={activeCategory === key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveCategory(key)}
                          className={activeCategory === key ? styles.buttonPrimaryStyle : styles.buttonOutlineStyle}
                        >
                          {category?.title || "Untitled"}
                        </Button>
                      ))}
                    </div>

                    {/* Active Category Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  {Object.entries(
    BIOMARKER_CATEGORIES[activeCategory as keyof typeof BIOMARKER_CATEGORIES]?.fields || {}
  ).map(([fieldKey, field]) => (
    <BiomarkerField
      key={fieldKey}
      fieldKey={fieldKey}
      field={field}
      value={selectedBiomarkers[fieldKey]}
      onChange={handleBiomarkerChange}
      styles={styles}
    />
  ))}
</div>

                    

                    {/* Summary of selected biomarkers */}
                    {Object.keys(selectedBiomarkers).length > 0 && (
                      <div className={`mt-6 ${styles.fileItemBgStyle} rounded-lg p-4`}>
                        <h4 className={`text-sm font-medium ${styles.textPrimaryStyle} mb-2`}>
                          Selected Biomarkers ({Object.keys(selectedBiomarkers).length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(selectedBiomarkers).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs font-normal text-white/90">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-8">
  {analysisProgress > 0 && analysisProgress < 100 && (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <span className={`text-sm ${styles.textSecondaryStyle}`}>
          Analyzing Clinical data...
        </span>
        <span className="text-sm text-blue-600">
          {analysisProgress}%
        </span>
      </div>
      <ProgressBar progress={analysisProgress} />
      <div
        className={`text-xs ${styles.textTertiaryStyle} animate-pulse`}
      >
        AI model processing Clinical data analysis
      </div>
    </div>
  )}
    <div className="mt-6 flex justify-end">
      <Button
        onClick={handleBiomarkerSubmit}
        className={styles.buttonPrimaryStyle}
      >
        {loading ? "Analysis in progress..." : "Analyze"}
      </Button>
    </div>
  
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="combined">
  <Card className={`${styles.cardBgStyle} backdrop-blur-sm`}>
    <CardContent className="p-6">
      {/* Info box */}
      <div className={`${styles.infoBgStyle} p-4 rounded-lg mb-8 flex items-start`}>
        <Info className={`${styles.infoTextStyle} mr-3 mt-0.5 h-5 w-5 flex-shrink-0`} />
        <p className={styles.textSecondaryStyle}>
          Combined analysis integrates DaTscan-SPECT imaging data with clinical biomarker results for comprehensive Parkinson&apos;s diagnostic assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* DaTscan Upload Section */}
        <div className={`${styles.fileItemBgStyle} rounded-lg p-6`}>
          <h3 className={`text-lg font-medium ${styles.textPrimaryStyle} mb-3 flex items-center`}>
            <Brain className="h-5 w-5 mr-2 text-blue-600" />
            DaTscan-SPECT Data
          </h3>
          <p className={`text-sm ${styles.textSecondaryStyle} mb-4`}>Upload DaTscan-SPECT images</p>

          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${styles.uploadBorderStyle}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h4 className={`text-md font-medium ${styles.textPrimaryStyle} mb-1`}>Drag & drop files</h4>
            <p className={`text-sm ${styles.textSecondaryStyle} mb-2`}>or</p>
            <Button onClick={handleBrowseClick} className={styles.buttonPrimaryStyle}>
              Browse Files
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept=".jpg,.png,.jpeg"
            />
            <p className={`mt-3 text-xs ${styles.textTertiaryStyle}`}>
              Supported formats: JPEG, PNG
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between ${styles.fileItemBgStyle} p-3 rounded-md mb-2`}
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <span className={`text-sm ${styles.textPrimaryStyle}`}>
                      {file.name}
                    </span>
                    <span className={`ml-2 text-xs ${styles.textTertiaryStyle}`}>
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className={`h-8 w-8 p-0 ${styles.textSecondaryStyle} hover:text-red-400 hover:bg-gray-200`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Biomarker Input Section */}
        <div className={`${styles.fileItemBgStyle} rounded-lg p-6`}>
          <h3 className={`text-lg font-medium ${styles.textPrimaryStyle} mb-3 flex items-center`}>
            <Microscope className="h-5 w-5 mr-2 text-blue-600" />
            Clinical Biomarker Data
          </h3>
          <p className={`text-sm ${styles.textSecondaryStyle} mb-4`}>Input clinical assessment results</p>

          {/* Category Selection */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(BIOMARKER_CATEGORIES).map(([key, category]) => (
              <Button
                key={key}
                variant={activeCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(key)}
                className={activeCategory === key ? styles.buttonPrimaryStyle : styles.buttonOutlineStyle}
              >
                {category.title}
              </Button>
            ))}
          </div>

          {/* Active Category Fields */}
          <div className={`border-2 border-dashed ${styles.uploadBorderStyle} rounded-lg p-4`}>
            <h4 className={`text-md font-medium ${styles.textPrimaryStyle} mb-3`}>
              {BIOMARKER_CATEGORIES[activeCategory as keyof typeof BIOMARKER_CATEGORIES].title}
            </h4>

            <div className="space-y-3">
              {Object.entries(BIOMARKER_CATEGORIES[activeCategory as keyof typeof BIOMARKER_CATEGORIES].fields).map(
                ([fieldKey, field]) => (
                  <div key={fieldKey} className="space-y-1">
                    <label className={`text-sm font-medium ${styles.textPrimaryStyle} block`}>
                      {field.label}
                      {"range" in field && field.range && (
                        <span className={`text-xs ${styles.textTertiaryStyle} ml-2`}>
                          ({field.range} {"unit" in field ? field.unit : ""})
                        </span>
                      )}
                    </label>

                    {field.type === "select" && 'options' in field ? (
                      <select
                        value={selectedBiomarkers[fieldKey] || ""}
                        onChange={(e) => handleBiomarkerChange(fieldKey, e.target.value)}
                        className={`w-full ${styles.inputBgStyle} border rounded-md p-2`}
                      >
                        <option value="">Select...</option>
                        {(field.options as Option[]).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={field.type === "number" ? "number" : "text"}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        value={selectedBiomarkers[fieldKey] || ""}
                        onChange={(e) => handleBiomarkerChange(fieldKey, e.target.value)}
                        className={styles.inputBgStyle}
                      />
                    )}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Summary of selected biomarkers */}
          {Object.keys(selectedBiomarkers).length > 0 && (
            <div className={`mt-6 ${styles.fileItemBgStyle} rounded-lg p-4`}>
              <h4 className={`text-sm font-medium ${styles.textPrimaryStyle} mb-2`}>
                Selected Biomarkers ({Object.keys(selectedBiomarkers).length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedBiomarkers).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="text-xs font-normal text-white/90">
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress and Analysis Button */}
      <div className="flex flex-col items-center">
        {analysisProgress > 0 && analysisProgress < 100 && (
          <div className="w-full max-w-md mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${styles.textSecondaryStyle}`}>
                Analyzing combined data...
              </span>
              <span className="text-sm text-blue-600">
                {analysisProgress}%
              </span>
            </div>
            <ProgressBar progress={analysisProgress} />
            <div className={`text-xs ${styles.textTertiaryStyle} animate-pulse mt-2 text-center`}>
              AI model processing DaTscan and clinical data
            </div>
          </div>
        )}

        <Button
          onClick={handleCombinedAnalysis}
          className={styles.buttonPrimaryStyle}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Run Combined Parkinson's Analysis"}
        </Button>

        <div className="flex items-center text-xs text-blue-600 mt-2">
          Combined analysis provides comprehensive Parkinson&apos;s diagnostic assessment
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>



          </Tabs>

        </div>
      </div>
    </div>
  )
}


