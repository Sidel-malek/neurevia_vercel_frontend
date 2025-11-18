"use client"

import React from "react"
import PricingSwitcher from "@/components/pricingComponents/PricingSwitcher"
import { motion } from "framer-motion"

export default function PricingPage() {
  return (
    <div className="relative min-h-screen text-slate-100">
      <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-blue-50 to-white z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto p-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-4 mt-8">
                Plan & Pricing
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                We offer different options to meet your needs. Start for free or choose a plan that suits you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <PricingSwitcher diseaseType={null}/>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <p className="text-slate-500 dark:text-slate-400">
            Do you have any questions?{" "}
            <a href="#" className="text-violet-600 hover:underline">
              Contact our team
            </a>
          </p>
        </motion.div>
      </div>
      </div>

  )
}