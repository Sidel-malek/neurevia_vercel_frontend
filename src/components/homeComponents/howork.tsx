'use client'

import { useRef, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

const HoworkSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const brainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (brainRef.current instanceof HTMLElement) {
      brainRef.current.style.transform = `translate(${mousePosition.x}px, ${mousePosition.y}px)`
    }
  }, [mousePosition])

  return (
    <section id="how-it-works" className="py-16 mx-20 min-h-[80vh] mt-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <div className="text-4xl font-bold mb-6">How it works</div>
            <p className="text-muted-foreground mb-6">
              Our AI platform uses deep learning algorithms to analyze brain MRI scans and identify patterns
              associated with early-stage neurodegeneration. By detecting subtle changes years before clinical
              symptoms appear, we enable earlier intervention and better patient outcomes.
            </p>
            <p className="text-muted-foreground mb-6">
              The system compares patient data against our extensive database of both healthy and affected brains,
              providing physicians with detailed reports and confidence scores to support clinical decision-making.
            </p>

            <Link href="/home/howItWorks"  >
             <Button  size="lg" className="bg-blue-600 text-white hover:bg-blue-700 h-10 gap-2 transition-transform hover:scale-105 active:scale-95">
            
                  Learn More
                <ArrowRight className="h-4 w-4 ml-2" />
              
            </Button>
            </Link>
            
          </div>

          {/* Video Section */}
          <div className="relative ml-60" ref={brainRef}>
            {/* Blue background card */}
            <div className="absolute inset-0 bg-blue-500 rounded-lg shadow-lg z-10 w-96 h-[450px] mt-4 ml-4"></div>

            {/* Video Container */}
            <motion.div
              className="relative z-20"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              animate={{ x: mousePosition.x, y: mousePosition.y }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <video
                  src="/video/videoPrototype.mp4"
                  className="w-96 h-[450px] rounded-lg shadow-lg object-cover"
                  controls
                  loop
                  autoPlay
                  muted
                />
              </motion.div>

              {/* Animated dots (neural connections) */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              />
              <motion.div
                className="absolute top-1/2 left-1/3 w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              />
              <motion.div
                className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-500 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HoworkSection
