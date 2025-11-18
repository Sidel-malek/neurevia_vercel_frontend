"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Calendar,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Microscope,
  Brain,
} from "lucide-react";

interface ClinicalRecommendationsProps {
  isPositive?: boolean;
}

export default function ClinicalRecommendations({
  isPositive = false,
}: ClinicalRecommendationsProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent" />
          <CardTitle>Clinical Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Immediate Actions</h4>
            <div className="space-y-3">
              {isPositive ? (
                <>
                  <div className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Further Neurological Assessment
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Recommend comprehensive cognitive evaluation and
                        neuroimaging
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-chart-4/5 rounded-lg border border-chart-4/20">
                    <Calendar className="h-4 w-4 text-chart-4 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Schedule Follow-up</p>
                      <p className="text-xs text-muted-foreground">
                        Monitor progression with regular biomarker assessments
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 p-3 bg-chart-1/5 rounded-lg border border-chart-1/20">
                    <CheckCircle className="h-4 w-4 text-chart-1 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Continue Routine Monitoring
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Maintain regular health assessments and lifestyle
                        factors
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-chart-2/5 rounded-lg border border-chart-2/20">
                    <TrendingUp className="h-4 w-4 text-chart-2 mt-0.5 flex-shrink-0" />
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
                <Microscope className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Biomarker Tracking</p>
                  <p className="text-xs text-muted-foreground">
                    Regular monitoring of CSF tau and amyloid levels
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
}
