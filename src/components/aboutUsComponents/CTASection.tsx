"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import useScrollAnimation from "@/hook/useScrollAnimation"

const CTASection = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white my-12 max-w-7xl mx-auto rounded-lg">
      <div className="container mx-auto">
        <div
          ref={ref}
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Join Us in Transforming Neurological Care
          </h2>
          <p className="text-lg mb-8">
            Whether you&apos;re a healthcare provider interested in implementing our technology, a researcher or institution interested in our approachand  looking to
            collaborate, or a patient advocate seeking information, we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-700 hover:bg-gray-200"
            >
              Start Free trail
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-brand-dark text-white hover:bg-gray-900/90 hover:text-white-900 border-brand-dark"
            >
              Request a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
