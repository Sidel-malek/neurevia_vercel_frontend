"use client"

import React, { useEffect, useState } from "react"
import { Search, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const HeaderInside = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const [doctorName, setDoctorName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/profile/`, {
          credentials: 'include',
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) throw new Error("Failed to fetch profile")

        const data = await res.json()
        
        // Handle the nested response structure
        if (data.user && data.user.full_name) {
          setDoctorName(data.user.full_name)
        } else if (data.user && data.user.username) {
          setDoctorName(data.user.username)
        } else if (data.full_name) {
          setDoctorName(data.full_name)
        } else {
          setDoctorName("Doctor")
        }
      } catch (err) {
        console.error("Error fetching doctor profile:", err)
        setDoctorName("Doctor")
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorName()
  }, [apiUrl])

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Dr. {loading ? "..." : doctorName}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1.5 border border-gray-200 shadow-inner">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search patients..."
            className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-gray-400"
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full animate-pulse"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-gray-800 border border-gray-200">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="/profile.jpg" alt="User profile" />
                <AvatarFallback>{doctorName?.charAt(0) || "D"}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}

export default HeaderInside