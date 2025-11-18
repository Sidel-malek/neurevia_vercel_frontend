import { Suspense } from "react";
import AlzheimersDiagnosticDashboard from "./AlzheimersDiagnosticDashboard";
import Loading from "@/components/loading_";

export default function BiomarkerResultPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AlzheimersDiagnosticDashboard />
    </Suspense>
  );
}