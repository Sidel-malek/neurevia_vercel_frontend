"use client";

import { Loader2, AlertCircle, LineChart, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMemo } from "react";

interface ExplainableAIProps {
  // selectedBiomarkers is expected to be { clinical: {...}, medical: {...}, demographic: {...} }
  selectedBiomarkers: any;
  shapData: any;
  loadingShap: boolean;
}

interface ShapFeature {
  feature: string;
  shap_value?: number;
  value?: number;
  abs_shap?: number;
}

export default function ExplainableAI({
  selectedBiomarkers,
  shapData,
  loadingShap,
}: ExplainableAIProps) {
  const shapFeatures: ShapFeature[] = useMemo(() => shapData?.shap_feature_importance || [], [shapData]);
  const hasShapData = shapFeatures.length > 0;
  const hasShapImage = !!shapData?.shap_image;

  // -------------------------
  // Helpers
  // -------------------------
  const flattenBiomarkers = (obj: any) => {
    if (!obj || typeof obj !== "object") return [];
    const result: Array<{ key: string; value: any; category?: string }> = [];

    Object.keys(obj).forEach((category) => {
      const group = obj[category] || {};
      if (typeof group !== "object") return;
      Object.keys(group).forEach((bioKey) => {
        result.push({
          key: bioKey,
          value: group[bioKey],
          category,
        });
      });
    });

    return result;
  };

  // Flatten biomarkers once
const flatBiomarkers = useMemo(() => flattenBiomarkers(selectedBiomarkers), [selectedBiomarkers]);

// Map feature name lowercased -> shap entry
const shapIndex = useMemo(() => {
  const map = new Map<string, ShapFeature>();
  shapFeatures.forEach((f) => {
    if (!f?.feature) return;
    map.set(f.feature.toLowerCase(), f);
  });
  return map;
}, [shapFeatures]);

// Top N features for summary
const topFeatures = useMemo(() => {
  if (!shapFeatures || shapFeatures.length === 0) return [];
  return shapFeatures
    .map((f) => ({
      ...f,
      abs_shap: f.abs_shap ?? Math.abs(Number(f.shap_value ?? f.value ?? 0)),
    }))
    .sort((a, b) => (b.abs_shap ?? 0) - (a.abs_shap ?? 0))
    .slice(0, 5);
}, [shapFeatures]);





  const findShapValue = (biomarkerName: string) => {
    if (!biomarkerName) return 0;
    const f = shapIndex.get(biomarkerName.toLowerCase());
    if (!f) return 0;
    return typeof f.shap_value !== "undefined" ? f.shap_value : f.value ?? 0;
  };

  

  // -------------------------
  // Render sub-parts
  // -------------------------
  const renderLoader = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-2">
      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      <span className="text-sm text-muted-foreground">Loading SHAP analysis...</span>
    </div>
  );

  const renderNoShap = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-2 text-orange-600">
      <AlertCircle className="h-8 w-8" />
      <span className="text-sm">SHAP data not available</span>
    </div>
  );

  const renderBiomarkerTable = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Biomarker</th>
              <th className="text-left py-2 font-medium">Value</th>
              <th className="text-left py-2 font-medium">SHAP Value</th>
              <th className="text-left py-2 font-medium">Impact</th>
            </tr>
          </thead>
          <tbody>
            {flatBiomarkers.length === 0 && (
              <tr>
                <td className="py-4 text-muted-foreground" colSpan={4}>
                  No biomarkers available
                </td>
              </tr>
            )}

            {flatBiomarkers.map((item, idx) => {
              const shapVal = findShapValue(item.key);
              return (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-2 capitalize">{item.key.replace(/_/g, " ")}</td>
                  <td className="py-2">{String(item.value)}</td>
                  <td className="py-2">{(Number(shapVal) || 0).toFixed(4)}</td>
                  <td className="py-2">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        shapVal > 0 ? "bg-green-500" : shapVal < 0 ? "bg-red-500" : "bg-gray-400"
                      }`}
                      title={shapVal > 0 ? "Positive impact (->)" : shapVal < 0 ? "Negative impact (<-)" : "Neutral"}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderShapImage = () =>
    hasShapImage ? (
      <div className="bg-muted/30 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-3">Biomarker Pattern Visualization</h4>
        <div className="aspect-video bg-muted/50 rounded-md flex items-center justify-center p-4">
          <img src={shapData.shap_image} alt="SHAP Explanation" className="max-h-full max-w-full rounded-md shadow-md object-contain" />
        </div>
      </div>
    ) : null;

  const renderTopFeatures = () => (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <h4 className="font-semibold text-green-800 mb-3">Top Feature Importance</h4>
      <div className="space-y-2">
        {topFeatures.length === 0 && <div className="text-sm text-muted-foreground">No feature importance available</div>}
        {topFeatures.map((f, i) => {
          const v = f.shap_value ?? f.value ?? 0;
          return (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm text-green-700 capitalize">{f.feature.replace(/_/g, " ")}</span>
              <span className="text-sm font-medium text-green-800">{Math.abs(Number(v)).toFixed(3)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // -------------------------
  // Main render
  // -------------------------
  return (
    <Card className="border-2 overflow-hidden rounded-lg bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-700" />
            <CardTitle className="text-lg">Explainable AI Analysis</CardTitle>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px] text-center">Visual explanations of the AI model&apos;s decision process</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">Understanding the factors that influenced this prediction</p>
      </CardHeader>

      <CardContent className="pt-6">
        <Tabs defaultValue="clinical-patterns" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="clinical-patterns" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Clinical Data Patterns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clinical-patterns" className="pt-4 space-y-4">
            <p className="text-sm text-muted-foreground">Analysis of key biomarkers and their deviation from normal ranges</p>

            {loadingShap ? renderLoader() : hasShapData ? (
              <div className="space-y-6">
                {renderBiomarkerTable()}
                <Separator />
                {renderShapImage()}
                {renderTopFeatures()}
              </div>
            ) : (
              renderNoShap()
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
