import React from "react"
import { cn } from "@/lib/utils"

interface ProgressCustomProps {
  value: number
  max?: number
  className?: string
  indicatorClassName?: string
  showLabel?: boolean
}

const ProgressCustom = ({
  value,
  max = 100,
  className,
  indicatorClassName,
  showLabel = false
}: ProgressCustomProps) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn(
            "h-full transition-all duration-300",
            indicatorClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressCustom