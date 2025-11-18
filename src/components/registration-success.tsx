"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from 'next/navigation';


export default function RegistrationSuccess() {
  const [code, setCode] = useState("")
  const router = useRouter();

  const handleConfirm = () => {
    console.log("Code entered:", code)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center shadow-inner">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Registration Successful!</h1>

        <p className="text-gray-600 text-sm">
          Your account has been created successfully. Your document has been received and is currently under verification.
          Thank you for your patience.
        </p>

        {/* Zone d'entrée de code si besoin */}
        {/* 
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="Enter confirmation code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-12 text-center tracking-widest text-lg"
        />
        */}

        <Button
          variant="ghost"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl transition-all duration-300 shadow-md"
          onClick={() => router.push('/auth')}
        >
          Go to Sign In
        </Button>

        {/* 
        <p className="text-sm text-gray-500">
          Didn't receive the code?{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">
            Resend verification
          </a>
        </p>

        <Button
          onClick={() => setIsAnimated(false)}
          variant="ghost"
          className="text-blue-600 hover:underline text-sm mt-2 flex items-center justify-center"
        >
          Go to Sign In <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        */}
      </div>
    </div>
  )
}
