"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Brain, CheckCircle, FileText, Users, Zap } from "lucide-react"

const ServicesSection = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  const services = [
    {
      id: 1,
      icon: <Brain className="h-6 w-6" />,
      title: "Brain MRI and Biomarkers Analysis",
      description: "Advanced analysis of brain MRI scans and biomarkers to detect early signs of neurodegeneration.",
      color: "from-blue-500 to-indigo-600",
      lightColor: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverColor: "group-hover:bg-blue-600",
      stats: "98% accuracy",
    },
    {
      id: 2,
      icon: <Zap className="h-6 w-6" />,
      title: "Early Detection Accuracy",
      description:
        "Our AI models provide up to 95% accuracy in early detection, years before clinical symptoms appear.",
      color: "from-purple-500 to-pink-600",
      lightColor: "bg-purple-50",
      iconColor: "text-purple-600",
      hoverColor: "group-hover:bg-purple-600",
      stats: "5+ years earlier",
    },
    {
      id: 3,
      icon: <FileText className="h-6 w-6" />,
      title: "Doctor-Friendly Reports",
      description:
        "Automatically generated, clear, and visual reports to support doctors in making faster and more informed decisions.",
      color: "from-emerald-500 to-teal-600",
      lightColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      hoverColor: "group-hover:bg-emerald-600",
      stats: "60% faster diagnosis",
    },
    {
      id: 4,
      icon: <Users className="h-6 w-6" />,
      title: "Clinician Support Platform",
      description:
        "A user-friendly interface designed to integrate seamlessly into the workflow of clinics and hospitals.",
      color: "from-amber-500 to-orange-600",
      lightColor: "bg-amber-50",
      iconColor: "text-amber-600",
      hoverColor: "group-hover:bg-amber-600",
      stats: "1000+ clinics",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-50 opacity-70 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-50 opacity-70 blur-3xl"></div>

      {/* Neural network background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-net" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="#000" />
              <circle cx="0" cy="0" r="1" fill="#000" />
              <circle cx="0" cy="100" r="1" fill="#000" />
              <circle cx="100" cy="0" r="1" fill="#000" />
              <circle cx="100" cy="100" r="1" fill="#000" />
              <line x1="50" y1="50" x2="0" y2="0" stroke="#000" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="100" y2="0" stroke="#000" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="0" y2="100" stroke="#000" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="100" y2="100" stroke="#000" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-net)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
            className="inline-flex items-center justify-center mb-3"
          >
            <span className="h-px w-6 bg-blue-600"></span>
            <span className="mx-3 text-blue-600 font-medium text-sm uppercase tracking-wider">What We Offer</span>
            <span className="h-px w-6 bg-blue-600"></span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900"
          >
            Our Services
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Providing cutting-edge neural network technology to healthcare professionals for early detection of
            neurodegenerative diseases.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative group"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className="bg-white rounded-2xl shadow-lg transition-all duration-300 transform group-hover:-translate-y-2 overflow-hidden h-full border border-gray-100 flex flex-col">
                <div className="p-6">
                  <div
                    className={`w-14 h-14 ${service.lightColor} rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${service.hoverColor}`}
                  >
                    <div className={`${service.iconColor} group-hover:text-white transition-colors duration-300`}>
                      {service.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                  <div className="flex items-center text-sm font-medium">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-gray-700">{service.stats}</span>
                  </div>
                </div>

                {/* Bottom gradient bar */}
                <div
                  className={`mt-auto h-1 w-full bg-gradient-to-r ${service.color} transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100 end-0 `}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
