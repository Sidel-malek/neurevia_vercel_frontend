"use client";

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import DiagnosticHeader from "@/components/resultComponents/alzheimer/alzheimer-biomarkers/DiagnosticHeader";
import ModelAnalysis from "@/components/resultComponents/alzheimer/alzheimer-biomarkers/ModelAnalysis";
import ExplainableAI from "@/components/resultComponents/alzheimer/alzheimer-biomarkers/ExplainableAI";
import ClinicalRecommendations from "@/components/resultComponents/alzheimer/alzheimer-biomarkers/ClinicalRecommendations";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Users, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar"
import HeaderInside from "@/components/headerInside"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Calendar, Brain, BarChart3 } from "lucide-react";

export default function AlzheimersDiagnosticDashboard() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<any>(null); // Added type any
  const searchParams = useSearchParams();
  const [exportLoading, setExportLoading] = useState(false); // Added exportLoading state

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

  const predictionLabels: Record<number, string> = {
    0: "Cognitively Normal – No Alzheimer",
    1: "Cognitive Impairment with Alzheimer",
    2: "Cognitive Impairment without Alzheimer",
  };

  const [shapData, setShapData] = useState({
    prediction: null,
    probabilities: [],
    shap_feature_importance: [],
    shap_image: "" , 
  });
  const [error, setError] = useState<string | null>(null);
  const [loadingShap, setLoadingShap] = useState(true);

 

  const [loadingAnalysis, setLoadingAnalysis] = useState(true);

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
          credentials: "include",   // this sends the HttpOnly cookie

        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const analysisData = await res.json();
        setPayload(analysisData);
        if (analysisData.heatmap_img) {
  setShapData(prev => ({
    ...prev,
    shap_image: analysisData.heatmap_img,
  }));

  console.log("yes shap image")
}

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingAnalysis(false);
      }
    };

    fetchAnalysis();
  }, [searchParams,apiUrl]);

  // Fetch SHAP data
// Fetch SHAP data
useEffect(() => {
  const fetchShap = async () => {
    if (!payload?.biomarkers) return;
    setLoadingShap(true);

    try {
      const csfDemoFeatures = [
        "NACCAGE",
        "SEX", 
        "EDUC",
        "MARISTAT",
        "CSFABETA",
        "CSFTTAU",
        "CSFPTAU",
        "ttau_abeta_ratio", 
        "ptau_abeta_ratio"
      ];

      const cleanedBiomarkers = Object.entries(payload.biomarkers).reduce(
        (acc, [key, value]) => {
          // Skip ratio features but keep original values (including null) for others
          if (key === "ttau_abeta_ratio" || key === "ptau_abeta_ratio") {
            return acc;
          }
          acc[key] = value; // Preserve original value (null, undefined, or actual value)
          return acc;
        },
        {} as Record<string, any>
      );

      const biomarkersKeys = Object.keys(cleanedBiomarkers);
      

      const isSubset = (a: string[], b: string[]) => a.every((v) => b.includes(v));

      let endpoint = "predict/biomarkers-shap/all";
      if (isSubset(biomarkersKeys, csfDemoFeatures)) {
        endpoint = "predict/biomarkers-shap/csf_demo";
      }


      const response = await fetch(`${apiUrl}/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biomarkers: cleanedBiomarkers,
          analyse_id: payload.id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const shapResponse = await response.json();
      if (shapData.shap_image) {
  setShapData(prev => ({
    ...prev,
    probabilities: shapResponse.probabilities,
    prediction: shapResponse.prediction,
    shap_feature_importance: shapResponse.shap_feature_importance,
  }));
    console.log("shap image exist")

}else{
  setShapData(shapResponse)
  console.log("no shap image")
}
    
    } catch (err: any) {
      console.error("Error fetching SHAP:", err);
      setError(err.message);
    } finally {
      setLoadingShap(false);
    }
  };

  fetchShap();  
}, [payload , shapData.shap_image , apiUrl]);

  // Update the export function to use the correct endpoint
  const handleExportReport = async () => {
    try {
      const analysisId = searchParams.get("analysis_id");
      if (!analysisId) {
        setError("No analysis ID available");
        return;
      }

      setLoading(true);
      setError(null);

      // Fetch the PDF from the correct endpoint
      const response = await fetch(
        `${apiUrl}/api/analysis/${analysisId}/export-pdf/`,
        {
          credentials: "include",   // this sends the HttpOnly cookie

        }
      );

      if (!response.ok) {
        throw new Error(`Failed to export PDF: ${response.statusText}`);
      }

      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create filename safely
      const patientName = payload?.patientName || "patient";
      const safePatientName = patientName.replace(/[^a-zA-Z0-9]/g, "-");
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = `alzheimer-report-${safePatientName}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err: any) {
      console.error("Error exporting report:", err);
      setError(err.message);
    } finally {
      setExportLoading(false);
    }
  };

  const router = useRouter();

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

  if (!payload) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-lg font-medium">No diagnostic results found</p>
          <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2 bg-transparent">
            Start New Analysis
          </Button>
        </div>
      </div>
    );
  }

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

              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Alzheimer&apos;s Diagnostic Results
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

              {/* Patient Info Card */}
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
                            {payload.patientAge || "N/A"} years, {payload.patientGender === 1 ? "Male" : "Female"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1 rounded">
                            <Calendar className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm">Analysis Date: {payload.date || "Unknown"}</span>
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
                          {predictionLabels[payload.result] || "Unknown result"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-6 ">
                {/* Diagnostic Header */}
                <DiagnosticHeader
                  patientName={payload.patientName || "Unknown"}
                  patientId={payload.patientId || "--"}
                  patientAge={payload.patientAge || "N/A"}
                  patientGender={payload.patientGender === 1 ? "Male" : "Female"}
                  finalPrediction={payload.result}
                  confidence={payload.confidence}
                  physician={payload.doctorName}
                  modelVersion="NeurevIA v1.0.0"
                  analysisDate={formatDate(payload.date) || "--"}
                  status="Completed"
                  adaboostProbabilities={payload.probabilities || []}
                />

                {/* Explainable AI */}
                <ExplainableAI  
                  selectedBiomarkers={payload.biomarkers} 
                  shapData={shapData} 
                  loadingShap={loadingShap}
                />
              </div>

              {/* Clinical Recommendations */}
              <ClinicalRecommendations />

              {/* Action Buttons */}
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
