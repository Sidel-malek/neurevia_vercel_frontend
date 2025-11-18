'use client'

import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from "lucide-react"

const Comments = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      quote:
        "NeurerIA has completely transformed how we detect and monitor neurodegenerative diseases. The early detection capabilities have allowed us to intervene sooner and significantly improve patient outcomes.",
      author: "Dr. Sarah Johnson",
      title: "Chief of Neurology, San Francisco Medical Center",
    },
    {
      quote:
        "The accuracy of NeurerIA's AI models is remarkable. We've been able to identify patterns that would be impossible to detect with traditional methods.",
      author: "Dr. Michael Chen",
      title: "Neurologist, Boston Medical Research Institute",
    },
    {
      quote:
        "Implementing NeurerIA in our practice has not only improved our diagnostic capabilities but also given our patients peace of mind through earlier intervention options.",
      author: "Dr. Emily Rodriguez",
      title: "Director of Alzheimer's Research, Mayo Clinic",
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000)

    return () => clearInterval(interval)
  }, [nextTestimonial])

  return (
    <section id="testimonials" className="my-32">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          What our Doctors say about us
        </h2>

        <div className="flex items-center justify-center gap-4 max-w-5xl mx-auto">

          {/* Left Button */}
          <div className="transform transition-transform hover:scale-110 active:scale-90">
            <Button variant="outline" size="icon" className="rounded-full" onClick={prevTestimonial}>
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
          </div>

          {/* Comment Card with animated height */}
          <div className="flex-1 max-w-3xl mx-4 transition-all duration-500 ease-in-out min-h-[220px]">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <p className="italic text-muted-foreground">
                &ldquo;{testimonials[currentTestimonial].quote}&ldquo;
              </p>
              <div className="mt-4">
                <p className="font-medium">{testimonials[currentTestimonial].author}</p>
                <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].title}</p>
              </div>
            </div>
          </div>

          {/* Right Button */}
          <div className="transform transition-transform hover:scale-110 active:scale-90">
            <Button variant="outline" size="icon" className="rounded-full" onClick={nextTestimonial}>
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Comments
