"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ArrowRight, ArrowLeft, Check, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface RegisterFormProps {
  setIsAnimated: (value: boolean) => void
}

type Step = "personal" | "profession" | "verification" | "success"

export default function RegisterForm({ setIsAnimated }: RegisterFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>("personal")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    address: "",
    gender: "",
    role: "doctor",
    speciality: "",
    grade: "",
    numero_ordre: "",
    experience: "",
    hopital: "",
    documents:[] ,
    agreeToTerms: false,
  })

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [documents, setDocuments] = useState<{file: File | null; doc_type: string}[]>([
    { file: null, doc_type: "" }
  ]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateStep = (currentStep: Step) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === "personal") {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required"
      } else if (!/^[a-zA-ZÀ-ÿ\- ]+$/.test(formData.firstName)) {
        newErrors.firstName = "First name must contain only letters"
      }
      
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required"
      } else if (!/^[a-zA-ZÀ-ÿ\- ]+$/.test(formData.lastName)) {
        newErrors.lastName = "Last name must contain only letters"
      }
      
      if (!formData.email) {
        newErrors.email = "Email is required"
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }

      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }

      if (!formData.phone) {
        newErrors.phone = "Phone number is required"
      } else if (!/^\+?[0-9]{7,15}$/.test(formData.phone)) {
        newErrors.phone = "Phone number is invalid"
      }

      if (!formData.address) newErrors.address = "Address is required"
      if (!formData.gender) newErrors.gender = "Gender is required"
      if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"
    }

    if (currentStep === "profession") {
      if (!formData.speciality) newErrors.speciality = "Please select your speciality"
      if (!formData.grade) newErrors.grade = "Grade is required"
      if (!formData.numero_ordre) newErrors.numero_ordre = "Numero d'ordre is required"
      if (!formData.experience) newErrors.experience = "Experience is required"
      if (!formData.hopital) newErrors.hopital = "Hospital is required"
    }

    if (currentStep === "verification") {
      if (documents.length === 0 || documents.some(doc => !doc.file || !doc.doc_type)) {
        newErrors.documents = "Please upload at least one document with a type"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep("verification")) return

    setIsSubmitting(true)

    const formDataToSend = new FormData()
    formDataToSend.append("first_name", formData.firstName)
    formDataToSend.append("last_name", formData.lastName)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("password", formData.password)
    formDataToSend.append("confirmPassword", formData.confirmPassword)
    formDataToSend.append("phone", formData.phone)
    formDataToSend.append("date_of_birth", formData.dob)
    formDataToSend.append("address", formData.address)
    formDataToSend.append("gender", formData.gender)
    formDataToSend.append("role", formData.role)

    // DoctorProfile fields
    formDataToSend.append("speciality", formData.speciality)
    formDataToSend.append("grade", formData.grade)
    formDataToSend.append("numero_ordre", formData.numero_ordre)
    formDataToSend.append("experience", formData.experience)
    formDataToSend.append("hopital", formData.hopital)
    // In your handleSubmit function, add these lines:

    // Append documents - FIXED: Ensure files are properly appended
  documents.forEach((doc, index) => {
    if (doc.doc_type){
      formDataToSend.append(`documents.${index}.doc_type`, doc.doc_type);
    }
    if (doc.file) {
      formDataToSend.append(`documents.${index}.document`, doc.file);
    }
  
  });




    // Log FormData contents for debugging
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value)
    }

    try {
      const res = await fetch(`${apiUrl}/api/register/`, {
        method: "POST",
        body: formDataToSend,
        // Don't set Content-Type header - browser will set it with correct boundary
      })

      if (res.ok) {
        setStep("success")
      } else {
        const text = await res.text()
        try {
          const json = JSON.parse(text)
          alert(json.detail || JSON.stringify(json))
        } catch {
          console.log("Response is not valid JSON")
          alert(`Server error (${res.status}). Please try again later.`)
        }
      }
    } catch (err) {
      console.error("Fetch failed:", err)
      alert("Failed to submit form. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (step === "personal" && validateStep("personal")) {
      setStep("profession")
    } else if (step === "profession" && validateStep("profession")) {
      setStep("verification")
    }
  }

  const prevStep = () => {
    if (step === "profession") setStep("personal")
    else if (step === "verification") setStep("profession")
  }

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setDocuments((prev) => {
        const copy = [...prev]
        copy[index] = { ...copy[index], file }
        return copy
      })
    }
  }

  const handleDocTypeChange = (index: number, value: string) => {
    setDocuments((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], doc_type: value }
      return copy
    })
  }

  const addNewDocument = () => {
    setDocuments((prev) => [...prev, { file: null, doc_type: "" }])
  }

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const getStepProgress = () => {
    if (step === "personal") return 33
    if (step === "profession") return 66
    if (step === "verification") return 100
    return 100
  }

 if (step === "success") {
  // On success
  router.push("/registration-success")
  }

 return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-block p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-2 shadow-md">
          <Check className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Account</h1>
        <p className="text-sm text-gray-500">Join our medical platform</p>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-out"
            style={{ width: `${getStepProgress()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span className={step === "personal" ? "text-blue-600 font-medium" : "text-gray-500"}>Personal</span>
          <span className={step === "profession" ? "text-blue-600 font-medium" : "text-gray-500"}>Profession</span>
          <span className={step === "verification" ? "text-blue-600 font-medium" : "text-gray-500"}>Verification</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === "personal" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First name
                </label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className={`bg-gray-50 text-black border-gray-300 h-12 transition-all rounded-xl ${
                    errors.firstName ? "border-red-500 animate-shake" : ""
                  } focus:ring-2 focus:ring-blue-200 focus:bg-white focus:border-blue-600`}
                />
                {errors.firstName && <p className="text-xs text-red-500 ml-1">{errors.firstName}</p>}
              </div>
              <div className="space-y-1">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last name
                </label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className={`bg-gray-50 text-black border-gray-300 h-12 transition-all rounded-xl ${
                    errors.lastName ? "border-red-500 animate-shake" : ""
                  } focus:ring-2 focus:ring-blue-200 focus:bg-white focus:border-blue-600`}
                />
                {errors.lastName && <p className="text-xs text-red-500 ml-1">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className={`bg-gray-100 text-black border-gray-300 h-12 transition-all ${
                  errors.email ? "border-red-500 animate-shake" : ""
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min. 8 characters)"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className={`bg-gray-100 text-black border-gray-300 h-12 transition-all pr-10 ${
                    errors.password ? "border-red-500 animate-shake" : ""
                  }`}
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

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className={`bg-gray-100 text-black border-gray-300 h-12 transition-all pr-10 ${
                    errors.confirmPassword ? "border-red-500 animate-shake" : ""
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 ml-1">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                className={`bg-gray-100 text-black border-gray-300 h-12 transition-all ${
                  errors.phone ? "border-red-500 animate-shake" : ""
                }`}
              />
              {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="dob" className="text-sm font-medium text-gray-700">
                Birthdate
              </label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => updateFormData("dob", e.target.value)}
                className="bg-gray-100 text-black border-gray-300 h-12 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address
              </label>
              <Input
                id="address"
                placeholder="Your address"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                className={`bg-gray-100 text-black border-gray-300 h-12 transition-all ${
                  errors.address ? "border-red-500 animate-shake" : ""
                }`}
              />
              {errors.address && <p className="text-xs text-red-500 ml-1">{errors.address}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => updateFormData("gender", e.target.value)}
                className={`w-full h-12 pl-3 pr-10 py-2 bg-gray-100 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                  errors.gender ? "border-red-500 animate-shake" : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="text-xs text-red-500 ml-1">{errors.gender}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => updateFormData("agreeToTerms", checked === true)}
                className={errors.agreeToTerms ? "border-red-500" : ""}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions
              </Label>
            </div>
            {errors.agreeToTerms && <p className="text-xs text-red-500 ml-1">{errors.agreeToTerms}</p>}

            <Button
              type="button"
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white h-12 transition-all duration-300 transform hover:translate-y-[-2px] shadow-md hover:shadow-lg rounded-xl"
            >
              <div className="flex items-center justify-center">
                Continue <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          </div>
        )}

        {step === "profession" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="speciality" className="text-sm font-medium">
                  What is your speciality?
                </Label>
                <select
                  id="speciality"
                  value={formData.speciality}
                  onChange={(e) => updateFormData("speciality", e.target.value)}
                  className={`w-full h-12 pl-3 pr-10 py-2 bg-gray-100 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                    errors.speciality ? "border-red-500 animate-shake" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled>
                    Select your speciality
                  </option>
                  <option value="neurologist">Neurologist</option>
                  <option value="radiologist">Radiologist</option>
                  <option value="cardiologist">Cardiologist</option>
                  <option value="pediatrician">Pediatrician</option>
                  <option value="surgeon">Surgeon</option>
                  <option value="psychiatrist">Psychiatrist</option>
                  <option value="dermatologist">Dermatologist</option>
                  <option value="other">Other Medical Professional</option>
                </select>
                {errors.speciality && <p className="text-xs text-red-500 ml-1">{errors.speciality}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="grade" className="text-sm font-medium">
                  Grade
                </Label>
                <Input
                  id="grade"
                  placeholder="Your medical grade"
                  value={formData.grade}
                  onChange={(e) => updateFormData("grade", e.target.value)}
                  className={`bg-gray-100 text-black border-gray-300 h-12 transition-all ${
                    errors.grade ? "border-red-500 animate-shake" : ""
                  }`}
                />
                {errors.grade && <p className="text-xs text-red-500 ml-1">{errors.grade}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="numero_ordre" className="text-sm font-medium">
                  Numero d&apos;Ordre
                </Label>
                <Input
                  id="numero_ordre"
                  placeholder="Your medical order number"
                  value={formData.numero_ordre}
                  onChange={(e) => updateFormData("numero_ordre", e.target.value)}
                  className={`bg-gray-100 text-black border-gray-300 h-12 transition-all ${
                    errors.numero_ordre ? "border-red-500 animate-shake" : ""
                  }`}
                />
                {errors.numero_ordre && <p className="text-xs text-red-500 ml-1">{errors.numero_ordre}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="experience" className="text-sm font-medium">
                  Years of Experience
                </Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="Years of experience"
                  value={formData.experience}
                  onChange={(e) => updateFormData("experience", e.target.value)}
                  className={`bg-gray-100 text-black border-gray-300 h-12 transition-all ${
                    errors.experience ? "border-red-500 animate-shake" : ""
                  }`}
                />
                {errors.experience && <p className="text-xs text-red-500 ml-1">{errors.experience}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="hopital" className="text-sm font-medium">
                  Hospital/Institution
                </Label>
                <Input
                  id="hopital"
                  placeholder="Your hospital or medical institution"
                  value={formData.hopital}
                  onChange={(e) => updateFormData("hopital", e.target.value)}
                  className={`bg-gray-100 text-black border-gray-300 h-12 transition-all ${
                    errors.hopital ? "border-red-500 animate-shake" : ""
                  }`}
                />
                {errors.hopital && <p className="text-xs text-red-500 ml-1">{errors.hopital}</p>}
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-8">
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 h-12 transition-all bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-12 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "verification" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center font-medium">Supporting documents</div>
            <p className="text-sm text-gray-500 text-center">Upload your professional documents for verification</p>

            {documents.map((doc, index) => (
              <div
                key={index}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4 relative"
              >
                {documents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Type</label>
                  <select
                    className="w-full border p-2 rounded-md"
                    value={doc.doc_type}
                    onChange={(e) => handleDocTypeChange(index, e.target.value)}
                  >
                    <option value="">Select document type</option>
                    <option value="diploma">Diploma</option>
                    <option value="license">Medical License</option>
                    <option value="certificate">Certificate</option>
                    <option value="id_proof">ID Proof</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload File</label>
                  <input
                    type="file"
                    id={`document-upload-${index}`}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(index, e)}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-white"
                      onClick={() => document.getElementById(`document-upload-${index}`)?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Choose File
                    </Button>
                    {doc.file && (
                      <span className="text-sm text-green-600">{doc.file.name}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={addNewDocument}
              variant="outline"
              className="w-full border-dashed"
            >
              + Add another document
            </Button>

            {errors.documents && <p className="text-xs text-red-500 ml-1">{errors.documents}</p>}

            <div className="flex justify-between gap-4 mt-8">
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 h-12 transition-all bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-12 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </div>
        )}
      </form>

      {step === "personal" && (
        <div className="text-center text-sm">
          <span className="text-gray-500">Already have an account? </span>
          <button
            onClick={() => setIsAnimated(false)}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  )
}