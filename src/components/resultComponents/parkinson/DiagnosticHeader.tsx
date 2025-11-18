import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, CheckCircle, AlertTriangle, User, Calendar, Stethoscope } from "lucide-react"

interface DiagnosticHeaderProps {
  patientName: string
  patientId: string
  patientAge: string
  patientGender: string
  finalPrediction: string
  confidence: number
  physician: string
  modelVersion: string
  analysisDate: string
  status: string
  probabilities: any[]
}

export default function DiagnosticHeader({
  patientName,
  patientId,
  patientAge,
  patientGender,
  finalPrediction,
  confidence,
  physician,
  modelVersion,
  analysisDate,
  status,
  probabilities
}: DiagnosticHeaderProps) {
  const isPositive = finalPrediction?.toLowerCase().includes("parkinson") || 
                   finalPrediction?.toLowerCase().includes("positive")

  return (
    <Card className="border-2 overflow-hidden rounded-lg bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Diagnostic Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Prediction Result */}
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center justify-center mb-4">
              {isPositive ? (
                <AlertTriangle className="h-12 w-12 text-orange-500" />
              ) : (
                <CheckCircle className="h-12 w-12 text-green-500" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {finalPrediction || "Unknown"}
            </h3>
            <p className="text-lg text-purple-600 font-semibold">
              Confidence: {confidence ? `${confidence}%` : "N/A"}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Physician:</span>
                <span>{physician || "Not specified"}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Model Version:</span>
                <span>{modelVersion}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Stethoscope className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {status}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Analysis Date:</span>
                <span>{analysisDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}