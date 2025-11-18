"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, AlertTriangle } from "lucide-react";
import ProbabilityDistribution from "@/components/resultComponents/alzheimer/alzheimer-biomarkers/ProbabilityDistribution"
interface ModelAnalysisProps {
  
  adaboostPrediction?: number;
  adaboostProbabilities?: number[];
}

export default function ModelAnalysis({
 
  adaboostPrediction = 1,
  adaboostProbabilities = [0.3, 0.7],
}: ModelAnalysisProps) {
  // Calculate confidence percentages
  const adaboostConfidence = Math.round(
    Math.max(...adaboostProbabilities) * 100,
  );
  return (
    <Card className="bg-card border-border w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
           <Activity className="h-5 w-5" />
           <CardTitle>AI Analysis</CardTitle>
 
          </div>
          
          <div className="flex items-center gap-2">
                {adaboostPrediction === 1 ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-chart-1" />
                )}
                <span className="font-medium">
                  {adaboostPrediction === 1 ? "Positive" : "Negative"}
                </span>
              </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProbabilityDistribution adaboostProbabilities={adaboostProbabilities} />

      </CardContent>
    </Card>
  );
}
