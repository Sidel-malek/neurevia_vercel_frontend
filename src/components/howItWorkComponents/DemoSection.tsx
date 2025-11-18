import React from 'react'
import AnimateWhenVisible from "@/hook/useAnimateWhenVisible"
import { fadeIn , fadeInUp } from '@/lib/animationVariats'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Play } from 'lucide-react'
import Image from 'next/image'
import CanvasNeurons from '../CanvasNeurons'

const DemoSection = () => {
  return (
        <AnimateWhenVisible variants={fadeIn} className="mb-20 mt-10">
          
          <div className="bg-blue-100 rounded-xl w-full  shadow-xl">
            
            <div className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-brand-dark mb-4 text-center">
                  See Our Technology in Action
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-slate-700 text-center mb-8">
                  Discover how our AI platform analyzes brain images and generates detailed reports in real-time
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-2xl border-4 border-white/20"
                >
                 
                  <video
                  src="/video/videoPrototype.mp4"
                  className="w-full h-full rounded-lg shadow-lg object-cover"
                  controls
                  
                />
                </motion.div>
              </div>
            </div>
          </div>
        </AnimateWhenVisible>
  )
}

export default DemoSection
