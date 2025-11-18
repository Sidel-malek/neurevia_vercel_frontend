// components/sections/PublicationSection.tsx
"use client"

import React from "react"
import useScrollAnimation from "@/hook/useScrollAnimation"
import { FileText } from "lucide-react"
import { Publication } from "@/types"
import { Button } from "@/components/ui/button"

interface PublicationSectionProps {
  publications: Publication[]
}

export default function PublicationSection({
  publications,
}: PublicationSectionProps) {
  // Hook gives us a ref to attach and a boolean that toggles on/in view
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()

  return (
    <section
      ref={ref}
      id="research"
      className="py-16 bg-white"
    >
      <div className="container mx-auto">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Research &amp; Publications
          </h2>
          <p className="text-gray-700">
            Our team actively contributes to the scientific community through peer-reviewed
            publications and conference presentations. Here are some of our recent research papers:
          </p>
        </div>

        {/* Publication Cards */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {publications.map((pub, idx) => (
            <div
              key={idx}
              className={`bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              <div className="flex gap-4 items-start">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{pub.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">
                    {pub.journal} • {pub.year}
                  </p>
                  <p className="text-gray-700 text-sm">{pub.authors}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div
          className={`text-center mt-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <Button variant="outline">View All Publications</Button>
        </div>
      </div>
    </section>
  )
}
