import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

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
      pulse: number
      pulseSpeed: number

      constructor(canvas: HTMLCanvasElement) {
        this.x = (Math.random() * canvas.width) / window.devicePixelRatio
        this.y = (Math.random() * canvas.height) / window.devicePixelRatio
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        // Use a more vibrant color palette with blue and purple hues
        this.color = `hsl(${Math.random() * 60 + 210}, 100%, ${Math.random() * 30 + 60}%)`
        this.pulse = 0
        this.pulseSpeed = 0.02 + Math.random() * 0.04
      }

      update(canvas: HTMLCanvasElement) {
        this.x += this.speedX
        this.y += this.speedY
        this.pulse += this.pulseSpeed

        if (this.x < 0 || this.x > canvas.width / window.devicePixelRatio) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height / window.devicePixelRatio) this.speedY *= -1
      }

      draw() {
        if (ctx) {
          const pulseFactor = Math.sin(this.pulse) * 0.5 + 1.5
          // Add a glow effect to particles
          ctx.shadowColor = this.color
          ctx.shadowBlur = 10
          
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size * pulseFactor, 0, Math.PI * 2)
          ctx.fill()
          
          // Reset shadow to prevent affecting other elements
          ctx.shadowBlur = 0
        }
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
        this.maxDistance = 130
      }

      update() {
        const dx = this.p1.x - this.p2.x
        const dy = this.p1.y - this.p2.y
        this.distance = Math.sqrt(dx * dx + dy * dy)
      }

      draw() {
        if (!ctx) return
        if (this.distance < this.maxDistance) {
          const opacity = 1 - this.distance / this.maxDistance
          // Use a gradient for connections
          const gradient = ctx.createLinearGradient(
            this.p1.x, this.p1.y, this.p2.x, this.p2.y
          );
          gradient.addColorStop(0, `rgba(100, 149, 237, ${opacity * 0.8})`);
          gradient.addColorStop(1, `rgba(150, 100, 237, ${opacity * 0.8})`);
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(this.p1.x, this.p1.y)
          ctx.lineTo(this.p2.x, this.p2.y)
          ctx.stroke()
        }
      }
    }

    // Create particles
    for (let i = 0; i < 55; i++) {
      particles.push(new Particle(canvas))
      particles.push(new Particle(canvas))
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

      // Draw background glow
      const glowRadius = 200
      const gradient = ctx.createRadialGradient(
        editorX + editorWidth / 2, 
        editorY + editorHeight / 2, 
        0,
        editorX + editorWidth / 2, 
        editorY + editorHeight / 2, 
        glowRadius
      );
      gradient.addColorStop(0, 'rgba(100, 149, 237, 0.1)');
      gradient.addColorStop(0.5, 'rgba(150, 100, 237, 0.05)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(
        editorX + editorWidth / 2 - glowRadius,
        editorY + editorHeight / 2 - glowRadius,
        glowRadius * 2,
        glowRadius * 2
      );

      // Draw code editor with glow effect
      ctx.shadowColor = 'rgba(100, 149, 237, 0.5)'
      ctx.shadowBlur = 15
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      
      ctx.fillStyle = "rgba(30, 41, 59, 0.85)"
      ctx.strokeStyle = "rgba(100, 149, 237, 0.6)"
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
      
      // Reset shadow
      ctx.shadowBlur = 0

      // Draw editor header
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)"
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
      
      // Editor tab
      ctx.fillStyle = "rgba(59, 130, 246, 0.8)"
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(editorX + 75, editorY, 150, 30, [5, 5, 0, 0])
      } else {
        ctx.rect(editorX + 75, editorY, 150, 30)
      }
      ctx.fill()
      
      ctx.fillStyle = "white"
      ctx.font = "12px monospace"
      ctx.fillText("collaboration.js", editorX + 95, editorY + 20)

      // Draw code lines
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
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

      // Syntax highlighting
      const keywords = ["function", "const", "return", "if"];
      const literals = ["true", "false", "null", "undefined", "-1"];
      const operators = ["=>", "=", "!==", "===", "+", "-", "*", "/"];
      const methods = ["push", "splice", "findIndex"];

      lines.forEach((line, index) => {
        let xPos = editorX + 20;
        const yPos = editorY + 50 + index * 18;
        
        // Highlight keywords, literals, etc.
        const words = line.split(/([(){},;`$[].]|\s+)/);
        
        words.forEach(word => {
          if (keywords.includes(word)) {
            ctx.fillStyle = "#ff79c6"; // Pink for keywords
          } else if (literals.includes(word)) {
            ctx.fillStyle = "#bd93f9"; // Purple for literals
          } else if (operators.some(op => word.includes(op))) {
            ctx.fillStyle = "#ff79c6"; // Pink for operators
          } else if (methods.includes(word)) {
            ctx.fillStyle = "#50fa7b"; // Green for methods
          } else if (word.startsWith('"') || word.startsWith("'") || word.startsWith("`") || word.includes("${")) {
            ctx.fillStyle = "#f1fa8c"; // Yellow for strings
          } else if (!isNaN(Number(word))) {
            ctx.fillStyle = "#bd93f9"; // Purple for numbers
          } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; // Default white
          }
          
          ctx.fillText(word, xPos, yPos);
          xPos += ctx.measureText(word).width;
        });
      });

      // Draw cursor with glow effect
      const now = Date.now();
      if (Math.floor(now / 500) % 2 === 0) {
        ctx.shadowColor = "rgba(100, 149, 237, 1)"
        ctx.shadowBlur = 5
        ctx.fillStyle = "rgba(100, 149, 237, 1)"
        ctx.fillRect(editorX + 20 + 8 * 10, editorY + 50 + 7 * 18 - 12, 2, 16)
        ctx.shadowBlur = 0
      }

      // Draw user indicators with improved styling
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)"
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 5
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(editorX + editorWidth - 160, editorY + 50, 140, 90, 8)
      } else {
        ctx.rect(editorX + editorWidth - 160, editorY + 50, 140, 90)
      }
      ctx.fill()
      ctx.shadowBlur = 0

      // Title for users panel
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.font = "bold 11px sans-serif"
      ctx.fillText("COLLABORATORS", editorX + editorWidth - 140, editorY + 65)
      
      // User 1 with avatar
      ctx.fillStyle = "#4f46e5"
      ctx.beginPath()
      ctx.arc(editorX + editorWidth - 145, editorY + 85, 8, 0, Math.PI * 2)
      ctx.fill()
      
      // Online indicator
      ctx.fillStyle = "#27c93f"
      ctx.beginPath()
      ctx.arc(editorX + editorWidth - 138, editorY + 88, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = "12px sans-serif"
      ctx.fillText("Alice (typing...)", editorX + editorWidth - 125, editorY + 89)

      // User 2 with avatar
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(editorX + editorWidth - 145, editorY + 110, 8, 0, Math.PI * 2)
      ctx.fill()
      
      // Online indicator
      ctx.fillStyle = "#27c93f"
      ctx.beginPath()
      ctx.arc(editorX + editorWidth - 138, editorY + 113, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.fillText("Bob (online)", editorX + editorWidth - 125, editorY + 114)

      // Update and draw particles and connections
      particles.forEach((particle) => {
        if (canvas) {
          particle.update(canvas)
        }
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
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 z-10 pointer-events-none"></div>
      <canvas ref={canvasRef} className="w-full h-full" style={{ background: "rgba(15, 23, 42, 0.2)" }} />
    </motion.div>
  )
}