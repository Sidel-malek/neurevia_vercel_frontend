"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  value?: number
  color?: "red" | "orange" | "green"
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, color = "green", ...props }, ref) => {
  const indicatorColor =
    color === "red"
      ? "bg-red-500"
      : color === "orange"
      ? "bg-yellow-500"
      : "bg-green-500"

  const backgroundColor =
    color === "red"
      ? "bg-red-200"
      : color === "orange"
      ? "bg-yellow-200"
      : "bg-green-200"

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        backgroundColor,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all",
          indicatorColor
        )}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
