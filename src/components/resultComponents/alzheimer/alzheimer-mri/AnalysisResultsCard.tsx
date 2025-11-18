"use client";

import React from "react";
import { Activity, Brain, ChevronRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AnalysisResultsCardProps {
  score?: number | string;
  risk?: string;
  progress?: number;
  summary?: string;
}

const AnalysisResultsCard = ({
  score = "EMCI",
  risk = "Moderate Risk",
  progress = 65,
  summary = "Initial analysis pending. Please update patient information and add diagnostic notes.",
}: AnalysisResultsCardProps) => {
  const getRiskColor = (risk: string) => {
    if (risk?.toLowerCase().includes("high")) return "bg-red-500/80";
    if (risk?.toLowerCase().includes("moderate")) return "bg-amber-500/80";
    return "bg-green-500/80";
  };

  return (
    <div className="space-y-6">
      {/* Analysis Results */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-900/80 to-indigo-800/80 pb-4 border-b border-white/10">
          <CardTitle className="text-white flex items-center gap-3">
            <Brain className="text-indigo-300" />
            Detailed Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-600/20 rounded-lg">
                  <Activity className="h-5 w-5 text-indigo-300" />
                </div>
                <h3 className="text-lg font-medium text-white">
                  Cognitive Assessment
                </h3>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-indigo-300 uppercase tracking-wide">
                      Alzheimer&apos;s Risk Score
                    </p>
                    <h2 className="text-4xl font-bold text-white">{score}</h2>
                  </div>
                  <Badge
                    className={`${getRiskColor(risk)} text-white border-0 px-3 py-1 text-xs font-medium rounded-full shadow-lg`}
                  >
                    {risk}
                  </Badge>
                </div>

                <p className="text-xs text-indigo-200 mb-4">
                  Based on hippocampal volume and cortical thickness
                  measurements
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-indigo-300">Risk Assessment</span>
                    <span className="text-white font-medium">{progress}%</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 bg-indigo-900/50"
                  />
                  {/*indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500"*/}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-indigo-300 mb-1">
                    Hippocampal Volume
                  </p>
                  <p className="text-lg font-semibold text-white">2.1 cm³</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-indigo-300 mb-1">
                    Cortical Thickness
                  </p>
                  <p className="text-lg font-semibold text-white">2.4 mm</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-600/20 rounded-lg">
                  <Zap className="h-5 w-5 text-indigo-300" />
                </div>
                <h3 className="text-lg font-medium text-white">
                  AI Analysis Summary
                </h3>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-[calc(100%-40px)]">
                <p className="text-indigo-100 leading-relaxed">{summary}</p>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-300">
                      Confidence Score
                    </span>
                    <span className="text-xs font-medium text-white">87%</span>
                  </div>
                  <Progress
                    value={87}
                    className="h-1 mt-2 bg-indigo-900/50"
                  />
                  {/*indicatorClassName="bg-indigo-400"*/}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
            <div>
              <p className="text-xs text-indigo-300">Last updated</p>
              <p className="text-sm text-white">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center text-indigo-300 text-sm hover:text-white cursor-pointer transition-colors">
              <span>View full report</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResultsCard;
