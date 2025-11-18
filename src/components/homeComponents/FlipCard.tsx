"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface FlipCardProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  delay: number
}

const FlipCard = ({ title, description, imageSrc, imageAlt, delay }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true)
      const backTimer = setTimeout(() => {
        setIsFlipped(false)
      }, 10000)
      return () => clearTimeout(backTimer)
    }, delay + 2000) // Each card waits based on delay

    return () => clearTimeout(timer)
  }, [delay])

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  return (
    <motion.div
      className="w-full h-[300px] perspective-1000"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      onClick={toggleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover rounded-2xl"
          />
          <div className="absolute bottom-0 w-full bg-white bg-opacity-80 text-center py-2">
            <h3 className="text-blue-900 font-semibold text-lg">{title}</h3>
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover rounded-2xl opacity-60"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center px-4">
            <h3 className="text-blue-900 font-bold text-lg mb-2 bg-white bg-opacity-80 px-2 rounded">
              {title}
            </h3>
            <p className="text-sm text-gray-800 bg-white bg-opacity-80 p-2 rounded text-center">
              {description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FlipCard
