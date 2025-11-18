'use client'

import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import AnimateWhenVisible from '@/hook/useAnimateWhenVisible'
import Link from 'next/link'
import { fadeInUp } from '@/lib/animationVariats'
import Image from "next/image"

const MainSection = () => {
  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* 🎥 Video Background */}
      {/*<video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/video/videovisualisation.mp4"
        autoPlay
        loop
        muted
        playsInline
      />*/}
      <Image
          src="/images/Pathologies-vieillissement-demences-vasculaires-700x465-1.jpg"
          alt="Brain illustration"
          width={500}
          height={500}
          className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10" />

      {/* Foreground Content */}
      <div className="relative z-20 container  px-6 lg:px-12 ">
        {/* Text + CTA */}
        <AnimateWhenVisible variants={fadeInUp}>
          <div className="text-white max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              AI-Powered Early Detection for Alzheimer&apos;s and Parkinson&apos;s
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Advanced AI analyzes multimodal data to assist doctors in detecting early signs of neurodegenerative diseases.
            </p>
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 h-10 gap-2">
              <Link href="/auth">Get Started</Link>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </AnimateWhenVisible>
      </div>
    </section>
  )
}

export default MainSection
