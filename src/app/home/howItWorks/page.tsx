"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, useInView } from "framer-motion"
import HeroSection from "@/components/howItWorkComponents/HeroSection"
import OverviewSection from "@/components/howItWorkComponents/OverviewSection"
import AnimateWhenVisible from "@/hook/useAnimateWhenVisible"
import StepSection from "@/components/howItWorkComponents/StepSection"
import TechnologySection from "@/components/howItWorkComponents/TechnologySection"
import { FaqSection } from "@/components/howItWorkComponents/FaqSection"
import DemoSection from "@/components/howItWorkComponents/DemoSection"



export default function HowItWorksPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
      <OverviewSection />
      <StepSection/>
      <TechnologySection/>
      <FaqSection/>
      </div>
    </div>
  )
}
