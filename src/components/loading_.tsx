import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function Loading({ 
  message = "Loading...", 
  size = "md" 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl"
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin mx-auto mb-4`} />
        <p className={`${textSizes[size]} font-medium`}>{message}</p>
      </div>
    </div>
  );
}

// Optional: Export specific variants for common use cases
export function PageLoading() {
  return <Loading message="Loading page..." size="lg" />;
}

export function ContentLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p className="text-sm font-medium">Loading content...</p>
      </div>
    </div>
  );
}