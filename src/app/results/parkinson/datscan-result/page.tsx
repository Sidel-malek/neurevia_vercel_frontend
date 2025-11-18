"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import ProgressCustom from "@/components/progress-custom"
import { Suspense } from 'react';
import Loading from "@/components/loading_"

import {
  ArrowLeft,
  Users,
  Brain,
  Activity,
  BarChart3,
  Download,
  Share2,
  ScanEye,
  FileText, HeartPulse, Calendar,   
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import HeaderInside from "@/components/headerInside"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface ParkinsonResult {
  analysis_id: string
  result: string
  confidence: number
  probability?: number
  heatmap?: string | null
  probabilities?: {
    PD: number
    HC: number
  }
  created_at?: string,
  patient_id: any,
}

interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  gender?: string
}

function DatScanResultContent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const [resultData, setResultData] = useState<ParkinsonResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("datscan-patterns")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<String | null>(null);
  const router = useRouter()
  const [analysisId, setAnalysisId] = useState<string | null>(null)

  const searchParams = useSearchParams();
  
  // Utility function to format date
  const formatDate = (isoString: string) => {
    if (!isoString) return "--";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // 🔄 Récupération du résultat dans localStorage
  useEffect(() => {
    try {
      const analysisId = searchParams.get('analysis_id');
      setAnalysisId(analysisId)

      const stored = localStorage.getItem("parkinson_result")
      if (stored) {
        const parsed: ParkinsonResult = JSON.parse(stored)

        if (!parsed.probabilities) {
          const pdProb = parsed.probability ?? parsed.confidence / 100
          parsed.probabilities = {
            PD: +(pdProb * 100).toFixed(2),
            HC: +((1 - pdProb) * 100).toFixed(2),
          }
        }

        setResultData(parsed)
      }
    } catch (err) {
      console.error("Failed to parse stored Parkinson result:", err)
      setResultData(null)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchAnalysisData = async () => {
      
      try {   
        const analysis_id = localStorage.getItem("analysis_id")
  
        const patientResponse = await fetch(`${apiUrl}/api/patients/${resultData?.patient_id}/`, {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: "include",
        });
  
        if (patientResponse.ok) {
          const patientData = await patientResponse.json();
          setSelectedPatient(patientData);
        }
  
      } catch (error) {
        console.error("Error fetching analysis data:", error);
        setError((error as Error)?.message || "Failed to load analysis data");
      } finally {
        setLoading(false);
      }
    };
  
    if (resultData?.patient_id) {
      fetchAnalysisData();
    }
  }, [resultData]);

  const handleNewAnalysis = () => router.push("/diagnosis/parkinson")

  const handleExportReport = async () => {
    if (!analysisId) {
      alert("No analysis ID found. Please run a prediction first.")
      return
    }

    try {

      const res = await fetch(
        `${apiUrl}/api/datscan/export/${analysisId}/`,
        {
          credentials: "include",
        }
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `Failed to export PDF (status ${res.status})`)
      }

      const blob = await res.blob()
      
      if (blob.size === 0 || blob.type !== 'application/pdf') {
        throw new Error('Invalid PDF file received')
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `parkinson-datscan-report-${analysisId}.pdf`
      document.body.appendChild(a)
      a.click()
      
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
    } catch (err) {
      console.error("PDF export failed:", err)
      alert(`Failed to export PDF: ${err}`)
    }
  }

  const handleShareWithTeam = () => alert("Analysis shared successfully with the team!")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading DATscan results...</p>
        </div>
      </div>
    )
  }

  if (!resultData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-lg font-medium">No DATscan results found</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 bg-transparent mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const confidence = Number(resultData.confidence?.toFixed(2))

  const getRiskLevel = (confidence: number, result: string) => {
    if (confidence >= 70)
      return {
        label: "High Confidence",
        color: result === "PD" ? "red" : "green",
        risk: result,
      };
    if (confidence >= 30)
      return {
        label: "Moderate Confidence",
        color: result === "HC" ? "green" : "orange",
        risk: result,
      };
    return {
      label: "Low Confidence",
      color: result === "PD" ? "red" : "green",
      risk: result,
    };
  };

  const riskLevel = getRiskLevel(confidence, resultData.result);

  const isPD = resultData.result === "PD";
  const probabilityData = [
     { name: "PD", value: isPD ? resultData.confidence : 100 - resultData.confidence },
     { name: "HC", value: isPD ? 100 - resultData.confidence : resultData.confidence },
  ];
  const COLORS = ["#ef4444", "#22c55e"]

  const ProbabilityDistribution = () => (
    <div className="flex flex-col items-center mt-4">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={probabilityData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${percent ? ((percent as number) * 100).toFixed(0) : 0}%`
            }
          >
            {probabilityData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-1 text-center">
        <p className="text-red-600 font-semibold text-lg">
          PD: { isPD ? resultData.confidence.toFixed(2) : (100 - resultData.confidence).toFixed(2)}%
        </p>
        <p className="text-green-600 font-semibold text-lg">
          HC: {isPD ? (100 - resultData.confidence).toFixed(2) : resultData.confidence.toFixed(2)}%
        </p>
      </div>
    </div>
  )

  const DiagnosticHeader = () => (
    <Card className="border-border overflow-hidden">
      <CardHeader className="pb-4 bg-muted/30">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Diagnostic Results
          </CardTitle>
          <Badge
            className={
              riskLevel.color === "red"
                ? "bg-red-500 text-white"
                : riskLevel.color === "orange"
                ? "bg-yellow-400 text-white"
                : "bg-green-500 text-white"
            }
          >
            {riskLevel.risk}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-full ${
              riskLevel.color === "red"
                ? "bg-red-100"
                : riskLevel.color === "orange"
                ? "bg-yellow-100"
                : "bg-green-100"
            }`}
          >
            <Activity
              className={`h-8 w-8 ${
                riskLevel.color === "red"
                  ? "text-red-600"
                  : riskLevel.color === "orange"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{resultData.result === "HC" ? " Healthy Control" : " Parkinson's Disease"}</h2>
            <p className="text-muted-foreground mt-1">
              DATscan-based Parkinson&apos;s detection
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Overall Confidence
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{confidence.toFixed(2)}%</span>
              <Badge
                variant="outline"
                className={
                  riskLevel.color === "red"
                    ? "text-red-500 border-red-300"
                    : riskLevel.color === "orange"
                    ? "text-yellow-500 border-yellow-300"
                    : "text-green-500 border-green-300"
                }
              >
                {riskLevel.label}
              </Badge>
            </div>
            <ProgressCustom
              value={confidence}
              max={100}
              className="w-full"
              indicatorClassName={
                riskLevel.color === "red"
                  ? "bg-red-500"
                  : riskLevel.color === "orange"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }
              showLabel={true}
            />
          </div>
        </div>

        <ProbabilityDistribution />
      </CardContent>
    </Card>
  )

  const ExplainableAI = () => (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ScanEye className="h-5 w-5 text-blue-700" />
            <CardTitle>Explainable AI Analysis</CardTitle>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Understanding the brain regions that influenced this prediction
        </p>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="datscan-patterns"
          className="w-full mt-2"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-1 w-full">
            <TabsTrigger value="datscan-patterns" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              DATscan Heatmap Visualization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="datscan-patterns" className="pt-4">
            <div className="space-y-4">
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="bg-muted/50 rounded-md">
                  {resultData.heatmap ? (
                    <img
                      src={`data:image/png;base64,${resultData.heatmap}`}
                      alt="DATscan Heatmap Analysis"
                      className="h-full w-full rounded-md shadow-md"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ScanEye className="h-10 w-10 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Heatmap visualization not available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  const ClinicalRecommendations = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-accent" />
          <CardTitle>Clinical Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Immediate Actions</h4>
            <div className="space-y-3">
              {riskLevel.color === "red" ? (
                <>
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <Activity className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Further Neurological Assessment</p>
                      <p className="text-xs text-muted-foreground">
                        Recommend comprehensive cognitive evaluation and neuroimaging
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Calendar className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Schedule Follow-up</p>
                      <p className="text-xs text-muted-foreground">
                        Monitor progression with regular MRI assessments
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Activity className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Continue Routine Monitoring</p>
                      <p className="text-xs text-muted-foreground">
                        Maintain regular health assessments and lifestyle factors
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Activity className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Preventive Measures</p>
                      <p className="text-xs text-muted-foreground">
                        Focus on cognitive health and lifestyle optimization
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Long-term Considerations</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <ScanEye className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">MRI Tracking</p>
                  <p className="text-xs text-muted-foreground">
                    Regular monitoring of brain volume changes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Brain className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Cognitive Assessment</p>
                  <p className="text-xs text-muted-foreground">
                    Annual neuropsychological evaluations recommended
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <HeaderInside />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  Parkinson&apos;s DATscan Analysis Results
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive dopamine transporter imaging analysis and clinical recommendations
                </p>
              </div>
              <Button variant="outline" onClick={handleNewAnalysis} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </div>

            {/* Patient Info Card */}
            <Card className="border-2 border-dashed overflow-hidden border-gray-300 rounded-lg transition-colors bg-gradient-to-br from-gray-50 to-gray-200">
              <CardHeader className="pb-4 bg-muted/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Patient Information
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : "Unknown Patient"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Patient ID: {selectedPatient?.id || "N/A"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-1 rounded">
                          <Users className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-sm">
                          {selectedPatient?.date_of_birth ? 
                            `${Math.floor((new Date().getTime() - new Date(selectedPatient.date_of_birth).getTime()) / 3.15576e+10)} years` : 
                            "Age unknown"}, 
                          {selectedPatient?.gender || "Gender unknown"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-1 rounded">
                          <Calendar className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-sm"> Analysis Date: {resultData?.created_at ? formatDate(resultData.created_at) : "--"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Analysis Type</h3>
                      <p className="text-sm">DaTscan - Parkinson&apos;s Detection</p>
                    </div>
                    
                    <div className="rounded-lg bg-blue-50 p-3 border border-blue-100">
                      <h3 className="font-medium text-sm text-blue-700 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Report Summary
                      </h3>
                      <p className="text-xs text-blue-600 mt-1">
                        {resultData.result} with {confidence}% confidence
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DiagnosticHeader />
              <ExplainableAI />
            </div>

            {/* Clinical Recommendations */}
            <ClinicalRecommendations />

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6">
              <Button
                variant="outline"
                onClick={handleExportReport}
                className="gap-2 w-full sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button onClick={handleShareWithTeam} className="gap-2 w-full sm:w-auto">
                <Share2 className="h-4 w-4" />
                Share with Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function DatScanResultPage() {
  return (
    <Suspense fallback={<Loading/>}>
      <DatScanResultContent />
    </Suspense>
  );
}
