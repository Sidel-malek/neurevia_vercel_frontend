import { motion } from 'framer-motion'
import React from 'react'
const NeurolAnimation = () => {
  return (
    <div className="absolute inset-0 opacity-20 z-0 overflow-hidden">
            {/* Neural network animated overlay */}

    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <motion.path
        d="M0,50 Q25,30 50,50 T100,50"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
      />
      <motion.path
        d="M0,60 Q25,40 50,60 T100,60"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
      />
      <motion.path
        d="M0,40 Q25,60 50,40 T100,40"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
      />
    </svg>
  </div>
  )
}

export default NeurolAnimation
