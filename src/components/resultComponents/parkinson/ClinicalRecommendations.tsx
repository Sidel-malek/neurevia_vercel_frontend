import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, Stethoscope } from "lucide-react"

interface ClinicalRecommendationsProps {
  prediction?: string
  confidence?: number
  biomarkers?: any
}

export default function ClinicalRecommendations({ prediction, confidence, biomarkers }: ClinicalRecommendationsProps) {
  const isPositive = prediction?.toLowerCase().includes("parkinson") || 
                   prediction?.toLowerCase().includes("positive")

  return (
    <Card className="border-2 overflow-hidden rounded-lg bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-blue-600" />
          Clinical Recommendations
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Next Steps */}
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Recommended Next Steps
            </h4>
            <ul className="text-sm text-green-700 space-y-2">
              <li>• Consult with a neurologist for comprehensive evaluation</li>
              <li>• Consider additional motor function assessments</li>
              <li>• Monitor symptoms and progression over time</li>
              <li>• Schedule regular follow-up appointments</li>
            </ul>
          </div>

          {/* Follow-up Care */}
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Follow-up Care Plan
            </h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Implement lifestyle modifications as recommended</li>
              <li>• Consider physical therapy evaluation</li>
              <li>• Monitor medication response if applicable</li>
              <li>• Regular cognitive and motor assessments</li>
            </ul>
          </div>

          {/* Important Note */}
          <div className="rounded-lg bg-orange-50 p-4 border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Important Clinical Note
            </h4>
            <p className="text-sm text-orange-700">
              This AI-assisted analysis is for clinical support only and should be used as part of a comprehensive 
              diagnostic process. Always consult with qualified healthcare professionals for final diagnosis 
              and treatment decisions. The results should be interpreted in the context of the patient&aposs; complete 
              clinical picture.
            </p>
          </div>

          {/* Confidence Level */}
          {confidence && (
            <div className="rounded-lg bg-purple-50 p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Analysis Confidence</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <p className="text-sm text-purple-700 mt-2">
                Model confidence level: {confidence}%
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}