"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import useScrollAnimation from "@/hook/useScrollAnimation"

export default function HeroSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()

  return (
    <section className="relative pt-10  overflow-hidden">
      <div className="container relative z-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto items-center">
          <div
            ref={ref}
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-6">About NeurevIA</h1>
            <p className="text-lg text-gray-700 mb-6">
              We&apos;re a pioneering AI healthcare company at the forefront of neurodegenerative disease detection and
              monitoring.
            </p>

            <div className="flex gap-4">
              <Button className="gap-2">
                Our Services <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline">Contact Us</Button>
            </div>
          </div>
          <div
            className={`flex justify-end transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative w-96 h-96">
             {/* Animation vidéo */}
<div className="w-full h-64 md:h-80 lg:h-96 relative rounded-lg overflow-hidden">
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
    poster="/images/neurevia.png"
  >
    <source src="/video/neurevia_.mp4" type="video/mp4" />
    Votre navigateur ne supporte pas la lecture de vidéos.
  </video>
</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}