"use client";

import { useState } from "react";
import { Download, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReportGeneratorProps {
  onExport: () => Promise<void>;
  patientName?: string;
}

export default function ReportGenerator({
  onExport,
  patientName = "Patient",
}: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      await onExport();
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "Failed to generate report. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex-1 flex items-center gap-3">
          <div className="p-2 bg-indigo-600/30 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-200" />
          </div>
          <h3 className="text-sm font-medium text-white">
            Generate PDF report for {patientName}
          </h3>
          {error && (
            <Alert variant="destructive" className="mt-2 py-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <Button
          onClick={handleExport}
          disabled={isGenerating}
          className="bg-indigo-600/80 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg px-4"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
