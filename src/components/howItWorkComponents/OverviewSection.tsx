"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import AnimateWhenVisible from "@/hook/useAnimateWhenVisible"
import { useEffect, useState } from "react"
import HeroSection from "./HeroSection"
import { fadeIn , fadeInUp } from '@/lib/animationVariats'
const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
}
const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
}

export default function OverviewSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-[92vh]">
        <HeroSection/>
        <div className="grid md:grid-cols-2 gap-16 items-center mt-28 ">
       <AnimateWhenVisible variants={fadeInLeft} className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
          Our AI platform revolutionizes neurological diagnosis
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Our AI platform uses deep learning algorithms to analyze brain MRI scans and identify patterns associated
          with early-stage neurodegeneration.
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          The system compares patient data against our extensive database of both healthy and affected brains,
          providing physicians with detailed reports and confidence scores to support clinical decision-making.
        </p>
      </AnimateWhenVisible>

      <AnimateWhenVisible
        variants={fadeInRight}
        className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700"
      >
        
        <motion.div
                variants={fadeInUp}
                          whileHover={{ scale: 1.02 }}
                          className="aspect-video bg-brand rounded-xl overflow-hidden relative shadow-2xl border-2 border-white/20"
                        >
                         
                          <video
                          src="/video/videoPrototype.mp4"
                          className="w-full h-full rounded-lg shadow-lg object-cover"
                          controls
                          
                        />
                        </motion.div>
        
      </AnimateWhenVisible>
    </div>
    </div>
    
  )
}
