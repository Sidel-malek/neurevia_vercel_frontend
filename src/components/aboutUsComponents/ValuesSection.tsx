"use client"

import { Heart, Microscope, Globe } from "lucide-react"
import { useEffect, useState, useRef } from "react"
const coreValues = [
  {
    title: "Patient-Centered Innovation",
    description:
      "We develop our technology with patients' needs at the forefront. Every innovation we pursue is evaluated based on its potential to improve patient outcomes and quality of life.",
    icon: Heart,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-600",
    position: "left",
  },
  {
    title: "Scientific Rigor",
    description:
      "We adhere to the highest standards of scientific methodology in our research and development. Our AI models undergo rigorous testing and validation before implementation in clinical settings.",
    icon: Microscope,
    color: "emerald",
    gradient: "from-emerald-500 to-emerald-600",
    bgGradient: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-600",
    position: "center",
  },
  {
    title: "Global Accessibility",
    description:
      "We're committed to making our technology accessible to healthcare providers worldwide, including in underserved regions where advanced diagnostic tools are often unavailable.",
    icon: Globe,
    color: "purple",
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-500/10 to-purple-600/5",
    iconColor: "text-purple-600",
    position: "right",
  },
]

export default function ValuesSection() {

  const [activeValue, setActiveValue] = useState<number | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const valueRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)

      // Check which value is in view
      valueRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const isInView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3

          if (isInView) {
            setActiveValue(index)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center sticky top-0 bg-slate-50/80 backdrop-blur z-10 mb-24 ">
        
          <h2 className="text-6xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Our Core{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Values</span>
          </h2>
          
        </div>

        {/* Values Flow Layout */}
        <div className="space-y-32">
          {coreValues.map((value, index) => {
            const IconComponent = value.icon
            const isEven = index % 2 === 0
            const isActive = activeValue === index

            return (
              <div key={index} ref={(el) => {
  valueRefs.current[index] = el
}} className="relative">
                {/* Connecting line */}
                {index < coreValues.length - 1 && (
                  <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-16 w-px h-16 bg-gradient-to-b from-gray-300 to-transparent"></div>
                )}

                <div
                  className={`flex flex-col lg:flex-row items-center gap-16 ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  {/* Icon Section */}
                  <div className="flex-shrink-0 relative group">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} rounded-full transition-all duration-1000 ${
                        isActive ? "scale-[6] opacity-30" : "scale-150"
                      } group-hover:scale-175`}
                    ></div>
                    <div
                      className={`relative bg-gradient-to-br ${value.gradient} rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 ${
                        isActive ? "w-24 h-24 scale-110" : "w-16 h-16"
                      } group-hover:shadow-3xl group-hover:scale-110`}
                    >
                      <IconComponent
                        className={`text-white transition-all duration-500 ${isActive ? "w-8 h-8" : "w-6 h-6"}`}
                      />
                    </div>
                    {/* Floating particles */}
                    <div
                      className={`absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r ${value.gradient} rounded-full transition-all duration-500 ${
                        isActive ? "opacity-100 animate-bounce" : "opacity-60"
                      } group-hover:animate-bounce`}
                    ></div>
                    <div
                      className={`absolute -bottom-3 -left-3 w-2 h-2 bg-gradient-to-r ${value.gradient} rounded-full transition-all duration-700 ${
                        isActive ? "opacity-100 animate-pulse" : "opacity-40"
                      } group-hover:animate-pulse`}
                    ></div>
                  </div>

                  {/* Content Section */}
                  <div
                    className={`flex-1 text-center ${isEven ? "lg:text-left" : "lg:text-right"} space-y-8 transition-all duration-700 ${
                      isActive ? "opacity-100 transform translate-y-0" : "opacity-70 transform translate-y-2"
                    }`}
                  >
                    <div className="space-y-2">
                      <h3
                        className={`font-bold text-gray-900 leading-tight transition-all duration-500 ${
                          isActive ? "text-3xl" : "text-2xl"
                        }`}
                      >
                        {value.title}
                      </h3>
                      <div
                        className={`h-1 bg-gradient-to-r ${value.gradient} rounded-full mx-auto lg:mx-0 transition-all duration-700 ${
                          isActive ? "w-32" : "w-24"
                        } ${!isEven ? "lg:ml-auto" : ""}`}
                      ></div>
                    </div>
                    <p
                      className={`text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 transition-all duration-500 ${
                        isActive ? "text-lg opacity-100" : "text-lg opacity-80"
                      } ${!isEven ? "lg:ml-auto" : ""}`}
                    >
                      {value.description}
                    </p>
                  </div>
                </div>

                {/* Value number */}
                <div
                  className={`absolute top-0 ${isEven ? "right-0" : "left-0"} font-bold text-gray-200 -z-10 transition-all duration-500 ${
                    isActive ? "text-9xl opacity-40" : "text-8xl opacity-20"
                  }`}
                >
                  0{index + 1}
                </div>
              </div>
            )
          })}
        </div>

      
      </div>
    </section>
  )
}









