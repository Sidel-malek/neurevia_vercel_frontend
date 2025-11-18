"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Download, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Match your Analyse model fields
interface DiagnosticResult {
  id: number;
  date: string;
  type_analyse: string;
  maladie: string;
  diagnostic?: string;
  rapport?: string; // file URL from backend
}

interface PatientHistoryProps {
  patientId: string;
  patientName?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function PatientHistory({
  patientId,
  patientName = "Unknown Patient",
  isCollapsed = false,
  onToggleCollapse = () => {},
}: PatientHistoryProps) {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [diagnosticHistory, setDiagnosticHistory] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
    onToggleCollapse();
  };

  const [error, setError] = useState<string | null>(null);
  // In PatientHistory.tsx
useEffect(() => {
  const fetchHistory = async () => {
    try {
      

      const res = await fetch(
        `${apiUrl}/api/doctor/patients/${patientId}/analyses/`,
        {

        credentials: "include",   // this sends the HttpOnly cookie
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        }
      );

      if (!res.ok) {
        // Handle 404 specifically (no analyses found)
        if (res.status === 404) {
          setDiagnosticHistory([]); // Empty array for no analyses
          setError(null); // Clear any previous errors
        } else {
          throw new Error(`Failed to fetch history (${res.status})`);
        }
      } else {
        const data = await res.json();
        setDiagnosticHistory(data);
        setError(null);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, [patientId, apiUrl]);


  return (
    <Card className="w-full bg-white dark:bg-slate-900/50 border-gray-300 dark:border-slate-700/50">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center">
          <FileText className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
          Patient Diagnostic History
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCollapse}
          className="h-8 w-8 p-0 rounded-full"
        >
          {collapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      {!collapsed && (
        <CardContent className="pt-4">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-slate-100">
                  {patientName} 
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Patient ID: {patientId}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {diagnosticHistory.length} Records
              </Badge>
            </div>
          </div>

          <Separator className="my-4" />

{loading && (
  <div className="text-center py-6 text-gray-500 dark:text-slate-400">
    Loading...
  </div>
)}

{!loading && !error && diagnosticHistory.length > 0 && (
  <Accordion type="single" collapsible className="w-full">
              {diagnosticHistory.map((diagnostic) => (
                <AccordionItem key={diagnostic.id} value={String(diagnostic.id)}>
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                          {new Date(diagnostic.date).toLocaleDateString()}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-slate-300">
                          {diagnostic.type_analyse}
                        </span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {diagnostic.maladie}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-3">
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-md p-3 text-sm">
                      <div className="mb-2">
                        <span className="text-gray-500 dark:text-slate-400">
                          Diagnostic:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-slate-100">
                          {diagnostic.diagnostic || "N/A"}
                        </span>
                      </div>
                      {diagnostic.rapport && (
                        <a
                          href={diagnostic.rapport}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 text-xs h-7 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Download Report
                          </Button>
                        </a>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
  </Accordion>
)}

{!loading && error && diagnosticHistory.length === 0 && (
  <div className="text-center py-6 text-gray-500 dark:text-slate-400">
    No diagnostic history available for this patient.
  </div>
)}
        </CardContent>
      )}
    </Card>
  );
}
