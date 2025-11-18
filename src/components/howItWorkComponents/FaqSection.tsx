"use client"

import { useState } from "react";
import AnimateWhenVisible from "@/hook/useAnimateWhenVisible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const faqData = [
  {
    question: "How accurate is your AI system?",
    answer:
      "Our system has demonstrated 94% accuracy in early detection of neurodegeneration signs, outperforming conventional diagnostic methods by 35%. These results have been validated in multicenter clinical studies.",
  },
  {
    question: "How long does it take to get results?",
    answer:
      "Preliminary results are available within 15 minutes after data upload. A comprehensive and detailed report is generated in a maximum of 1 hour, depending on case complexity and data volume.",
  },
  {
    question: "Are your analyses compliant with medical regulations?",
    answer:
      "Yes, our platform is CE certified and FDA approved as a diagnostic aid tool. We comply with all HIPAA, GDPR, and other international regulations on health data privacy.",
  },
  {
    question: "How can we integrate your solution with our hospital system?",
    answer:
      "Our platform easily integrates with existing PACS, RIS, and EMR systems via secure APIs. Our technical team supports you throughout the integration process, typically completed in less than two weeks.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
      <div className="mb-20" id="faq">
      <AnimateWhenVisible variants={fadeIn} className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
          Frequently Asked Questions
        </h2>
      </AnimateWhenVisible>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqData.map((item, index) => (
          <AnimateWhenVisible key={index} variants={staggerItem}>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-md overflow-hidden">
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-slate-800 dark:text-white font-medium"
              >
                {item.question}
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4 text-slate-600 dark:text-slate-300"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimateWhenVisible>
        ))}
      </div>
    </div>
    
  );
}
