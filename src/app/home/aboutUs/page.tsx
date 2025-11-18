"use client"

import { useState, useEffect } from "react"

import HeroSection from "@/components/aboutUsComponents/heroSection"
import MissionSection from "@/components/aboutUsComponents/missionSection"
import StatsSection from "@/components/aboutUsComponents/stateSection"
import StorySection from "@/components/aboutUsComponents/StorySection"
import TeamSection from "@/components/aboutUsComponents/TeamSection"
import ValuesSection from "@/components/aboutUsComponents/ValuesSection"
import PartnersSection from "@/components/aboutUsComponents/PartnersSection"
import CTASection from "@/components/aboutUsComponents/CTASection"
import NeurolAnimation from "@/hook/NeurolAnimation"

export default function AboutPage() {
  // Animation on scroll
  const [isVisible, setIsVisible] = useState({
    mission: false,
    story: false,
    team: false,
    values: false,
    research: false,
    partners: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["mission", "story", "team", "values", "research", "partners"]
      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.75) {
            setIsVisible((prev) => ({ ...prev, [section]: true }))
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  
  
  // Partner institutions
  const partners = [
    "Mayo Clinic",
    "Johns Hopkins Hospital",
    "Stanford Medical Center",
    "Massachusetts General Hospital",
    "Cleveland Clinic",
    "UCSF Medical Center",
    "Mount Sinai Hospital",
    "Duke University Hospital",
  ]

  return (
    <div className="flex min-h-screen flex-col ">     
      <main className="flex-1 ">
        {/* Hero Section */}
        <HeroSection />

        {/* Mission Section */}
        <MissionSection isVisible={isVisible} />

        {/* Stats Section */}

        <StatsSection  />

        {/* Our Story Section */}
        <StorySection  />       
        
        {/* Our Team */}
        <TeamSection/>


        {/* Our Values */}
        <ValuesSection  />
       

        {/* Partners & Collaborators */}
        <PartnersSection />


        {/* CTA Section */}
        <CTASection/>
      </main>

    </div>
  )
}
