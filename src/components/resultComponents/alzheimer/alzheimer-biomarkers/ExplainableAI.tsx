"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Info, BarChart2, LineChart, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useMemo, useState } from "react";
interface ShapFeature {
  feature: string;
  shap_value: number;
}

interface ExplainableAIProps {
  selectedBiomarkers: Record<string, number>;
  shapData: {
    shap_feature_importance?: ShapFeature[];
    shap_image?: string;
  };
  loadingShap: boolean;
}

export default function ExplainableAI({
  selectedBiomarkers,
  shapData,
  loadingShap,
}: ExplainableAIProps) {
  const selectedNames = Object.keys(selectedBiomarkers);
  const [featureImportance, setFeatureImportance] = useState<any[] | null>(null);
  const [featureImportanceImage, setFeatureImportanceImage] = useState<string | null>(null);

  // Load feature importance + image once from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("feature_importance");
      if (saved) {
        setFeatureImportance(JSON.parse(saved));
      }

      const savedImg = sessionStorage.getItem("feature_importance_image");
      if (savedImg) {
        setFeatureImportanceImage(savedImg);
      }
    } catch (err) {
      console.error("Failed to load from sessionStorage:", err);
    }
  }, []);

  // Derived features → no extra useState needed
  const filteredFeatures = useMemo(() => {
    if (!featureImportance || !Array.isArray(featureImportance)) return [];
    return featureImportance.filter((f: any) =>
      selectedNames.includes(f.feature)
    );
  }, [featureImportance, selectedNames]);



  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5  text-blue-700" />
            <CardTitle>Explainable AI Analysis</CardTitle>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p className="text-xs">
                  Visual explanations of the AI model&apos;s decision process
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">
          Understanding the factors that influenced this prediction
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="biomarker-patterns" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            
            <TabsTrigger
              value="biomarker-patterns"
              className="flex items-center gap-2"
            >
              <LineChart className="h-4 w-4" />
              Biomarker Patterns
            </TabsTrigger>
            
            
            <TabsTrigger
              value="feature-importance"
              className="flex items-center gap-2"
            >
              <BarChart2 className="h-4 w-4" />
              Feature Importance
            </TabsTrigger>
            
          </TabsList>
          <TabsContent value="biomarker-patterns" className="pt-4">
  <div className="space-y-4">
    {/* Intro */}
    <p className="text-sm text-muted-foreground">
      Analysis of key biomarkers and their deviation from normal ranges
    </p>

    {/* Biomarker Table */}
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
      {selectedBiomarkers && Object.keys(selectedBiomarkers).map((key, index) => {
        console.log("aaaa",selectedBiomarkers)
        // Cherche la valeur SHAP correspondante
        const shapFeature = shapData.shap_feature_importance?.find(f => f.feature === key);
        const shapValue = shapFeature ? shapFeature.shap_value : 0;

        return (
          <tr key={index} className="border-b border-border/50">
            <td className="py-2">{key}</td>
            <td className="py-2">{selectedBiomarkers[key]}</td>
            <td className="py-2">{shapValue.toFixed(4)}</td>
            <td className="py-2">
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  shapValue > 0 ? "bg-green-500" : shapValue < 0 ? "bg-red-500" : "bg-gray-400"
                }`}
                title={shapValue > 0 ? "Positive impact (->)" : shapValue < 0 ? "Negative impact (<-)" : "Neutral"}
              />
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>


      <Separator />

      {/* SHAP Visualization */}
      <div className="bg-muted/30 p-3 rounded-md">
        <h4 className="text-sm font-medium mb-12">
          Biomarker Pattern Visualization
        </h4>

        <div className="aspect-video bg-muted/50 rounded-md flex items-center justify-center">
          {loadingShap ? (
            // Loading placeholder
            <div className="text-center pt-4">
              <LineChart className="h-10 w-10 mx-auto text-muted-foreground animate-pulse" />
              <p className="text-sm text-muted-foreground">
                Loading SHAP explanation...
              </p>
            </div>
          ) : shapData.shap_image ? (
            // SHAP image loaded
            <img
              src={shapData.shap_image}
              alt="SHAP Explanation"
              className="max-h-full max-w-full rounded-md shadow-md"
            />

          
          ) : (
            // Fallback if no image
            <div className="text-center p-4">
              <LineChart className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                SHAP explanation not available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
          </TabsContent>

          <TabsContent value="feature-importance" className="pt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These features had the most significant impact on the prediction
                outcome
              </p>
              <div className="space-y-3">
                {filteredFeatures?.map((feature, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {feature.feature}
                      </span>
                      <span className="text-sm">
                        {(feature.importance * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${feature.importance * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <div className="bg-muted/30 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">
                    Feature Importance Visualization
                  </h4>
                  <div className="aspect-video bg-muted/50 rounded-md flex items-center justify-center">
                    <div className="text-center p-4">
                      
                      {featureImportanceImage && (
                 <div className="relative group/image">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0  transition-opacity duration-300" />
                  <img
                    src={featureImportanceImage || "/placeholder.svg"}
                    alt="Features Importance"
                    className="w-full h-100 object-cover rounded-sm shadow-sm border border-gray-200 transition-shadow duration-300"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium opacity-0  transition-opacity duration-300">
                    Feature Importance Visualization
                  </div>
                </div>
              )}

              {!featureImportanceImage && (
                <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                  <div className="text-center text-gray-500">
                    <BarChart2 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm">No visualization available</p>
                  </div>
                </div>
              )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          

        </Tabs>
      </CardContent>
    </Card>
  );
}
