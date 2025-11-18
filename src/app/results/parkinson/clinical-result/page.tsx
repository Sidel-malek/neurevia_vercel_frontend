"use client";

import { useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Users, Calendar, Brain, BarChart3, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import HeaderInside from "@/components/headerInside"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "@/components/loading_"
import DiagnosticHeader from "@/components/resultComponents/alzheimer/alzheimer-biomarkers/DiagnosticHeader";
import ExplainableAI from "@/components/resultComponents/parkinson/ExplainableAI";
import ClinicalRecommendations from "@/components/resultComponents/parkinson/ClinicalRecommendations";

// Move the content that uses useSearchParams to a separate component
function ParkinsonDiagnosticContent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams();
  const [loadingShap, setLoadingShap] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [payload, setPayload] = useState<any>(null);
  const [exportLoading, setExportLoading] = useState(false);
  // Fix the state definition around line 40
const [shapData, setShapData] = useState({
  prediction: null as string | null, // Allow string or null
  probabilities: [] as number[],
  shap_feature_importance: [] as any[],
  shap_image: "",
});

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

  // Fonction pour adapter les données Parkinson au format Alzheimer
  const adaptParkinsonData = (payload: any) => {
    if (!payload) return { prediction: "0", probabilities: [0, 0, 0] };
    
    // Adapter la prédiction
    const predictionMap: Record<string, string> = {
      "HC": "0",  // Healthy Control → Cognitively Normal
      "PD": "1",  // Parkinson's Disease → Alzheimer's Disease
    };
    
    const adaptedPrediction = predictionMap[payload.result] || "0";
    
    // Adapter les probabilités - CORRECTION : retourner un tableau avec 3 éléments
    let adaptedProbabilities = [0, 0, 0];
    if (payload.probabilities && typeof payload.probabilities === 'object') {
      adaptedProbabilities = [
        payload.probabilities.HC || 0,  // Class 0: Healthy Control
        payload.probabilities.PD || 0,  // Class 1: Parkinson's Disease  
        0                              // Class 2: Not applicable for Parkinson (placeholder)
      ];
    }
    
    return {
      prediction: adaptedPrediction,
      probabilities: adaptedProbabilities,
      originalResult: payload.result // Garder le résultat original pour l'affichage
    };
  };

  // Fetch analysis data
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const analysisId = searchParams.get("analysis_id");
        if (!analysisId) {
          setError("No analysis ID provided");
          setLoadingAnalysis(false);
          return;
        }

        const res = await fetch(`${apiUrl}/api/analysis/${analysisId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const analysisData = await res.json();
        setPayload(analysisData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingAnalysis(false);
      }
    };

    fetchAnalysis();
  }, [searchParams,apiUrl]);

  



  // Fetch SHAP data for Parkinson
  useEffect(() => {
    const fetchShap = async () => {
      if (!payload?.biomarkers) return;
      setLoadingShap(true);

      try {
        console.log("selected biomarkers:", payload.biomarkers);

        const response = await fetch(`${apiUrl}/api/predict/parkinson-shap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            biomarkers: payload.biomarkers,
            analyse_id: payload.id,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const shapResponse = await response.json();
        setShapData(shapResponse);
      } catch (err: any) {
        console.error("Error fetching SHAP:", err);
        // Fallback data avec conversion des probabilités
        const adaptedData = adaptParkinsonData(payload);
        setShapData({
          prediction: adaptedData.prediction,
          probabilities: adaptedData.probabilities,
          shap_feature_importance: [],
          shap_image: "",
        });
      } finally {
        setLoadingShap(false);
      }
    };

    if (payload?.biomarkers) {
      fetchShap();
    }
  }, [payload]);

  const handleNewAnalysis = () => router.push("/diagnosis/parkinson");

  const handleExportReport = async () => {
    if (!payload?.id) {
      alert("No analysis ID found. Please run a prediction first.");
      return;
    }

    try {
      setExportLoading(true);
      
      ;
      
      const response = await fetch(
        `${apiUrl}/api/biomarker/export/${payload.id}/`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const patientName = payload?.patientName || "patient";
      const safePatientName = patientName.replace(/[^a-zA-Z0-9]/g, "-");
      a.download = `parkinson-report-${safePatientName}-${new Date().toISOString().split('T')[0]}.pdf`;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
    } catch (err) {
      console.error("❌ Biomarker PDF export failed:", err);
      alert(`Export failed: ${err}`);
    } finally {
      setExportLoading(false);
    }
  };

  const handleShareWithTeam = () => {
    console.log("Sharing with team");
  };

  if (loadingAnalysis) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-lg font-medium">Loading diagnostic results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">Error: {error}</p>
          <Button variant="outline" size="sm" onClick={handleNewAnalysis} className="gap-2 mt-4 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Start New Analysis
          </Button>
        </div>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-lg font-medium">No diagnostic results found</p>
          <Button variant="outline" size="sm" onClick={handleNewAnalysis} className="gap-2 mt-4 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Start New Analysis
          </Button>
        </div>
      </div>
    );
  }

  // Adapter les données pour le composant Alzheimer
  const adaptedData = adaptParkinsonData(payload);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 overflow-hidden relative">
      <div className="flex h-screen justify">
        <Sidebar/>
        <div className="flex-1 overflow-auto">
          <HeaderInside/> 
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {/* Error message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p>Error: {error}</p>
                </div>
              )}

              {/* Page Header - IDENTIQUE à Alzheimer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Parkinson&apos;s Diagnostic Results
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Comprehensive analysis and clinical recommendations
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

              {/* Patient Info Card - IDENTIQUE à Alzheimer */}
              <Card className="border-2 border-dashed overflow-hidden border-gray-300 rounded-lg transition-colors bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800">
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
                        <h3 className="font-semibold text-lg">{payload.patientName || "Unknown"}</h3>
                        <p className="text-sm text-muted-foreground">Patient ID: {payload.patientId || "--"}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1 rounded">
                            <Users className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm">
                            {payload.patientAge || "N/A"} years, {payload.patientGender || "Unknown"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1 rounded">
                            <Calendar className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm">Analysis Date: {formatDate(payload.date) || "Unknown"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground">Analysis Type</h3>
                        <p className="text-sm">Clinical Data - Parkinson&apos;s Detection</p>
                      </div>
                      
                      <div className="rounded-lg bg-blue-50 p-3 border border-blue-100">
                        <h3 className="font-medium text-sm text-blue-700 flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Report Summary
                        </h3>
                        <p className="text-xs text-blue-600 mt-1">
                          {adaptedData.originalResult === "HC" ? "No Parkinson's Risk Detected" : 
                           adaptedData.originalResult === "PD" ? "Parkinson's Disease Detected" : 
                           adaptedData.originalResult || "Unknown result"} with {payload.confidence}% confidence
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grid layout IDENTIQUE à Alzheimer */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Diagnostic Header - MÊME COMPOSANT qu'Alzheimer */}
                <DiagnosticHeader
                  patientName={payload.patientName || "Unknown"}
                  patientId={payload.patientId || "--"}
                  patientAge={payload.patientAge || "N/A"}
                  patientGender={payload.patientGender || "Unknown"}
                  finalPrediction={adaptedData.originalResult || "0"} // Convert string to number
                  confidence={payload.confidence}
                  physician={payload.doctorName}
                  modelVersion="ParkinsonNet v1.0.0"
                  analysisDate={formatDate(payload.date) || "--"}
                  status="Completed"
                  adaboostProbabilities={adaptedData.probabilities} // Adapté: tableau [HC, PD, 0]
                  diseaseType="parkinson" // Nouvelle prop pour indiquer le type de maladie
                />

                {/* Explainable AI - MÊME COMPOSANT qu'Alzheimer/ clinical_assessments */}
                <ExplainableAI  
                  selectedBiomarkers={payload.biomarkers} 
                  shapData={shapData} 
                  loadingShap={loadingShap}
                />
              </div>

              {/* Clinical Recommendations - MÊME COMPOSANT qu'Alzheimer */}
              <ClinicalRecommendations/>

              {/* Action Buttons - IDENTIQUE à Alzheimer */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6">
                <Button
                  variant="outline"
                  onClick={handleExportReport}
                  disabled={exportLoading}
                  className="gap-2 w-full sm:w-auto"
                >
                  {exportLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {exportLoading ? "Generating Report..." : "Export & Save Report"}
                </Button>
                <Button
                  onClick={handleShareWithTeam}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Users className="h-4 w-4" />
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
export default function ParkinsonDiagnosticDashboard() {
  return (
    <Suspense fallback={<Loading/>}>
      <ParkinsonDiagnosticContent />
    </Suspense>
  );
}