"use client"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"  
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import { authService } from "@/lib/auth"

interface LoginFormProps {
  setIsAnimated: (value: boolean) => void
}

export default function LoginForm({ setIsAnimated }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) newErrors.email = "Email is required"
    if (!password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setErrors({})

    try {
      const result = await authService.login({
        username: email,
        password
      })

      if (result.success) {
        // Stocker les infos utilisateur dans sessionStorage
        sessionStorage.setItem("user", JSON.stringify({
          id: result.data.user_id,
          name: result.data.full_name,
          email: result.data.email,
          role: result.data.role,
          is_approved: result.data.is_approved,
          verification_status: result.data.verification_status
        }))

        // Déterminer la redirection
        let redirectPath = searchParams.get("redirect") || "/diagnostic-tools"
        
        // Vérification pour les docteurs non approuvés
        if (result.data.role === 'doctor' && !result.data.is_approved) {
          redirectPath = "/waiting-approval"
        }

        // Redirection
        router.push(redirectPath)
        
      } else {
        // Gestion des erreurs spécifiques
        if (result.data?.error === "Account not yet approved by the administrator.") {
          router.push("/waiting-approval")
        } else if (result.data?.error === "Account is deactivated. Please contact support.") {
          setErrors({ password: "Account deactivated. Please contact support." })
        } else if (result.data?.error === "Doctor profile not found. Please contact support.") {
          setErrors({ password: "Profile not found. Please contact support." })
        } else {
          setErrors({ password: result.data?.error || "Invalid credentials" })
        }
      }
    } catch (err) {
      console.error("Login error:", err)
      setErrors({ password: "Login failed. Please check your connection." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-block p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-2 shadow-md">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
        <p className="text-sm text-gray-500">Sign in to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <User className="h-4 w-4" />
            </div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-10 bg-gray-50 border-gray-300 focus:border-blue-600 h-12 transition-all duration-300 rounded-xl ${
                errors.email ? "border-red-500 animate-shake" : ""
              } focus:ring-2 focus:ring-blue-200 focus:bg-white`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
        </div>

        <div className="space-y-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pl-10 pr-10 bg-gray-50 border-gray-300 focus:border-blue-600 h-12 transition-all duration-300 rounded-xl ${
                errors.password ? "border-red-500 animate-shake" : ""
              } focus:ring-2 focus:ring-blue-200 focus:bg-white`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
        </div>

        <div className="text-sm text-right">
          <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white h-12 transition-all duration-300 transform hover:translate-y-[-2px] shadow-md hover:shadow-lg rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing in...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              Sign In <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-500">Don&apos;t have an account? </span>
        <button
          onClick={() => setIsAnimated(true)}
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Create an account
        </button>
      </div>
    </div>
  )
}