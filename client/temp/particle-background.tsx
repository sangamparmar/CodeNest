"use client"

import React from "react"
import { useEffect, useRef, useState } from "react"

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Increased particle count for more visual impact
    const particleCount = Math.min(120, Math.floor((dimensions.width * dimensions.height) / 10000))

    // Adding a bright star field effect with enhanced particles
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      type: string
      pulse: number
      pulseSpeed: number
      opacity: number
      direction: number
      moveSpeed: number
    }[] = []
    
    // Create particles with different types
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      
      // Larger particles to be more visible
      const particleType = Math.random() < 0.75 ? "normal" : Math.random() < 0.7 ? "star" : "glow"
      const size = particleType === "normal" 
        ? Math.random() * 1.5 + 0.7  // Larger normal particles
        : particleType === "star" 
          ? Math.random() * 1.8 + 0.9  // Larger stars
          : Math.random() * 2.2 + 1.2  // Larger glow particles

      // Enhanced color palette with much higher brightness and saturation
      const colorVarieties = [
        `rgba(185, 142, 255, `, // brighter vibrant violet
        `rgba(77, 218, 255, `,  // brighter vibrant cyan
        `rgba(255, 111, 190, `, // brighter vibrant pink
        `rgba(170, 120, 255, `, // brighter vibrant purple
        `rgba(79, 255, 176, `,  // brighter vibrant green
        `rgba(255, 178, 89, `,  // bright orange (new)
        `rgba(255, 102, 102, `, // bright red (new)
      ]
      
      const colorBase = Math.random() < 0.85
        ? colorVarieties[Math.floor(Math.random() * colorVarieties.length)] // More variety in colors
        : colorVarieties[Math.floor(Math.random() * 3)] // Occasionally favor the first colors
        
      // Much higher opacity values for better visibility
      const opacity = particleType === "normal" 
        ? Math.random() * 0.45 + 0.35  // 0.35-0.80 range
        : particleType === "star" 
          ? Math.random() * 0.55 + 0.4  // 0.4-0.95 range
          : Math.random() * 0.6 + 0.4   // 0.4-1.0 range
      
      const color = `${colorBase}${opacity})`
      
      // More intentional movement direction and speed for smoother motion
      const direction = Math.random() * Math.PI * 2
      const moveSpeed = particleType === "normal"
        ? Math.random() * 0.25 + 0.08
        : particleType === "star"
          ? Math.random() * 0.18 + 0.05
          : Math.random() * 0.12 + 0.03

      particles.push({
        x,
        y,
        size,
        speedX: Math.cos(direction) * moveSpeed,
        speedY: Math.sin(direction) * moveSpeed,
        color,
        type: particleType,
        pulse: Math.random() * Math.PI * 2, // Random start phase
        pulseSpeed: Math.random() * 0.04 + 0.015, // Slightly faster pulse
        opacity: opacity,
        direction: direction,
        moveSpeed: moveSpeed
      })
    }

    let animationFrameId: number;
    const animate = () => {
      // Very transparent background for better visibility of particles
      ctx.fillStyle = "rgba(0, 0, 0, 0.01)" // Very transparent for particle trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        // Update position with smooth autonomous movement
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Boundary checking - wrap around screen edges for continuous flow
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
        
        // Gently change direction occasionally for more interesting movement
        if (Math.random() < 0.003) {
          const angleChange = (Math.random() - 0.5) * 0.3
          particle.direction += angleChange
          particle.speedX = Math.cos(particle.direction) * particle.moveSpeed
          particle.speedY = Math.sin(particle.direction) * particle.moveSpeed
        }

        // Update pulse effect for particles
        particle.pulse += particle.pulseSpeed
        if (particle.pulse > Math.PI * 2) {
          particle.pulse = 0
        }

        // Calculate size and opacity variations based on pulse
        let displaySize = particle.size
        let opacity = particle.opacity
        
        if (particle.type === "star") {
          // Stars twinkle with enhanced brightness
          opacity = particle.opacity * (0.8 + Math.sin(particle.pulse) * 0.5)
          // Make stars larger when they're at peak brightness
          displaySize = particle.size * (1 + Math.max(0, Math.sin(particle.pulse)) * 0.5)
        } else if (particle.type === "glow") {
          // Glow particles pulse in size more dramatically
          displaySize = particle.size * (0.9 + Math.sin(particle.pulse) * 0.4)
          opacity = particle.opacity * (0.85 + Math.sin(particle.pulse) * 0.4)
        }

        // Draw particle with special effects based on type
        if (particle.type === "glow") {
          // Create enhanced radial gradient for glow particles
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, displaySize * 3
          )
          const baseColor = particle.color.replace(/[\d\.]+\)$/, `${opacity})`)
          const innerColor = baseColor.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),/, (match, r, g, b) => {
            // Make the center even brighter by increasing RGB values
            const br = Math.min(255, parseInt(r) + 40);
            const bg = Math.min(255, parseInt(g) + 40);
            const bb = Math.min(255, parseInt(b) + 40);
            return `rgba(${br}, ${bg}, ${bb},`;
          });
          gradient.addColorStop(0, innerColor)
          gradient.addColorStop(0.5, baseColor)
          gradient.addColorStop(1, baseColor.replace(/[\d\.]+\)$/, "0)"))
          
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, displaySize * 3, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }
        
        // Draw the main particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, displaySize, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace(/[\d\.]+\)$/, `${opacity})`)
        ctx.fill()
        
        // Draw enhanced star sparkle effect
        if (particle.type === "star" && Math.random() < 0.08) { // Increased chance for sparkles
          const sparkSize = particle.size * 5 // Larger sparkles
          ctx.beginPath()
          ctx.moveTo(particle.x - sparkSize, particle.y)
          ctx.lineTo(particle.x + sparkSize, particle.y)
          ctx.moveTo(particle.x, particle.y - sparkSize)
          ctx.lineTo(particle.x, particle.y + sparkSize)
          // More visible sparkle lines
          ctx.strokeStyle = particle.color.replace(/[\d\.]+\)$/, "0.6)")
          ctx.lineWidth = 0.7
          ctx.stroke()
        }

        // Draw more vibrant connections with slightly thicker lines
        particles.forEach((otherParticle, index) => {
          // Skip connections for performance
          if (index % 4 !== 0) return
          
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Longer connection distance for more impressive web effect
          const connectionDistance = particle.type === "glow" || otherParticle.type === "glow" 
            ? 150 : 100
          
          if (distance < connectionDistance && distance > 0) {
            const lineOpacity = 0.12 * (1 - distance / connectionDistance) // More visible lines
            
            // More vibrant line colors
            let lineColor
            if (particle.type === "glow" || otherParticle.type === "glow") {
              lineColor = `rgba(159, 122, 255, ${lineOpacity * 1.4})` // Brighter violet
            } else if (particle.type === "star" || otherParticle.type === "star") {
              lineColor = `rgba(56, 218, 255, ${lineOpacity * 1.3})` // Brighter cyan
            } else {
              lineColor = `rgba(170, 120, 255, ${lineOpacity * 1.2})` // Brighter purple
            }
            
            ctx.beginPath()
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 0.6 // Slightly thicker lines for visibility
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions])
  
  return (
    <>
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/80 via-black/70 to-black/75 pointer-events-none"></div>
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 bg-transparent pointer-events-none" />
    </>
  )
}

export default ParticleBackground
