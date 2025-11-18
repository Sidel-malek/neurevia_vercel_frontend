"use client"

import { motion } from "framer-motion"
import AnimateWhenVisible from "@/hook/useAnimateWhenVisible"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function HeroSection() {
  return (
    <AnimateWhenVisible variants={fadeIn} className="text-center mb-16">
      <motion.h1
        variants={fadeInUp}
        className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
      >
        How It Works
      </motion.h1>
      <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-lg">
        A step-by-step guide to our AI-powered diagnostic workflow
      </motion.p>
    </AnimateWhenVisible>
  )
}
