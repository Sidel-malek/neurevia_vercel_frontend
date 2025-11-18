"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "@/components/login-form"
import RegisterForm from "@/components/register-form"
import LeftOverlay from "@/components/left-overlay"
import RightOverlay from "@/components/right-overlay"
import Loading from "@/components/loading_"

// Move the content that uses useSearchParams to a separate component
function AuthContent() {
  const [isAnimated, setIsAnimated] = useState(false)
  const searchParams = useSearchParams();

  // Vérifie si l'URL contient ?mode=register
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") {
      setIsAnimated(true); // Affiche le register form
    }
  }, [searchParams]);

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Formes d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-xl animate-blob"></div>
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-200/30 rounded-full blur-xl animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-yellow-200/30 rounded-full blur-xl animate-blob animation-delay-3000"></div>

        {/* Formes géométriques */}
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-400/20 rotate-45 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 rounded-full bg-purple-400/20 animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-pink-400/20 rounded-lg animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/5 w-14 h-14 bg-indigo-400/20 rounded-full animate-float animation-delay-3000"></div>
      </div>

      <div className="h-[600px] w-full max-w-5xl relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm bg-white/90 border border-white/40">
        {/* Login Form */}
        <div id='login'
          className={`bg-white absolute top-0 left-0 h-full w-1/2 flex justify-center items-center transition-all duration-700 ease-in-out z-20 ${
            isAnimated ? "translate-x-full opacity-0" : ""
          }`}
        >
          <div className="w-full max-w-md p-8">
            <LoginForm setIsAnimated={setIsAnimated} />
          </div>
        </div>

        {/* Registration Form */}
        <div id='register'
          className={`absolute top-0 left-0 h-full w-1/2 flex justify-center items-center transition-all duration-700 ease-in-out ${
            isAnimated ? "translate-x-full opacity-100 z-50 animate-show" : "opacity-0 z-10"
          }`}
        >
          <div className="w-full max-w-md p-8 overflow-y-auto h-full">
            <RegisterForm setIsAnimated={setIsAnimated} />
          </div>
        </div>

        {/* Overlay Container */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-100 ${
            isAnimated ? "-translate-x-full" : ""
          }`}
        >
          <div
            className={`bg-blue-600 relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out ${
              isAnimated ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Left Overlay Content */}
            <div
              className={`w-1/2 h-full absolute flex justify-center items-center top-0 transform transition-transform duration-700 ease-in-out ${
                isAnimated ? "translate-x-0" : "-translate-x-[20%]"
              }`}
            >
              <LeftOverlay isAnimated={isAnimated} setIsAnimated={setIsAnimated} />
            </div>

            {/* Right Overlay Content */}
            <div
              className={`w-1/2 h-full absolute flex justify-center items-center top-0 right-0 transform transition-transform duration-700 ease-in-out ${
                isAnimated ? "translate-x-[20%]" : "translate-x-0"
              }`}
            >
              <RightOverlay isAnimated={isAnimated} setIsAnimated={setIsAnimated} />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
        
        .animate-float {
          animation: float 8s infinite ease-in-out;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

// Main page component with Suspense boundary
export default function AuthPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthContent />
    </Suspense>
  )
}