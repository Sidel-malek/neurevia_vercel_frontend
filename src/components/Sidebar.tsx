// Sidebar.tsx
"use client"
import React from 'react'
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import LogoutButton from "@/components/ui/logout-button"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import {
  Brain,
  Command,
  LineChart,
  Settings,
  Users,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import Image from "next/image"

const Sidebar = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const pathname = usePathname()
  const router = useRouter()

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Détermine l'élément actif en fonction du chemin
 

  return (
    <div className='max-h-screen sticky top-0'>
      {/* Sidebar  */}
      <div className="w-64  bg-slate-950/90 border-r border-cyan-900/30 p-4 flex flex-col backdrop-blur-md h-screen">
        <div className="flex items-center mt-2 space-x-4 mb-10 ms-3">
          <div className="relative h-12 w-12">
            <Image
              src="/images/neurevia__.png" 
              alt="Brain illustration"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            NeurevIA
          </span>
          
        </div>  
                    
        
        <nav className="space-y-1.5 flex-1">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className={`w-full justify-start hover:text-cyan-400 hover:bg-slate-900/50 group transition-colors ${
                pathname === '/dashboard' 
                  ? 'text-cyan-400 bg-slate-900/50 border-l-2 border-cyan-400' 
                  : 'text-slate-400'
              }`}
            >
              <Command className={`mr-2 h-4 w-4 transition-colors ${
                pathname === '/dashboard' 
                  ? 'text-cyan-500' 
                  : 'group-hover:text-cyan-500'
              }`} />
              <span>Dashboard</span>
            </Button>
          </Link>

          <Link href="/diagnostic-tools">
            <Button
              variant="ghost"
              className={`w-full justify-start hover:text-cyan-400 hover:bg-slate-900/50 group transition-colors ${
                pathname === '/diagnostic-tools' || pathname === '/diagnosis/alzheimer' || pathname === '/results/alzheimer' || pathname === '/diagnosis/parkinson' || pathname === '/results/parkinson' || pathname === '/results/alzheimer/biomarker-result' || pathname === '/results/alzheimer/mri-result'  
                  ? 'text-cyan-400 bg-slate-900/50 border-l-2 border-cyan-400' 
                  : 'text-slate-400'
              }`}
            >
              <Users className={`mr-2 h-4 w-4 transition-colors ${
                pathname === '/diagnostic-tools' || pathname === '/diagnosis/alzheimer' || pathname === '/results/alzheimer' || pathname === '/diagnosis/parkinson' || pathname === '/results/parkinson' || pathname === '/results/alzheimer/biomarker-result'  ||pathname === '/results/alzheimer/mri-result' 
                  ? 'text-cyan-500' 
                  : 'group-hover:text-cyan-500'
              }`} />
              <span>Diagnostic Tools</span>
            </Button>
          </Link>



          <Link href="/patients">
            <Button
              variant="ghost"
              className={`w-full justify-start hover:text-cyan-400 hover:bg-slate-900/50 group transition-colors ${
                pathname === '/patients' 
                  ? 'text-cyan-400 bg-slate-900/50 border-l-2 border-cyan-400' 
                  : 'text-slate-400'
              }`}
            >
              <LineChart className={`mr-2 h-4 w-4 transition-colors ${
                pathname === '/patient-records' 
                  ? 'text-cyan-500' 
                  : 'group-hover:text-cyan-500'
              }`} />
              <span>Patient Records</span>
            </Button>
          </Link>

          <Link href="/settings">
            <Button
              variant="ghost"
              className={`w-full justify-start hover:text-cyan-400 hover:bg-slate-900/50 group transition-colors ${
                pathname === '/settings' 
                  ? 'text-cyan-400 bg-slate-900/50 border-l-2 border-cyan-400' 
                  : 'text-slate-400'
              }`}
            >
              <Settings className={`mr-2 h-4 w-4 transition-colors ${
                pathname === '/settings' 
                  ? 'text-cyan-500' 
                  : 'group-hover:text-cyan-500'
              }`} />
              <span>Settings</span>
            </Button>
          </Link>
        </nav>

        {/* Bouton de déconnexion */}
        <div className="mt-auto pt-4 border-t border-slate-800/50">
          <LogoutButton/>
        </div>
      </div>
    </div>
  )
}

export default Sidebar