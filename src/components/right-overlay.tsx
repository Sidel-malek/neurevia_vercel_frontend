"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface RightOverlayProps {
  isAnimated: boolean
  setIsAnimated: (value: boolean) => void
}

export default function RightOverlay({ isAnimated, setIsAnimated }: RightOverlayProps) {
  return (
    <div className="text-center text-white p-8 max-w-md relative z-10">
      <div className="space-y-6">
        <div className="relative">
          {/* Formes d'arrière-plan */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-400/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-400/30 rounded-full blur-xl animate-pulse delay-700"></div>

          {/* Formes géométriques */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-0 left-10 w-6 h-6 bg-white/10 rotate-45 animate-float delay-500"></div>
          <div className="absolute top-10 left-0 w-10 h-10 bg-white/10 rounded-lg animate-float delay-1000"></div>

          <h1 className="text-4xl font-bold mb-4 leading-tight relative">
            Welcome{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 font-extrabold">
              Back!
            </span>
          </h1>
        </div>
        <p className="text-lg mb-8 text-white/90 relative">
          To keep connected with us please login with your personal information
        </p>
        <Button
          onClick={() => setIsAnimated(true)}
          className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl px-8 py-6 rounded-xl font-medium text-lg group"
        >
          Sign Up
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}
