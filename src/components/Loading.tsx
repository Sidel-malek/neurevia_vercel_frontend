import { useState, useEffect } from "react"
import {  Brain  } from "lucide-react"
const Loading = () => {
  const [isLoading, setIsLoading] = useState(true)
  // Simulate data loading
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 2000)
  
      return () => clearTimeout(timer)
    }, [])
    
  return (
    <div>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="h-8 w-8 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="mt-6 text-cyan-500 font-mono text-sm tracking-widest">SYSTEM INITIALIZING</div>
            <div className="mt-2 text-cyan-700 font-mono text-xs tracking-wider">LOADING PRICING MODELS</div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Loading
