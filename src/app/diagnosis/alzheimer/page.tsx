"use client";

import { useState, useRef, useEffect } from "react";
import {
  Brain,
  Activity,
  Microscope,
  Info,
  Upload,
  FileText,
  X,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AlzheimersCombinedAnalysis from "@/components/alzheimers-combined-analysis";
import PatientSelectionHeader from "@/components/PatientSelectionHeader";
import Sidebar from "@/components/Sidebar";
import HeaderInside from "@/components/headerInside";
import { BIOMARKER_CATEGORIES } from "@/lib/data/BIOMARKER_CATEGORIES"
import { useRouter } from "next/navigation";
import { getThemeStyles } from "@/lib/themeStyles";

import{BiomarkerField} from "@/components/BiomarkerField"
import ProgressBar from "@/components/ProgressBar";




export default function AlzheimerPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("mri");
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("light");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [notes, setNotes] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedDiagnosticType, setSelectedDiagnosticType] = useState<string>("");
  const [isUploaded, setIsUploaded] = useState(false);
  const router = useRouter();



  const [biomarkerLoading, setBiomarkerLoading] = useState(false);
  const [biomarkerSuccess, setBiomarkerSuccess] = useState(false);
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<{
    [key: string]: string | number;
  }>({});
  const [activeCategory, setActiveCategory] = useState("demographics");

  const handleNewPatientSelection = () => {
  // Reset all patient-related states
  setSelectedPatient(null)
  setPatientName("")
  setPatientAge("")
  setNotes("")
}


// Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };
  
   // Handle patient selection from header component
  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setPatientName(
      patient ? `${patient.user.first_name} ${patient.user.last_name}` : "",
    );
    setPatientAge(
      patient?.user.date_of_birth
        ? calculateAge(patient.user.date_of_birth)
        : "",
    );
  };


  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  
  // Handle diagnostic type selection from header component
  const handleDiagnosticTypeSelect = (type: string) => {
    setSelectedDiagnosticType(type);
    // You might want to adjust the active tab based on the diagnostic type
    if (type === "Alzheimer's") {
      setActiveTab("mri");
    } else if (type === "Parkinson's") {
      // Set appropriate tab for Parkinson's
    }
  };

  
  

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    setIsUploaded(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setIsUploaded(true);
      
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setIsUploaded(false)
  };


const handleAnalyse = async () => {
  if (!files.length) {
    alert("Please upload at least one MRI scan before analysis.");
    return;
  }
  
  if (!selectedPatient) {
    alert("Please select a patient before analysis.");
    return;
  }
  
  setLoading(true);
  setIsAnalyzing(true);

  try {
    const formData = new FormData();
    formData.append("image", files[0]);
    formData.append("patient_id", (selectedPatient.id ?? selectedPatient.patient_id));

    // Progress simulation
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    const res = await fetch(`${apiUrl}/api/predict/alzheimer`, {
      method: "POST",
      credentials: "include",   // this sends the HttpOnly cookie

      body: formData,
    });

    clearInterval(progressInterval);
    setAnalysisProgress(100);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }

    // Récupérez les données de la réponse
    const result = await res.json();
    // Vérifiez que l'analyse a été créée avec succès
    if (result.analyse_id) {
      // Stockez les données temporairement pour la page de résultats
      sessionStorage.setItem('lastAnalysisResult', JSON.stringify(result));
      
      // Redirigez avec l'ID de l'analyse
      router.push(`/results/alzheimer/mri-result?analysis_id=${result.analyse_id}`);

    } else {
      throw new Error("No analysis ID returned from server");
    }
    
  } catch (error) {
    console.error("Analysis error:", error);
    alert(`Analysis failed: ${error}`);
  } finally {
    setLoading(false);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  }
};

  const handleBiomarkerChange = (fieldKey: string, value: string | number) => {
    setSelectedBiomarkers((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

const handleBiomarkerSubmit = async () => {
    setBiomarkerLoading(true);
    setBiomarkerSuccess(false);
    if (!selectedBiomarkers) {
    alert("Please write at least 4 biomarkers.");
    return;
  }
  
  if (!selectedPatient) {
    alert("Please select a patient before analysis.");
    return;
  }

    try {
      const validBiomarkers = Object.entries(selectedBiomarkers).filter(
        ([key, value]) => value !== "" && value !== null && value !== undefined,
      );

      if (validBiomarkers.length === 0) {
        alert("Please enter at least one biomarker value");
        setBiomarkerLoading(false);
        return;
      }

      const payload = {
        patientId: (selectedPatient.id ?? selectedPatient.patient_id) ,
        biomarkers: Object.fromEntries(validBiomarkers),
        notes: notes || "",
        selectedBiomarkers: Object.keys(selectedBiomarkers),
        diagnosticType: selectedDiagnosticType || "Alzheimer's",
      };

      // Determine endpoint based on selected biomarkers
      const csfDemoFeatures = [
        "NACCAGE",
        "SEX",
        "EDUC",
        "MARISTAT",
        "CSFABETA",
        "CSFTTAU",
        "CSFPTAU",
      ];
      const isSubset = (a: string[], b: string[]) =>
        a.every((v) => b.includes(v));

      let endpoint = "predict/biomarkers/all"; // default
      if (isSubset(payload.selectedBiomarkers, csfDemoFeatures)) {
        endpoint = "predict/biomarkers/csf_demo";
      }

      const response = await fetch(`${apiUrl}/api/${endpoint}`, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        credentials: "include",   // this sends the HttpOnly cookie
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setBiomarkerSuccess(true);
        sessionStorage.setItem('feature_importance',  JSON.stringify(data.feature_importance) );

        sessionStorage.setItem('feature_importance_image', data.feature_importance_image)

        setTimeout(() => {
          router.push(`/results/alzheimer/biomarker-result?analysis_id=${data.analyse_id}`);
        }, 2000);
      } else {
        throw new Error(data.error || "Failed to save biomarker data");
      }
    } catch (error) {
      console.error("Error submitting biomarker data:", error);
      alert("Error saving biomarker data. Please try again.");
    } finally {
      setBiomarkerLoading(false);
    }
  };

  
  const styles = getThemeStyles(currentTheme, isDragging);


  return (
  
  <div className="flex">
      <Sidebar />
    <div className={`min-h-screen ${styles.bgStyle}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-blue-400 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-6 border-4 border-b-blue-600 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-8 border-4 border-l-blue-400 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-blue-400 font-mono text-sm tracking-wider">
              LOADING DATA
            </div>
          </div>
        </div>
      )}
      <div className="sticky top-0 z-10 ">
          {/* Header */}
          <HeaderInside />
        </div>


        <div className="px-6 pt-6 flex items-center gap-3">
      <button
        onClick={() => router.push("/diagnostic-tools")}
        className="flex items-center gap-1 text-sm text-gray-900 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
                <h5 className={`text-3xl font-bold ${styles.textPrimaryStyle}`}>
                Alzheimer
              </h5>
      </button>
    </div>

      <div className="container mx-auto px-4 py-8">
        {/* Patient Selection Header */}
        <PatientSelectionHeader
          onPatientSelect={handlePatientSelect}
          onCreatePatient={handleNewPatientSelection}
        />

        

        {/* Main Content */}
        <Tabs
          defaultValue="mri"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList
            className={`grid w-full grid-cols-3 mb-8 ${styles.tabsBgStyle} p-1`}
          >
            <TabsTrigger
              value="mri"
              className={`flex items-center gap-2 ${styles.tabsActiveStyle}`}
            >
              <Brain className="h-5 w-5" />
              MRI Analysis
            </TabsTrigger>
            <TabsTrigger
              value="biomarker"
              className={`flex items-center gap-2 ${styles.tabsActiveStyle}`}
            >
              <Activity className="h-5 w-5" />
              Biomarker Analysis
            </TabsTrigger>
            <TabsTrigger
              value="combined"
              className={`flex items-center gap-2 ${styles.tabsActiveStyle}`}
            >
              <Microscope className="h-5 w-5" />
              Combined Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mri">
            <Card className={`${styles.cardBgStyle} backdrop-blur-sm`}>
              <CardContent className="p-6">
                {/* Info box */}
                <div
                  className={`${styles.infoBgStyle} p-4 rounded-lg mb-8 flex items-start`}
                >
                  <Info
                    className={`${styles.infoTextStyle} mr-3 mt-0.5 h-5 w-5 flex-shrink-0`}
                  />
                  <p className={styles.textSecondaryStyle}>
                    Upload MRI scans to analyze brain structure and detect early
                    signs of neurodegeneration. Our AI algorithm will identify
                    affected regions and provide a confidence score.
                  </p>
                </div>

                {/* Upload section */}
                <div className="mb-6">
                  <h2
                    className={`text-xl font-semibold ${styles.textPrimaryStyle} mb-4 flex items-center`}
                  >
                    <Upload className="mr-2 h-5 w-5 text-blue-600" />
                    Secure MRI Scans Upload Interface
                  </h2>

                  <div
                    className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors ${
                      isUploaded
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : styles.uploadBorderStyle
                    } `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Upload className="h-10 w-10 text-blue-600" />
                      </div>
                    </div>
                    <h3
                      className={`text-lg font-medium ${styles.textPrimaryStyle} mb-1`}
                    >
                      Drag & drop files here
                    </h3>
                    <p className={`text-sm mb-4 ${styles.textSecondaryStyle}`}>or</p>
                    <Button
                      onClick={handleBrowseClick}
                      className={styles.buttonPrimaryStyle}
                    >
                      Browse Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".jpg ,.png , .jpeg "
                    />
                    <p className={`mt-4 text-xs ${styles.textTertiaryStyle}`}>
                      Supported formats: (.jpeg, .jpg , .png)
                    </p>
                    {/* File list */}
                {files && (
                  <div className="m-8">
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between ${styles.fileItemBgStyle} p-3 rounded-md`}
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-blue-600 mr-2" />
                            <span className={`text-sm ${styles.textPrimaryStyle}`}>
                              {file.name}
                            </span>
                            <span
                              className={`ml-2 text-xs ${styles.textTertiaryStyle}`}
                            >
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className={`h-8 w-8 p-0 ${styles.textSecondaryStyle} hover:text-red-400 hover:bg-gray-200`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    
                  </div>
                )}
                  </div>
                  
                </div>
 <div className="mt-8">
  {analysisProgress > 0 && analysisProgress < 100 && files && (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <span className={`text-sm ${styles.textSecondaryStyle}`}>
          Analyzing Clinical data...
        </span>
        <span className="text-sm text-blue-600">
          {analysisProgress}%
        </span>
      </div>
      <ProgressBar progress={analysisProgress} />
      <div
        className={`text-xs ${styles.textTertiaryStyle} animate-pulse`}
      >
        AI model processing analysis
      </div>
    </div>
  )}
    <div className="mt-6 flex justify-end">
      <Button
        onClick={handleAnalyse}
        className={styles.buttonPrimaryStyle}
      >
        {loading ? "Analysis in progress..." : "Analyze"}
      </Button>
    </div>
  
                    </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biomarker">
            <Card className={`${styles.cardBgStyle} backdrop-blur-sm`}>
              <CardContent className="p-6">
                <div
                  className={`${styles.infoBgStyle} p-4 rounded-lg mb-8 flex items-start`}
                >
                  <Info
                    className={`${styles.infoTextStyle} mr-3 mt-0.5 h-5 w-5 flex-shrink-0`}
                  />
                  <p className={styles.textSecondaryStyle}>
                    Enter comprehensive biomarker data based on standardized
                    Alzheimer&apos;s research protocols. Select biomarkers from
                    different categories and input their values according to
                    established ranges.
                  </p>
                </div>


                <div className="mb-6">
                  <h2
                    className={`text-xl font-semibold ${styles.textPrimaryStyle} mb-4 flex items-center`}
                  >
                    <Microscope className="mr-2 h-5 w-5 text-blue-600" />
                    Comprehensive Biomarker Assessment
                  </h2>

                  {/* Category Navigation */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {Object.entries(BIOMARKER_CATEGORIES).map(
                      ([key, category]) => (
                        <Button
                          key={key}
                          variant={
                            activeCategory === key ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setActiveCategory(key)}
                          className={
                            activeCategory === key
                              ? styles.buttonPrimaryStyle
                              : styles.buttonOutlineStyle
                          }
                        >
                          {category.title}
                        </Button>
                      ),
                    )}
                  </div>

                  {/* Active Category Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Object.entries(
      BIOMARKER_CATEGORIES[activeCategory as keyof typeof BIOMARKER_CATEGORIES].fields
    ).map(([fieldKey, field]) => (
      <BiomarkerField
        key={fieldKey}
        fieldKey={fieldKey}
        field={field}
        value={selectedBiomarkers[fieldKey]}
        onChange={handleBiomarkerChange}
        styles={styles}
      />
    ))}
  </div>
                  {/* Summary of selected biomarkers */}
                  {Object.keys(selectedBiomarkers).length > 0 && (
                    <div className={`mt-6 ${styles.fileItemBgStyle} rounded-lg p-4`}>
                      <h4
                        className={`text-sm font-medium ${styles.textPrimaryStyle} mb-2`}
                      >
                        Selected Biomarkers (
                        {Object.keys(selectedBiomarkers).length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedBiomarkers).map(
                          ([key, value]) => (
                            <Badge
                              variant="secondary"
                              key={key}
                              className="text-xs font-normal text-white/90"
                            >
                              {key}: {value}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                     <div className="mt-8">
                      {analysisProgress > 0 && analysisProgress < 100 && (
                        <div className="mt-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${styles.textSecondaryStyle}`}>
                              Analyzing Biomarkers data...
                            </span>
                            <span className="text-sm text-blue-600">
                              {analysisProgress}%
                            </span>
                          </div>
                          <ProgressBar progress={analysisProgress} />
                          <div
                            className={`text-xs ${styles.textTertiaryStyle} animate-pulse`}
                          >
                            AI model processing Biomarkers data analysis
                          </div>
                        </div>
                      )}
                        <div className="mt-6 flex justify-end">
                          <Button
                            onClick={handleBiomarkerSubmit}
                            className={styles.buttonPrimaryStyle}
                          >
                            {loading ? "Analysis in progress..." : "Analyze"}
                          </Button>
                        </div>
                      
                                        </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="combined">
            <AlzheimersCombinedAnalysis
              currentTheme={currentTheme}
              selectedPatient={selectedPatient}
              selectedDiagnosticType={selectedDiagnosticType}
            />
          </TabsContent>
        </Tabs>

       
      </div>
    </div>
  </div>
  );
}
