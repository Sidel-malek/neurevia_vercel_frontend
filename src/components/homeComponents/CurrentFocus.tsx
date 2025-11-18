"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Activity } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const CurrentFocus = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-rotate between diseases
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev === 0 ? 1 : 0))
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [isPaused])

  const diseases = [
    {
      name: "Alzheimer's disease",
      description:
        "A progressive neurodegenerative disorder that affects memory, thinking, and behavior. Our platform focuses on detecting early signs to enable timely intervention.",
      image: "/images/alz.png",
      color: "from-blue-600 to-violet-600",
      textColor: "text-blue-50",
      icon: <Brain className="h-6 w-6" />,
      stats: [
        { value: "5.8M", label: "Americans affected" },
        { value: "60%", label: "Better outcomes with early detection" },
      ],
    },
    {
      name: "Parkinson's disease",
      description:
        "A neurodegenerative disorder that primarily affects movement control. Early detection can significantly improve quality of life and treatment outcomes.",
      image: "/images/par.png",
      color: "from-cyan-500 to-blue-500",
      textColor: "text-emerald-50",
      icon: <Activity className="h-6 w-6" />,
      stats: [
        { value: "1M", label: "Americans affected" },
        { value: "70%", label: "Cases can be detected earlier" },
      ],
    },
  ]

  const activeDiseaseData = diseases[activeIndex]

  return (
    <div ref={containerRef} className="relative  lg:max-w-7xl md:max-w-3xl  mx-auto lg:h-[85vh]  my-10">
      {/* Background design elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden mt-16  lg:rounded-lg lg:rounded-tr-none sm:rounded-xl">
        <motion.div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-gray-900 p-4" />
        <motion.div
          className="absolute -top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full opacity-20 blur-3xl"
          style={{
            background: `linear-gradient(to right, ${activeIndex === 0 ? "#3b82f6, #8b5cf6" : "#10b981, #0d9488"})`,
          }}
        />
        <motion.div
          className="absolute -bottom-[30%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-10 blur-3xl"
          style={{
            background: `linear-gradient(to right, ${activeIndex === 0 ? "#8b5cf6, #3b82f6" : "#0d9488, #10b981"})`,
          }}
        />

        {/* Neural network lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[...Array(8)].map((_, i) => (
            <motion.path
              key={i}
              d={`M${10 + i * 10},0 Q${50},${50 + (i % 3) * 10} ${90 - i * 10},100`}
              stroke="white"
              strokeWidth="0.2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 1,
              }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left side - Content */}
        <motion.div
          className="relative  px-8 py-16 lg:py-20 lg:pl-16 lg:pr-8"
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: [ -200, 30, -10, 0 ], opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <Link href="/home/blog">
              <motion.div
                className="inline-flex mt-6 items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/80 text-sm lg:mb-6 sm:mb-6 font-medium w-fit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Our Research Focus
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>

            <h2 className="text-[42px] font-bold mt-20 text-white mb-8 leading-tight">
              Current{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeDiseaseData.color}`}>Focus</span>
            </h2>

            <p className="text-xl text-white/80 leading-relaxed mb-10 md:text-base">
              At the moment, our focus is dedicated to deepening the understanding and early detection of Alzheimer&apos;s
              and Parkinson&apos;s diseases—two of the most widespread and challenging neurodegenerative disorders.
            </p>

            {/* Disease selector */}
            <div className="flex space-x-4">
              {diseases.map((disease, index) => (
                <button
                  key={index}
                  className={`relative px-6 py-3 rounded-full transition-all duration-300 overflow-hidden ${
                    activeIndex === index
                      ? `bg-gradient-to-r ${disease.color} text-white`
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="flex items-center space-x-2 relative z-10">
                    <span>{disease.icon}</span>
                    <span className="font-medium">{disease.name.split(" ")[0]}</span>
                  </div>
                  {activeIndex === index && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 6,
                        ease: "linear",
                        repeat: isPaused ? 0 : Infinity,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right side - Disease visualization */}
        <motion.div
            className=" mt-4 relative h-[80vh] bottom-0 overflow-hidden rounded-lg lg:rounded-xl lg:rounded-br-none "
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: [ -200, 30, -10, 0 ], opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${activeDiseaseData.color} opacity-90`} />

            <div className="relative z-10 h-[80vh] flex flex-col">
            {/* Top part - Disease info */}
            <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`disease-${activeIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-lg"
                >
                  <div className="flex items-start gap-6 mb-8">
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                      <Image
                        src={activeDiseaseData.image || "/placeholder.svg"}
                        alt={`${activeDiseaseData.name} illustration`}
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold md:text-2xl text-white">{activeDiseaseData.name}</h3>
                      <p className="text-white/80 leading-relaxed md:text-sm">{activeDiseaseData.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {activeDiseaseData.stats.map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg flex flex-col justify-between"
                      >
                        <div className="text-white font-bold text-3xl">{stat.value}</div>
                        <div className="text-white/70 text-sm">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom part - Brain visualization */}
            <div className="h-52 lg:h-72 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 4, -4, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="relative w-52 h-52 lg:w-64 lg:h-64"
                >
                  <Image
                    src="/images/brain.png"
                    alt="Brain visualization"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${activeDiseaseData.color} opacity-60 blur-md`}
                    />
                  </div>
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <span className="text-white/70 text-sm">
                  {activeIndex === 0
                    ? "Affects memory and cognitive function"
                    : "Affects motor control and movement"}
                </span>
              </div>
              
            </div>
            
            </div>
          
        </motion.div>
        </div>
        
      
    </div>
  )
}

export default CurrentFocus
