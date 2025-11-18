import { Network, BarChart3, FileBarChart } from "lucide-react";
import  AnimateWhenVisible  from "@/hook/useAnimateWhenVisible";
import TechnologyCard from "./TechnologyCard";

// Animation variants
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  }
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }
  
  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  }
  
  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  }
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }
  
  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }
  

export default function TechnologySection() {
  return (
    <div className="mb-36">
      <AnimateWhenVisible variants={fadeIn} className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Our Technology</h2>
      </AnimateWhenVisible>

      <div className="grid md:grid-cols-3 gap-8">
        <AnimateWhenVisible variants={fadeInUp} className="h-full">
          <TechnologyCard
            icon={<Network className="w-8 h-8 text-violet-600 dark:text-violet-400" />}
            iconBgClass="bg-violet-100 dark:bg-violet-900/30"
            title="Advanced Neural Networks"
            description="Our platform uses deep neural network architectures specially designed for medical image analysis, with over 150 million optimized parameters."
          />
        </AnimateWhenVisible>

        <AnimateWhenVisible variants={fadeInUp} className="h-full">
          <TechnologyCard
            icon={<BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
            iconBgClass="bg-blue-100 dark:bg-blue-900/30"
            title="Massive Database"
            description="Trained on over 100,000 MRI scans and biomarker sets from medical centers worldwide, our AI offers unmatched diagnostic accuracy."
          />
        </AnimateWhenVisible>

        <AnimateWhenVisible variants={fadeInUp} className="h-full">
          <TechnologyCard
            icon={<FileBarChart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
            iconBgClass="bg-emerald-100 dark:bg-emerald-900/30"
            title="Explainable AI"
            description="Our system doesn't just provide results; it also explains its reasoning, giving physicians complete transparency into the factors influencing each diagnosis."
          />
        </AnimateWhenVisible>
      </div>
    </div>
  );
}
