"use client";

import { useEffect, useRef , useState } from "react";

interface NeuralNetworkBackgroundProps {
  opacity?: number;
  particleCount?: number;
  connectionDistance?: number;
  particleColors?: string[];
  className?: string;
}

export default function NeuralNetworkBackground({
  opacity = 0.2,
  particleCount = 80,
  connectionDistance = 150,
  particleColors = [
    "rgba(99, 102, 241, 0.4)",
    "rgba(139, 92, 246, 0.3)",
    "rgba(59, 130, 246, 0.4)",
  ],
  className = "",
}: NeuralNetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light")


  const handleThemeChange = (newTheme: "dark" | "light") => {
   
      setCurrentTheme(newTheme)
  
  }
 // Neural network background effect
useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  const particles: Particle[] = []
  const connections: Connection[] = []
  const particleCount = 80

  class Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    color: string

    constructor(canvas: HTMLCanvasElement) { // ✓ Ajoutez canvas en paramètre
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 2 + 1
      this.speedX = (Math.random() - 0.5) * 0.3
      this.speedY = (Math.random() - 0.5) * 0.3
      this.color =
        currentTheme === "dark"
          ? `rgba(0, 128, 255, ${Math.random() * 0.5 + 0.2})`
          : `rgba(37, 99, 235, ${Math.random() * 0.5 + 0.2})`
    }

    update(canvas: HTMLCanvasElement) { // ✓ Ajoutez canvas en paramètre
      this.x += this.speedX
      this.y += this.speedY

      if (this.x > canvas.width) this.x = 0
      if (this.x < 0) this.x = canvas.width
      if (this.y > canvas.height) this.y = 0
      if (this.y < 0) this.y = canvas.height
    }

    draw(ctx: CanvasRenderingContext2D) { // ✓ Ajoutez ctx en paramètre
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  class Connection {
    particle1: Particle
    particle2: Particle
    distance: number
    color: string

    constructor(particle1: Particle, particle2: Particle) {
      this.particle1 = particle1
      this.particle2 = particle2
      this.distance = Math.sqrt(Math.pow(particle1.x - particle2.x, 2) + Math.pow(particle1.y - particle2.y, 2))
      this.color =
        currentTheme === "dark"
          ? `rgba(0, 128, 255, ${Math.max(0, 0.8 - this.distance / 200)})`
          : `rgba(37, 99, 235, ${Math.max(0, 0.8 - this.distance / 200)})`
    }

    update() {
      this.distance = Math.sqrt(
        Math.pow(this.particle1.x - this.particle2.x, 2) + Math.pow(this.particle1.y - this.particle2.y, 2),
      )
      this.color =
        currentTheme === "dark"
          ? `rgba(0, 128, 255, ${Math.max(0, 0.2 - this.distance / 300)})`
          : `rgba(37, 99, 235, ${Math.max(0, 0.2 - this.distance / 300)})`
    }

    draw(ctx: CanvasRenderingContext2D) { // ✓ Ajoutez ctx en paramètre
      if (this.distance < 150) {
        ctx.strokeStyle = this.color
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(this.particle1.x, this.particle1.y)
        ctx.lineTo(this.particle2.x, this.particle2.y)
        ctx.stroke()
      }
    }
  }

  // Créez les particules en passant le canvas
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas))
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

    for (const particle of particles) {
      particle.update(canvas) // ✓ Passez canvas
      particle.draw(ctx) // ✓ Passez ctx
    }

    for (const connection of connections) {
      connection.update()
      connection.draw(ctx) // ✓ Passez ctx
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
}, [currentTheme])
  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full bg-transparent ${className}`}
      style={{ opacity }}
    />
  );
}
