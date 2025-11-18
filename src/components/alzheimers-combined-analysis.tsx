"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Brain, Microscope, Upload, AlertCircle , Info, } from "lucide-react"
import { BIOMARKER_CATEGORIES } from "@/lib/data/BIOMARKER_CATEGORIES"



export default function AlzheimersCombinedAnalysis(currentTheme:any ) {
    
  const [mriFiles, setMriFiles] = useState<File[]>([])
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<{ [key: string]: string | number }>({})
  const [activeCategory, setActiveCategory] = useState("demographics")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)



  const infoBgStyle =
    currentTheme === "dark" ? "bg-blue-900/30 border-blue-700/50" : "bg-blue-100/70 border-blue-300/50"

  const infoTextStyle = currentTheme === "dark" ? "text-blue-400" : "text-blue-700"

  const textPrimaryStyle = currentTheme === "dark" ? "text-slate-100" : "text-gray-900"

  const textSecondaryStyle = currentTheme === "dark" ? "text-slate-400" : "text-gray-700"

  const textTertiaryStyle = currentTheme === "dark" ? "text-slate-500" : "text-gray-500"

 
  const handleBiomarkerChange = (fieldKey: string, value: string | number) => {
    setSelectedBiomarkers((prev) => ({
      ...prev,
      [fieldKey]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMriFiles(Array.from(e.target.files))
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const startCombinedAnalysis = async () => {
    // Validate both MRI files and biomarker data are present
    if (mriFiles.length === 0) {
      alert("Please upload at least one MRI file")
      return
    }

    const validBiomarkers = Object.entries(selectedBiomarkers).filter(
      ([key, value]) => value !== "" && value !== null && value !== undefined,
    )

    if (validBiomarkers.length === 0) {
      alert("Please enter at least one biomarker value")
      return
    }

    setIsAnalyzing(true)
    setProgress(0)

    try {
      const formData = new FormData()

      // Add MRI files
      mriFiles.forEach((file, index) => {
        formData.append(`mri_file_${index}`, file)
      })

      // Add biomarker data with proper structure
      const biomarkerPayload = {
        biomarkers: Object.fromEntries(validBiomarkers),
        selectedBiomarkers: Object.keys(selectedBiomarkers),
        patientId: `p_${Date.now()}`,
        timestamp: new Date().toISOString(),
      }

      formData.append("biomarker_data", JSON.stringify(biomarkerPayload))
      formData.append("file_count", mriFiles.length.toString())

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 10
          if (next >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return next
        })
      }, 300)

      const response = await fetch("/api/alzheimers/combined-analysis", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const result = await response.json()

      if (response.ok) {
        // Handle successful analysis
        setTimeout(() => {
          setIsAnalyzing(false)
          setProgress(0)
          // Navigate to results or show results
        }, 1000)
      } else {
        throw new Error(result.error || "Analysis failed")
      }
    } catch (error) {
      console.error("Combined analysis error:", error)
      alert("Analysis failed. Please try again.")
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  return (
    <Card className="backdrop-blur-sm">
      <CardContent className="p-6">
        <div className={`${infoBgStyle} p-4 rounded-lg mb-8 flex items-start`}>
          <Info className={`${infoTextStyle} mr-3 mt-0.5 h-5 w-5 flex-shrink-0`} />
          <p className={textSecondaryStyle}>
            Combined analysis integrates MRI imaging data with biomarker results for comprehensive diagnostic
            assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* MRI Upload Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              MRI Data
            </h3>
            <p className="text-sm text-gray-600 mb-4">Upload MRI scans</p>

            <div className="border-2 my-8 py-16 border-dashed border-gray-300 hover:border-blue-600 rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <Upload className="h-8 w-8 text-blue-600 mb-4" />
              <h4 className="text-md font-medium text-gray-900 mb-1">Drag & drop files</h4>
              <p className="text-sm text-gray-600 mb-2">or</p>
              <Button onClick={handleBrowseClick} className="bg-blue-600 hover:bg-blue-700">
                Browse Files
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept=".dcm,.nii,.nii.gz,.jpg,.png,.jpeg"
              />
              <p className="mt-3 text-xs text-gray-500">Supported formats: DICOM, NIfTI (.nii, .nii.gz)</p>
            </div>

            {mriFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                {mriFiles.map((file, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {file.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Biomarker Input Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Microscope className="h-5 w-5 mr-2 text-blue-600" />
              Biomarker Data
            </h3>
            <p className="text-sm text-gray-600 mb-4">Input biomarker results</p>

            {/* Category Selection */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(BIOMARKER_CATEGORIES).map(([key, category]) => (
                <Button
                  key={key}
                  variant={activeCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(key)}
                  className={activeCategory === key ? "bg-blue-600 text-white" : ""}
                >
                  {category.title}
                </Button>
              ))}
            </div>

            {/* Active Category Fields */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">
                {BIOMARKER_CATEGORIES[activeCategory as keyof typeof BIOMARKER_CATEGORIES].title}
              </h4>

              <div className="space-y-3">
                {Object.entries(BIOMARKER_CATEGORIES[activeCategory as keyof typeof BIOMARKER_CATEGORIES].fields).map(
                  ([fieldKey, field]) => (
                    <div key={fieldKey} className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 block">
  {field.label}
  {"range" in field && field.range && (
    <span className="text-xs text-gray-500 ml-2">
      ({field.range} {"unit" in field ? field.unit : ""})
    </span>
  )}
</label>


                      {field.type === "select" && 'options' in field ? (
  <select
    value={selectedBiomarkers[fieldKey] || ""}
    onChange={(e) => handleBiomarkerChange(fieldKey, e.target.value)}
    className="w-full bg-white border border-gray-300 rounded-md p-2"
  >
    <option value="">Select...</option>
    {field.options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
) : (
  <Input
    type={field.type === "number" ? "number" : "text"}
    placeholder={`Enter ${field.label.toLowerCase()}`}
    value={selectedBiomarkers[fieldKey] || ""}
    onChange={(e) => handleBiomarkerChange(fieldKey, e.target.value)}
    className="bg-white"
  />
)}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Button and Progress */}
        <div className="flex flex-col items-center">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 mb-3"
            onClick={startCombinedAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Run Combined Analysis"}
          </Button>

          {isAnalyzing && (
            <div className="w-full max-w-md">
              <div className="bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center">{progress}% Complete</p>
            </div>
          )}

          <div className="flex items-center text-xs text-blue-600 mt-2">
            Combined analysis provides up to 94% diagnostic accuracy
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
