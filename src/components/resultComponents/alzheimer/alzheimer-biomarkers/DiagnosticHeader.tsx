import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Users, Calendar, Brain, FileText, BarChart3 } from "lucide-react";
import ProbabilityDistribution from "@/components/resultComponents/alzheimer/alzheimer-biomarkers/ProbabilityDistribution"

interface DiagnosticHeaderProps {
  patientName?: string;
  patientId?: string;
  patientAge?: number;
  patientGender?: string;
  finalPrediction?: number;
  physician?: string;
  modelVersion?: string;
  confidence?: number;
  analysisDate?: string;
  status?: string;
  adaboostProbabilities?: any; // Change from Any to number[] and make it optional
  diseaseType?: "alzheimer" | "parkinson";

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

const DiagnosticHeader = ({
  patientName,
  patientId,
  patientAge,
  patientGender,
  finalPrediction,
  confidence = 0,
  analysisDate = new Date().toLocaleDateString(),
  status,
  physician = "Dr. Sarah Johnson",
  modelVersion = "NeuroScan v2.4.1",
  adaboostProbabilities = [],
  diseaseType,

}: DiagnosticHeaderProps) => {

  // Prediction mapping for 0, 1, 2
 // Correction : Utiliser un objet normal, pas un tableau
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

  const currentPrediction = finalPrediction !== undefined 
    ? predictionMap[finalPrediction] 
    : { code: "UNK", label: "Unknown", color: "gray", summary: "No prediction available." ,risk:"Unknown" };

  
  return (
    <div className="grid grid-cols-1  gap-6 ">


      {/* Diagnostic Result Card */}
      <Card className="border-border overflow-hidden">
        <CardHeader className="pb-4 bg-muted/30">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Diagnostic Results
            </CardTitle>
            <Badge 
             className={ 
              currentPrediction.color === "red"
                ? "bg-red-500 text-white hover:bg-red-600"
                : currentPrediction.color === "orange"
                ? "bg-yellow-400 text-white hover:bg-yellow-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }
            >
              {currentPrediction.code}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${
              currentPrediction.color === "red" ? "bg-red/15" :
              currentPrediction.color === "orange" ? "bg-orange-100" :
              "bg-green-100"
            }`}>
              {currentPrediction.color === "red" ? (
                <AlertTriangle className="h-8 w-8 text-destructive" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentPrediction.label}</h2>
              <p className="text-muted-foreground mt-1">{currentPrediction.summary}</p>
            </div>
          </div>
        
       
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Confidence Level</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{confidence}%</span>
                  <Badge 
                    variant="outline" 
                    className={`${currentPrediction.color} text-${currentPrediction.color} border-${currentPrediction.color}/30`}
                  >
                    {currentPrediction.risk}
                  </Badge>
                </div>
                <Progress 
                    value={confidence} 
                    color={currentPrediction.color === "red" ? "red" : currentPrediction.color === "orange" ? "orange" : "green"}
                />
                             
              </div>

   

          <ProbabilityDistribution adaboostProbabilities={adaboostProbabilities}   diseaseType ={diseaseType}/>
          
        </CardContent>
      </Card>

      
    </div>
  );
};

export default DiagnosticHeader;
