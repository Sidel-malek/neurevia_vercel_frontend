// app/results/alzheimer/biomarker-result/loading.tsx
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium">Loading diagnostic results...</p>
      </div>
    </div>
  );
}