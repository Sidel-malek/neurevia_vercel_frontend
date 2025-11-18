"use client"

import useScrollAnimation from "@/hook/useScrollAnimation"

export default function MissionSection({ isVisible }: { isVisible: any }) {
  const { ref, isVisible: animationVisible } = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="mission" className="py-16 bg-white">
      <div className="container mx-auto">
        <div
          ref={ref}
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            animationVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-8">
            At NeurerIA, we believe early detection is the key to better outcomes for neurodegenerative diseases.
            Our mission is to leverage cutting-edge AI technology to provide healthcare professionals with powerful
            tools that can identify subtle signs of cognitive decline—empowering them to act sooner, and make informed decisions.
          </p>
        </div>
      </div>
    </section>
  )
}
