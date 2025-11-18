// hook/useAnimateWhenVisible.tsx
"use client"

import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef } from "react"

type AnimateWhenVisibleProps = {
  children: React.ReactNode
  className?: string
  variants?: any
}

const AnimateWhenVisible = ({ children, className, variants }: AnimateWhenVisibleProps) => {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.2 }) // Re-triggers every time it enters 20% in viewport
  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [inView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default AnimateWhenVisible
