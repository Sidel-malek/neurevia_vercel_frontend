import { HeartPulse, Microscope, Globe } from "lucide-react"

export const coreValues = [
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: "Patient-Centered Innovation",
    description:
      "We develop our technology with patients' needs at the forefront. Every innovation we pursue is evaluated based on its potential to improve patient outcomes and quality of life.",
    bgColor: "bg-blue-100",
    delay: "200ms",
  },
  {
    icon: <Microscope className="h-8 w-8 text-green-600" />,
    title: "Scientific Rigor",
    description:
      "We adhere to the highest standards of scientific methodology in our research and development. Our AI models undergo rigorous testing and validation before implementation in clinical settings.",
    bgColor: "bg-green-100",
    delay: "400ms",
  },
  {
    icon: <Globe className="h-8 w-8 text-purple-600" />,
    title: "Global Accessibility",
    description:
      "We're committed to making our technology accessible to healthcare providers worldwide, including in underserved regions where advanced diagnostic tools are often unavailable.",
    bgColor: "bg-purple-100",
    delay: "600ms",
  },
]
