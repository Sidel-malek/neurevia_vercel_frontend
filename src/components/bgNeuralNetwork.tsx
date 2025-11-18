'use client'
import { useRef, useEffect } from "react"

const BgNeuralNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Neural network background effect with improved colors and density
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const connections: Connection[] = []
    const particleCount = 100 // Increased particle count

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      pulseSpeed: number
      pulseSize: number
      originalSize: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.originalSize = Math.random() * 2 + 1
        this.size = this.originalSize
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3

        // More vibrant colors with cyan, purple, and blue tones
        const colorOptions = [
          `rgba(0, 200, 255, ${Math.random() * 0.5 + 0.3})`, // Cyan
          `rgba(120, 87, 255, ${Math.random() * 0.5 + 0.3})`, // Purple
          `rgba(0, 128, 255, ${Math.random() * 0.5 + 0.3})`, // Blue
          `rgba(0, 255, 200, ${Math.random() * 0.5 + 0.3})`, // Teal
        ]
        this.color = colorOptions[Math.floor(Math.random() * colorOptions.length)]

        // Add pulsing effect
        this.pulseSpeed = Math.random() * 0.05 + 0.01
        this.pulseSize = 0
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Pulsing effect
        this.pulseSize += this.pulseSpeed
        this.size = this.originalSize + Math.sin(this.pulseSize) * 0.5

        if (this.x > canvas!.width) this.x = 0
        if (this.x < 0) this.x = canvas!.width
        if (this.y > canvas!.height) this.y = 0
        if (this.y < 0) this.y = canvas!.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        // Add glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color
      }
    }

    class Connection {
      particle1: Particle
      particle2: Particle
      distance: number
      color: string
      maxDistance: number

      constructor(particle1: Particle, particle2: Particle) {
        this.particle1 = particle1
        this.particle2 = particle2
        this.distance = Math.sqrt(Math.pow(particle1.x - particle2.x, 2) + Math.pow(particle1.y - particle2.y, 2))
        this.color = `rgba(0, 200, 255, ${Math.max(0, 0.8 - this.distance / 200)})`
        this.maxDistance = 180 // Increased connection distance
      }

      update() {
        this.distance = Math.sqrt(
          Math.pow(this.particle1.x - this.particle2.x, 2) + Math.pow(this.particle1.y - this.particle2.y, 2),
        )

        // More vibrant connections
        const opacity = Math.max(0, 0.3 - this.distance / 300)
        const hue = (Date.now() / 50) % 360 // Subtle color cycling
        this.color = `hsla(${hue}, 100%, 70%, ${opacity})`
      }

      draw() {
        if (!ctx) return
        if (this.distance < this.maxDistance) {
          ctx.strokeStyle = this.color
          ctx.lineWidth = 0.8 // Slightly thicker lines
          ctx.beginPath()
          ctx.moveTo(this.particle1.x, this.particle1.y)
          ctx.lineTo(this.particle2.x, this.particle2.y)
          ctx.stroke()
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Create connections between particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        connections.push(new Connection(particles[i], particles[j]))
      }
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Reset shadow for better performance
      ctx.shadowBlur = 0

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      for (const connection of connections) {
        connection.update()
        connection.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" /> 

  )
}

export default BgNeuralNetwork
