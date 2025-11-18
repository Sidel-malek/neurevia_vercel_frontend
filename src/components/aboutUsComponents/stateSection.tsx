'use client'

import { Clock, Users, Award, HeartPulse } from "lucide-react"
import useScrollAnimation from "@/hook/useScrollAnimation"

export default function StatsSection() {
  // Using useScrollAnimation to handle visibility based on scroll position
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()

  const statsData = [
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      value: "75+",
      label: "Doctors Using NeurerIA",
      delay: "200ms",
      bg: "bg-green-100",
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      value: "95%",
      label: "Detection Accuracy",
      delay: "300ms",
      bg: "bg-purple-100",
    },
    {
      icon: <HeartPulse className="h-8 w-8 text-orange-600" />,
      value: "40+",
      label: "Hospitals Using NeurerIA",
      delay: "400ms",
      bg: "bg-orange-100",
    },
  ]

  return (
    <section  className="py-12 bg-blue-50">
      <div  ref={ref} className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-lg shadow-sm text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-md ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: stat.delay }}
            >
              <div className={`${stat.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
