import type React from "react"
import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <div className="hidden flex-1 bg-teal-500 md:block relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/brain-network.png"
            alt="Neural network brain"
            width={1000}
            height={1000}
            className="max-w-full max-h-full object-contain opacity-80"
            priority
          />
        </div>
      </div>
    </div>
  )
}
