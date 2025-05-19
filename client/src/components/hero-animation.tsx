"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import React from "react"

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle system
    const particles: Particle[] = []
    const connections: Connection[] = []

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = (Math.random() * canvas!.width) / window.devicePixelRatio
        this.y = (Math.random() * canvas!.height) / window.devicePixelRatio
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `hsl(${Math.random() * 60 + 210}, 100%, 70%)`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0 || this.x > canvas!.width / window.devicePixelRatio) this.speedX *= -1
        if (this.y < 0 || this.y > canvas!.height / window.devicePixelRatio) this.speedY *= -1
      }

      draw() {
        ctx!.fillStyle = this.color
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    class Connection {
      p1: Particle
      p2: Particle
      distance: number
      maxDistance: number

      constructor(p1: Particle, p2: Particle) {
        this.p1 = p1
        this.p2 = p2
        this.distance = 0
        this.maxDistance = 100
      }

      update() {
        const dx = this.p1.x - this.p2.x
        const dy = this.p1.y - this.p2.y
        this.distance = Math.sqrt(dx * dx + dy * dy)
      }

      draw() {
        if (!ctx) return;
        if (this.distance < this.maxDistance) {
          const opacity = 1 - this.distance / this.maxDistance
          ctx.strokeStyle = `rgba(100, 149, 237, ${opacity * 0.5})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(this.p1.x, this.p1.y)
          ctx.lineTo(this.p2.x, this.p2.y)
          ctx.stroke()
        }
      }
    }

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle())
    }

    // Create connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        connections.push(new Connection(particles[i], particles[j]))
      }
    }

    // Code editor elements
    const editorWidth = (canvas.width / window.devicePixelRatio) * 0.8
    const editorHeight = (canvas.height / window.devicePixelRatio) * 0.7
    const editorX = (canvas.width / window.devicePixelRatio - editorWidth) / 2
    const editorY = (canvas.height / window.devicePixelRatio - editorHeight) / 2

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      // Draw code editor
      ctx.fillStyle = "rgba(30, 41, 59, 0.7)"
      ctx.strokeStyle = "rgba(100, 149, 237, 0.5)"
      ctx.lineWidth = 2
      ctx.beginPath()
      // Use roundRect with fallback for browsers that don't support it
      if (ctx.roundRect) {
        ctx.roundRect(editorX, editorY, editorWidth, editorHeight, 10)
      } else {
        // Fallback for browsers that don't support roundRect
        ctx.rect(editorX, editorY, editorWidth, editorHeight)
      }
      ctx.fill()
      ctx.stroke()

      // Draw editor header
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)"
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(editorX, editorY, editorWidth, 30, [10, 10, 0, 0])
      } else {
        ctx.rect(editorX, editorY, editorWidth, 30)
      }
      ctx.fill()

      // Draw window controls
      ctx.fillStyle = "#ff5f56"
      ctx.beginPath()
      ctx.arc(editorX + 15, editorY + 15, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#ffbd2e"
      ctx.beginPath()
      ctx.arc(editorX + 35, editorY + 15, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#27c93f"
      ctx.beginPath()
      ctx.arc(editorX + 55, editorY + 15, 5, 0, Math.PI * 2)
      ctx.fill()

      // Draw code lines
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.font = "12px monospace"

      const lines = [
        "function createCollaborationRoom() {",
        "  const roomId = generateUniqueId();",
        "  const users = [];",
        "",
        "  return {",
        "    addUser: (user) => {",
        "      users.push(user);",
        "      notifyAll(`${user.name} joined`);",
        "    },",
        "    removeUser: (userId) => {",
        "      const index = users.findIndex(u => u.id === userId);",
        "      if (index !== -1) {",
        "        const user = users[index];",
        "        users.splice(index, 1);",
        "        notifyAll(`${user.name} left`);",
        "      }",
        "    },",
        "    getUsers: () => [...users]",
        "  };",
        "}",
      ]

      lines.forEach((line, index) => {
        ctx.fillText(line, editorX + 20, editorY + 50 + index * 18)
      })

      // Draw cursor
      const now = Date.now()
      if (Math.floor(now / 500) % 2 === 0) {
        ctx.fillStyle = "rgba(100, 149, 237, 0.8)"
        ctx.fillRect(editorX + 20 + 8 * 10, editorY + 50 + 7 * 18 - 12, 2, 16)
      }

      // Draw user indicators
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)"
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(editorX + editorWidth - 150, editorY + 50, 130, 80, 5)
      } else {
        ctx.rect(editorX + editorWidth - 150, editorY + 50, 130, 80)
      }
      ctx.fill()

      ctx.fillStyle = "#27c93f"
      ctx.beginPath()
      ctx.arc(editorX + editorWidth - 135, editorY + 70, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.font = "12px sans-serif"
      ctx.fillText("Alice (typing...)", editorX + editorWidth - 125, editorY + 74)

      ctx.fillStyle = "#27c93f"
      ctx.beginPath()
      ctx.arc(editorX + editorWidth - 135, editorY + 95, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fillText("Bob (online)", editorX + editorWidth - 125, editorY + 99)

      // Update and draw particles and connections
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      connections.forEach((connection) => {
        connection.update()
        connection.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-xl"
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ background: "rgba(15, 23, 42, 0.1)" }} />
    </motion.div>
  )
}