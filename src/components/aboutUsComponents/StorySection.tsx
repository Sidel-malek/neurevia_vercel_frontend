'use client'

import Image from "next/image"
import useScrollAnimation from "@/hook/useScrollAnimation"

export default function StorySection() {
  // useScrollAnimation for animating visibility on scroll
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()

  return (
    <section
      id="story"
      ref={ref}
      className="py-16 bg-white"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-48 items-center">
          {/* Text content */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
            Founded in 2026 by Sid el Mrabet Malek Aya and Wafaa Bekkhoucha Fatima Zohra, under the mentorship of Professor Rabab Bousmaha at the École Supérieure d’Informatique de Sidi Bel Abbès (ESI SBA), Neurevia was created to solve the challenge of early detection of neurodegenerative diseases.
            </p>
            <p className="text-gray-700 mb-4">
            Operating under Algeria’s legal framework (Ministerial Resolution 1273), Neurevia combines MRI scans and biological biomarkers with advanced deep-learning techniques for high-accuracy detection of Alzheimer’s and Parkinson’s at their earliest stages.
            </p>
            <p className="text-gray-700 mb-4">
            With support from the ESI SBA incubator, the team has refined their platform and achieved significant milestones, including pilot studies and seed funding. Today, Neurevia is preparing for wider clinical trials, aiming to improve early diagnosis and patient care.
            </p>
            
          </div>

          {/* Image content */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <div className="relative h-[400px] max-w-xl rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/ourStory.jpg"
                alt="NeurerIA team working"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
