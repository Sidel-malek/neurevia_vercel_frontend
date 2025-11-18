// components/StepSection.tsx
import { Upload, Brain, FileText, Send } from "lucide-react";
import StepCard from "./StepCard";
import AnimateWhenVisible  from "@/hook/useAnimateWhenVisible"; // Replace with your actual import
import { fadeIn, fadeInUp } from "@/lib/animationVariats";
  

export default function StepSection() {
  const steps = [
    {
      number: 1,
      title: "Upload Brain MRI Scan and Biomarkers",
      icon: <Upload className="w-6 h-6 text-violet-600 dark:text-violet-400" />,
      color: "violet",
      items: [
        "Upload brain images in any format (JPEG, PNG, DICOM, NIfTI, etc.)",
        "Add biological biomarker data (proteins, metabolites, etc.)",
        "Integrate cognitive test results (digital assessments)",
        "Secure data transfer with full encryption",
      ],
    },
    {

      number: 2,
      title: "AI Analysis Begins",
      icon: <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      color: "blue",
      items: [
        "Real-time analysis of MRI, biomarkers, and cognitive test results, detecting subtle abnormalities",
        "Advanced processing of MRI sequences (segmentation, volumetry, texture analysis)",
        "Cross-correlation between biological, cognitive, and imaging data",
        "Comparison against a large-scale database of Alzheimer’s and Parkinson’s cases",
      ],
    },
    {
      number: 3,
      title: "View the Report",
      icon: <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      color: "emerald",
      items: [
        "Access a detailed report showing detected abnormalities",
        "View confidence scores for different pathological risks",
        "Explore heatmaps and 3D visualizations of affected regions",
        "Compare with similar cases and normative data",
      ],
    },
    {
      number: 4,
      title: "Download and Share Results",
      icon: <Send className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
      color: "orange",
      items: [
        "Secure download of annotated images and full report",
        "Share results with your care team or other institutions",
        "Generate downloadable files for external tools and systems",
        "Optional second opinion from specialized radiologists",
      ],
    },
  ];

  return (
    <div className="h-screen">
      <AnimateWhenVisible variants={fadeIn} className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Simple 4-Step Process</h2>
      </AnimateWhenVisible>

      <div className="grid md:grid-cols-2 gap-8">
        {steps.map((step) => (
          <AnimateWhenVisible key={step.number} variants={fadeInUp} className="h-full">
            <StepCard {...step} />
          </AnimateWhenVisible>
        ))}
      </div>
    </div>
  );
}
