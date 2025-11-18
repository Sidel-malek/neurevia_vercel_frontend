"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, FileText, Users, Brain, Activity, 
  ScanEye, HeartPulse, Calendar, BarChart3, Download, Share2, 
  Loader2
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import HeaderInside from "@/components/headerInside";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import Image from "next/image";
import { Suspense } from "react";
import Loading from "@/components/loading_";

// Define interfaces for better type safety
interface AnalysisResult {
  result: string;
  confidence: number;
  probabilities: {
    AD: number;
    CN: number;
    EMCI: number;
    LMCI: number;
  };
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
}
interface PredictionInfo {
  code: string,
  label: string;
  color: string;
  risk: string;
  summary: string;
  diseaseType: "alzheimer" | "parkinson" | "unknown";
  icon: string;
}

// Move the content that uses useSearchParams to a separate component
function MriResultsContent() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"


  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [heatmapImg, setHeatmapImg] = useState<string | null>(null);
  const [analysisDate, setAnalysisDate] = useState<string>("");
  const [activeTab, setActiveTab] = useState("mri-patterns");
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
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

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setError(null);
        const analysisId = searchParams.get('analysis_id');
        
        if (!analysisId) {
          setError("No analysis ID provided");
          setLoading(false);
          return;
        }

        // Fetch analysis data
        const response = await fetch(`${apiUrl}/api/analysis/${analysisId}`, {
          headers: {'Content-Type': 'application/json'},
          credentials: "include",
        });

        if (response.status === 403) {
          setError("Access forbidden - insufficient permissions");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const analysisData = await response.json();
        
        setResult({
          result: analysisData.result,
          confidence: analysisData.confidence,
          probabilities: analysisData.probabilities,
        });

        if (analysisData.heatmap_img) {
          setHeatmapImg(`${apiUrl}${analysisData.heatmap_img}`);
        }

        // Fetch patient information if available
        if (analysisData.patientId) {
          const patientResponse = await fetch(`${apiUrl}/api/patients/${analysisData.patientId}/`, {
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
          });

          if (patientResponse.ok) {
            const patientData = await patientResponse.json();
            setSelectedPatient(patientData);
          }
        }

        setAnalysisDate(analysisData.date || new Date().toISOString());

      } catch (error) {
        console.error("Error fetching analysis data:", error);
        setError((error as Error)?.message || "Failed to load analysis data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [searchParams, router , apiUrl]);

  const handleExportReport = async () => {
    if (!result) return;
    
    try {
      const analysisId = searchParams.get('analysis_id');
      const response = await fetch(`${apiUrl}/api/analysis/mri/${analysisId}/export-pdf/`, {
        method: 'GET',
        credentials: "include",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mri-alzheimer-report-${analysisId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success message
        alert("Report exported and saved successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to export report");
      }
    } catch (error) {
      console.error("Error exporting report:", error);
      setError("Failed to export report");
    } finally {
      setLoading(false);
    }
  };

  const handleShareWithTeam = async () => {
    try {
      const analysisId = searchParams.get('analysis_id');
      
      const response = await fetch(`${apiUrl}/api/analysis/${analysisId}/share/`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
      });

      if (response.ok) {
        alert("Analysis shared successfully with the team!");
      } else {
        setError("Failed to share analysis");
      }
    } catch (error) {
      console.error("Error sharing analysis:", error);
      setError("Error sharing analysis");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading MRI results...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-lg font-medium text-red-600">{error}</p>
          <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2 bg-transparent mt-4">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // No results state
  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-lg font-medium">No MRI results found</p>
          <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2 bg-transparent mt-4">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getRiskLevel = (confidence: number, result: string) => {
  if (confidence >= 70)
    return {
      label: "High Confidence",
      color: result === "AD" ? "red" : result === "CN" ? "green" :"orange",
      risk: result,
    };
  if (confidence >= 30)
    return {
      label: "Moderate Confidence",
      color: "orange",
      risk: result,
    };
  return {
    label: "Low Confidence",
    color: result === "AD" ? "red" : result === "CN" ? "green" :"orange",
    risk: result,
  };
};

const riskLevel = getRiskLevel(result.confidence, result.result);

  const predictionMap: Record<string, PredictionInfo> = {
  // Alzheimer predictions
  "0": {
    code: "CN",
    label: "Cognitively Normal",
    color: "green",
    risk: "Low risk",
    summary: "No Alzheimer's disease detected. Normal cognitive function.",
    diseaseType: "alzheimer" as const,
    icon: "✅",
  },
  "1": {
    code: "AD",
    label: "Alzheimer's Disease",
    color: "red",
    risk: "High risk",
    summary: "Alzheimer's disease detected with cognitive impairment.",
    diseaseType: "alzheimer" as const,
    icon: "⚠️",
  },
  "2": {
    code: "MCI",

    label: "Non-Alzheimer's Impairment",
    color: "orange",
    risk: "Moderate risk",
    summary: "Cognitive impairment not related to Alzheimer's pathology.",
    diseaseType: "alzheimer" as const,
    icon: "🔍",
  },
  
  // Parkinson predictions
  "HC": {
    code: "CN",

    label: "Healthy Control",
    color: "green",
    risk: "Low risk",
    summary: "No Parkinson's disease detected. Normal motor function.",
    diseaseType: "parkinson" as const,
    icon: "✅",
  },
  "PD": {
    code: "PD",

    label: "Parkinson's Disease",
    color: "red",
    risk: "High risk",
    summary: "Parkinson's disease detected based on clinical assessments.",
    diseaseType: "parkinson" as const,
    icon: "⚠️",
  },
  
  // Additional classifications
  "CN": {
    code: "CN",

    label: "Cognitively Normal",
    color: "green",
    risk: "Low risk",
    summary: "Within normal cognitive range for age.",
    diseaseType: "alzheimer" as const,
    icon: "✅",
  },
  "MCI": {
    code: "MCI",

    label: "Mild Cognitive Impairment",
    color: "orange",
    risk: "Moderate risk",
    summary: "Mild cognitive impairment requiring follow-up.",
    diseaseType: "alzheimer" as const,
    icon: "🔍",
  },
  "AD": {
    code: "AD",

    label: "Alzheimer's Disease",
    color: "red",
    risk: "High risk",
    summary: "Alzheimer's disease confirmed.",
    diseaseType: "alzheimer" as const,
    icon: "⚠️",
  },
  "EMCI": {
    code: "EMCI",

    label: "Early Mild Cognitive Impairment",
    color: "yellow",
    risk: "Moderate risk",
    summary: "Early stage mild cognitive impairment detected.",
    diseaseType: "alzheimer" as const,
    icon: "🔍",
  },
  "LMCI": {   
    code: "LMCI",

    label: "Late Mild Cognitive Impairment",
    color: "orange",
    risk: "High risk",
    summary: "Late stage mild cognitive impairment, high conversion risk to AD.",
    diseaseType: "alzheimer" as const,
    icon: "⚠️",
  },
};
const currentPrediction = result.result !== undefined 
    ? predictionMap[result.result] 
    : { label: "Unknown", color: "gray", summary: "No prediction available." ,risk:"Unknown" };


  // Data for pie chart
  const probabilityData = [
    { name: "AD", value: result.probabilities?.AD || 0 },
    { name: "CN", value: result.probabilities?.CN || 0 },
    { name: "EMCI", value: result.probabilities?.EMCI || 0 },
    { name: "LMCI", value: result.probabilities?.LMCI || 0 }
  ];

  const COLORS = ["#ef4444", "#22c55e", "#f59e0b", "#3b82f6"];

  // Sub-components for better organization
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
      
    </div>
  );

  const DiagnosticHeader = () => (
    <Card className="border-border overflow-hidden">
      <CardHeader className="pb-4 bg-muted/30">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Diagnostic Results
          </CardTitle>
          <Badge className={
            riskLevel.color === "red" ? "bg-red-500 text-white" :
            riskLevel.color === "orange" ? "bg-yellow-400 text-white" :
            "bg-green-500 text-white"
          }>
            {riskLevel.risk}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-full ${
            riskLevel.color === "red" ? "bg-red-100" :
            riskLevel.color === "orange" ? "bg-yellow-100" :
            "bg-green-100"
          }`}>
            {riskLevel.color === "red" ? (
              <Activity className="h-8 w-8 text-red-600" />
            ) : riskLevel.color === "orange" ? (
              <Activity className="h-8 w-8 text-yellow-600" />
            ) : (
              <Activity className="h-8 w-8 text-green-600" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{currentPrediction.label}</h2>
            <p className="text-muted-foreground mt-1">{currentPrediction.summary}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">Confidence Level</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{result.confidence}%</span>
              <Badge variant="outline" className={
                riskLevel.color === "red" ? "text-red-500 border-red-300" :
                riskLevel.color === "orange" ? "text-yellow-500 border-yellow-300" :
                "text-green-500 border-green-300"
              }>
                {riskLevel.label}
              </Badge>
            </div>
            <Progress 
              value={result.confidence} 
              color={riskLevel.color === "red" ? "red" : riskLevel.color === "orange" ? "orange" : "green"}
            />
          </div>
        </div>

        <ProbabilityDistribution />
      </CardContent>
    </Card>
  );

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
        <Tabs defaultValue="mri-patterns" className="w-full mt-2" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-1 w-full">
            <TabsTrigger value="mri-patterns" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              MRI Heatmap Visualization
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mri-patterns" className="pt-4">
            <div className="space-y-4">
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="bg-muted/50 rounded-md">
                  {heatmapImg ? (
                    <Image
  src={heatmapImg}
  alt="Grad-CAM Heatmap Analysis"
  width={800}    // Mets une valeur adaptée (obligatoire)
  height={600}   // Mets une valeur adaptée (obligatoire)
  className="h-full w-full rounded-md shadow-md object-contain"
/>
                  ) : (
                    <div className="text-center p-4">
                      <ScanEye className="h-10 w-10 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Heatmap visualization not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

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
    <div className="min-h-screen bg-gray-100 text-gray-800 overflow-hidden relative">
      <div className="flex h-screen justify">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <HeaderInside /> 
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Alzheimer&apos;s MRI Analysis Results
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Comprehensive brain MRI analysis and clinical recommendations
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="gap-2 self-start"
                >
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
                          <span className="text-sm"> Analysis Date: {formatDate(analysisDate) || "--"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground">Analysis Type</h3>
                        <p className="text-sm">Structural MRI - Alzheimer&apos;s Detection</p>
                      </div>
                      
                      <div className="rounded-lg bg-blue-50 p-3 border border-blue-100">
                        <h3 className="font-medium text-sm text-blue-700 flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Report Summary
                        </h3>
                        <p className="text-xs text-blue-600 mt-1">
                          {result.result} with {result.confidence}% confidence
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DiagnosticHeader />
                <ExplainableAI />
              </div>

              {/* Clinical Recommendations */}
              <ClinicalRecommendations />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6">
                <Button
                  variant="outline"
                  onClick={handleExportReport}
                  disabled={loading}
                  className="gap-2 w-full sm:w-auto"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {loading ? "Exporting..." : "Export & Save Report"}
                </Button>
                <Button
                  onClick={handleShareWithTeam}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Share2 className="h-4 w-4" />
                  Share with Team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function MriResultsPage() {
  return (
    <Suspense fallback={<Loading/>}>
      <MriResultsContent />
    </Suspense>
  );
}
