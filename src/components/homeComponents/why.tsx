"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Clock, Heart, LineChart, PiggyBank } from "lucide-react"

const benefits = [
  {
    id: "early-intervention",
    title: "Enables Early Intervention",
    description:
      "Treatments are more effective when started early, potentially slowing disease progression. The window for intervention is critical, and our technology helps identify warning signs before significant damage occurs.",
    imageSrc: "/images/early_intervention.jpg",
    imageAlt: "Doctor consulting",
    icon: <Clock className="h-6 w-6" />,
    color: "bg-blue-500",
    textColor: "text-blue-600",
    lightColor: "bg-blue-50",
    stat: "85%",
    statText: "of patients show better outcomes with early intervention",
  },
  {
    id: "quality-of-life",
    title: "Preserves Quality of Life",
    description:
      "Early diagnosis helps patients and families plan, adapt, and maintain independence longer. With proper preparation, patients can enjoy more quality time and maintain their dignity throughout their journey.",
    imageSrc: "/images/good_quality (2).jpg",
    imageAlt: "Family time",
    icon: <Heart className="h-6 w-6" />,
    color: "bg-rose-500",
    textColor: "text-rose-600",
    lightColor: "bg-rose-50",
    stat: "2x",
    statText: "longer period of independence for patients with early diagnosis",
  },
  {
    id: "treatment-outcomes",
    title: "Improves Treatment Outcomes",
    description:
      "Care strategies can be personalized earlier, improving outcomes. Healthcare providers can develop tailored treatment plans that address each patient's specific needs and circumstances.",
    imageSrc: "/images/treatement.jpg",
    imageAlt: "Health improvement",
    icon: <LineChart className="h-6 w-6" />,
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    lightColor: "bg-emerald-50",
    stat: "30%",
    statText: "better treatment effectiveness with early personalization",
  },
  {
    id: "cost-reduction",
    title: "Reduces Long-Term Costs",
    description:
      "Early management may reduce need for intensive care later, easing the economic burden. Families and healthcare systems can allocate resources more efficiently, resulting in better care at lower overall costs.",
    imageSrc: "/images/bad_cost.jpg",
    imageAlt: "Savings icon",
    icon: <PiggyBank className="h-6 w-6" />,
    color: "bg-amber-500",
    textColor: "text-amber-600",
    lightColor: "bg-amber-50",
    stat: "40%",
    statText: "reduction in long-term healthcare costs",
  },
]

export default function WhySection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const activeBenefit = benefits[activeIndex]

  // Auto-rotation functionality
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Only set interval if not paused
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % benefits.length)
      }, 5000)
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused])

  const handleCircleClick = (index : any) => {
    setActiveIndex(index)
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Why Early Detection is Crucial
          </motion.h2>

          <motion.div
            className="w-24 h-1 bg-blue-600 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Detecting neurodegenerative diseases early provides significant benefits for patients, families, and
            healthcare systems.
          </motion.p>
        </motion.div>

        {/* Horizontal circles */}
        <div className="flex justify-center mb-4">
          <div className="flex space-x-4 md:space-x-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.id}
                className={`relative cursor-pointer group`}
                onClick={() => handleCircleClick(index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <motion.div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${
                    activeIndex === index ? benefit.color : "bg-white"
                  } shadow-md transition-colors duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={activeIndex === index ? "text-white" : benefit.textColor}>{benefit.icon}</div>
                </motion.div>

                {/* Progress indicator */}
                {activeIndex === index && !isPaused && (
                  <svg className="absolute -inset-1" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className={benefit.textColor}
                      strokeDasharray="301"
                      strokeDashoffset="301"
                      initial={{ strokeDashoffset: 301 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 5, ease: "linear" }}
                      key={`progress-${activeIndex}`}
                    />
                  </svg>
                )}

                {/* Title below circle 
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap">
                  <p
                    className={`font-medium ${activeIndex === index ? benefit.textColor : "text-gray-500"} text-center text-xs md:text-sm transition-colors duration-300`}
                  >
                    {benefit.title.split(" ").slice(-2).join(" ")}
                  </p>
                </div>*/}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content card */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Text content side - animates */}
              <div className="md:w-1/2 p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`content-${activeBenefit.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className={`inline-block ${activeBenefit.lightColor} rounded-full px-3 py-1 text-sm font-medium ${activeBenefit.textColor} mb-4`}
                    >
                      {isPaused ? "Paused" : "Auto-changing in 5s"}
                    </div>
                    <h3 className={`text-2xl font-bold ${activeBenefit.textColor} mb-4`}>{activeBenefit.title}</h3>
                    <p className="text-gray-600 mb-6">{activeBenefit.description}</p>
                    <div className="flex items-center gap-4">
                      <div
                        className={`${activeBenefit.color} text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center`}
                      >
                        <motion.span
                          key={`stat-${activeBenefit.id}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                          {activeBenefit.stat}
                        </motion.span>
                      </div>
                      <p className="text-gray-600">{activeBenefit.statText}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Image side - fixed position with changing content */}
              <div className="md:w-1/2 h-64 md:h-auto relative">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={`image-${benefit.id}`}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Fallback placeholder while image loads */}
                    <div className={`absolute inset-0 ${benefit.lightColor}`}></div>

                    {/* Actual image */}
                    <Image
                      src={benefit.imageSrc || "/placeholder.svg?height=400&width=600"}
                      alt={benefit.imageAlt}
                      fill
                      className="object-cover"
                      priority={index === 0} // Prioritize loading the first image
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
