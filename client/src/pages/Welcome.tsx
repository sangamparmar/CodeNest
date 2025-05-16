"use client"

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D, Float, Html, Stars } from "@react-three/drei"
import * as THREE from "three"
import {
  Code,
  FileCode,
  Users,
  Globe,
  Zap,
  Clock,
  MessageSquare,
  Lock,
  Bot,
  Play,
  Github,
  Twitter,
  Linkedin,
  Pencil,
  ArrowLeft,
  Share2,
  Save,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"
import { useMobile } from "../hooks/use-mobile"

// Type definitions
interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
}

interface MousePosition {
  x: number
  y: number
}

// Type definitions for the FeatureCard component
interface FeatureCardProps {
  icon: React.ReactElement
  title: string
  description: string
  index: number
}

// Terminal Component
const Terminal = ({ text, typing = false, delay = 70 }: { text: string; typing?: boolean; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    if (typing) {
      let i = 0
      setDisplayedText("")

      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText((prev) => prev + text.charAt(i))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, delay)

      return () => clearInterval(typingInterval)
    } else {
      setDisplayedText(text)
    }
  }, [text, typing, delay])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <div className="font-mono text-sm sm:text-base text-green-400 bg-black/80 rounded-lg p-4 border border-green-500/30 shadow-lg shadow-green-500/20">
      <div className="flex items-center gap-2 mb-2 border-b border-green-500/20 pb-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="flex-1 text-right text-green-400/70 text-xs">codenest-terminal</div>
      </div>
      <div>
        <span className="text-blue-400">$</span> {displayedText}
        {cursorVisible && <span className="text-green-400">▋</span>}
      </div>
    </div>
  )
}

// 3D Terminal Window Component
const TerminalWindow = ({
  position,
  rotation,
  scale,
  text,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  text: string
}) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#000000" />
        <Html transform distanceFactor={10} position={[0, 0, 0.06]} rotation={[0, 0, 0]} scale={[0.25, 0.25, 0.25]}>
          <div className="w-[600px] h-[300px] bg-black rounded-lg border border-green-500/50 p-4 font-mono text-green-400">
            <div className="flex items-center gap-2 mb-2 border-b border-green-500/20 pb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1 text-right text-green-400/70 text-xs">codenest-terminal</div>
            </div>
            <div className="text-sm">{text}</div>
          </div>
        </Html>
      </mesh>
    </group>
  )
}

// Futuristic Digital Globe Component
const FuturisticDigitalGlobe = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.Group>(null)
  const dataStreamRef = useRef<THREE.Group>(null)
  const hologramRingRef = useRef<THREE.Group>(null)
  const time = useRef(0)
  const radius = 1.5
  
  // Use useMemo to create persistent data structures that won't be recreated on each render
  const { points, lines, dataStreams, rings } = useMemo(() => {
    const numPoints = 80
    const points: THREE.Vector3[] = []
    const lines: THREE.BufferGeometry[] = []
    const dataStreams: {
      start: THREE.Vector3
      end: THREE.Vector3
      progress: number
      speed: number
      color: string
    }[] = []
    
    // Generate points on the sphere using fibonacci distribution for more even coverage
    const phi = Math.PI * (3 - Math.sqrt(5)) // golden angle
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2 // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y) // radius at y position
      const theta = phi * i // golden angle increment

      const x = Math.cos(theta) * radiusAtY * radius
      const z = Math.sin(theta) * radiusAtY * radius

      points.push(new THREE.Vector3(x, y * radius, z))
    }

    // Create connections between points
    for (let i = 0; i < numPoints; i++) {
      for (let j = i + 1; j < numPoints; j++) {
        // Create more connections for a denser network
        if (Math.random() > 0.92) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([points[i], points[j]])
          lines.push(lineGeometry)
        }
      }
    }

    // Create data streams - flowing particles along paths
    for (let i = 0; i < 15; i++) {
      const startPoint = points[Math.floor(Math.random() * points.length)]
      const endPoint = points[Math.floor(Math.random() * points.length)]

      // Ensure we don't connect a point to itself
      if (startPoint.distanceTo(endPoint) > 0.5) {
        dataStreams.push({
          start: startPoint.clone(),
          end: endPoint.clone(),
          progress: Math.random(), // Random starting progress
          speed: 0.005 + Math.random() * 0.01, // Random speed
          color: Math.random() > 0.5 ? "#4cc9f0" : "#f72585", // Alternate colors
        })
      }
    }

    // Create holographic rings data
    const rings: { radius: number; rotation: THREE.Euler; speed: number; thickness: number }[] = []
    for (let i = 0; i < 3; i++) {
      rings.push({
        radius: radius * (0.8 + i * 0.2),
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        speed: 0.1 + Math.random() * 0.2,
        thickness: 0.02 + Math.random() * 0.03,
      })
    }
    
    return { points, lines, dataStreams, rings }
  }, [])

  useFrame(() => {
    time.current += 0.005

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001
    }

    if (linesRef.current) {
      linesRef.current.rotation.y += 0.001
    }

    // Animate holographic rings
    if (hologramRingRef.current) {
      hologramRingRef.current.children.forEach((ring, i) => {
        if (rings[i]) {
          ring.rotation.x += rings[i].speed * 0.01
          ring.rotation.z += rings[i].speed * 0.005
        }
      })
    }

    // Animate data streams
    if (dataStreamRef.current) {
      dataStreamRef.current.children.forEach((streamPoint, i) => {
        if (dataStreams[i]) {
          // Update progress
          dataStreams[i].progress += dataStreams[i].speed

          if (dataStreams[i].progress > 1) {
            // Reset stream with new random points when it completes
            const startPoint = points[Math.floor(Math.random() * points.length)]
            const endPoint = points[Math.floor(Math.random() * points.length)]

            if (startPoint.distanceTo(endPoint) > 0.5) {
              dataStreams[i].start = startPoint.clone()
              dataStreams[i].end = endPoint.clone()
              dataStreams[i].progress = 0
              dataStreams[i].speed = 0.005 + Math.random() * 0.01
              dataStreams[i].color = Math.random() > 0.5 ? "#4cc9f0" : "#f72585"
            }
          }

          // Calculate current position
          const currentPos = new THREE.Vector3().lerpVectors(
            dataStreams[i].start,
            dataStreams[i].end,
            dataStreams[i].progress,
          )

          // Update position
          streamPoint.position.copy(currentPos)
        }
      })
    }
  })

  return (
    <group>
      {/* Core sphere with wireframe */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color="#090b16"
          transparent={true}
          opacity={0.7}
          wireframe={true}
          emissive="#4cc9f0"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[radius * 0.97, 32, 32]} />
        <meshStandardMaterial
          color="#4cc9f0"
          transparent={true}
          opacity={0.05}
          emissive="#4cc9f0"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Network nodes */}
      <group ref={pointsRef}>
        {points.map((point, i) => (
          <mesh key={i} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[0.03 + Math.random() * 0.02, 16, 16]} />
            <meshStandardMaterial
              color="#4cc9f0"
              emissive="#4cc9f0"
              emissiveIntensity={2 + Math.sin(time.current + i) * 0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Network connections */}
      <group ref={linesRef}>
        {lines.map((lineGeometry, i) => (
          <line key={i}>
            <bufferGeometry attach="geometry" {...lineGeometry} />
            <lineBasicMaterial
              attach="material"
              color="#4cc9f0"
              transparent
              opacity={0.3 + Math.sin(time.current + i * 0.1) * 0.1}
              linewidth={1}
            />
          </line>
        ))}
      </group>

      {/* Data streams - particles moving along paths */}
      <group ref={dataStreamRef}>
        {dataStreams.map((stream, i) => (
          <mesh key={i} position={[stream.start.x, stream.start.y, stream.start.z]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color={stream.color} emissive={stream.color} emissiveIntensity={3} />
          </mesh>
        ))}
      </group>

      {/* Holographic rings */}
      <group ref={hologramRingRef}>
        {rings.map((ring, i) => (
          <mesh key={i} rotation={[ring.rotation.x, ring.rotation.y, ring.rotation.z]}>
            <torusGeometry args={[ring.radius, ring.thickness, 16, 100]} />
            <meshStandardMaterial
              color="#4cc9f0"
              transparent={true}
              opacity={0.15}
              emissive="#4cc9f0"
              emissiveIntensity={0.5}
              wireframe={true}
            />
          </mesh>
        ))}
      </group>

      {/* Code rings - text floating around the sphere */}
      <group rotation={[0, time.current * 0.2, 0]}>
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[radius * 1.8, radius * 1.85, 64]} />
          <meshStandardMaterial color="#4cc9f0" transparent={true} opacity={0.2} side={THREE.DoubleSide} />
          <Html
            position={[radius * 1.8, 0, 0]}
            transform
            distanceFactor={10}
            rotation={[0, Math.PI / 2, 0]}
            scale={[0.05, 0.05, 0.05]}
          >
            <div className="w-[400px] font-mono text-cyan-400 opacity-80">
              {`function connect() { return new Promise((resolve) => { socket.on('connect', resolve); }); }`}
            </div>
          </Html>
        </mesh>
      </group>

      <group rotation={[Math.PI / 4, time.current * 0.15, 0]}>
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[radius * 2, radius * 2.05, 64]} />
          <meshStandardMaterial color="#f72585" transparent={true} opacity={0.15} side={THREE.DoubleSide} />
          <Html
            position={[radius * 2, 0, 0]}
            transform
            distanceFactor={10}
            rotation={[0, Math.PI / 2, 0]}
            scale={[0.05, 0.05, 0.05]}
          >
            <div className="w-[400px] font-mono text-pink-400 opacity-80">
              {`class CodeNest { constructor() { this.users = []; this.room = crypto.randomUUID(); } }`}
            </div>
          </Html>
        </mesh>
      </group>
    </group>
  )
}

// 3D Scene Component
const HeroScene = () => {
  const [, setHovered] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  
  // Handle mouse movement for interactive effects
  const handleMouseMove = (e: React.MouseEvent) => {
    mousePos.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    }
    setHovered(true)
  }
``
  const handleMouseLeave = () => {
    setHovered(false)
  }

  return (    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance", 
        stencil: false,
        depth: true
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#000"]} />

      /* Lighting */
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4cc9f0" />
      <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} castShadow color="#4cc9f0" />
      <spotLight position={[0, 0, 5]} angle={0.2} penumbra={0.5} intensity={2} color="#ffffff" />

      <Suspense fallback={null}>
        {/* Main digital globe - positioned slightly back */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5} position={[0, 0, -1]}>
          <FuturisticDigitalGlobe />
        </Float>{/* Terminal windows */}
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.4} position={[-2.5, 1, -1]}>
          <TerminalWindow
            position={[-2.5, 1, 0]}
            rotation={[0, 0.3, 0]}
            scale={[0.8, 0.8, 0.8]}
            text="$ npm install @codenest/client\n$ import { createRoom } from '@codenest/client'\n$ const room = createRoom()\n$ room.connect()"
          />
        </Float>

        <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.3} position={[2.5, -1, -1]}>
          <TerminalWindow
            position={[2.5, -1, 0]}
            rotation={[0, -0.3, 0]}
            scale={[0.8, 0.8, 0.8]}
            text="$ room.join('dev-123')\n$ room.onUserJoin((user) => {\n  console.log(`${user} joined!`)\n})\n$ room.code.subscribe((update) => {\n  editor.update(update)\n})"
          />        </Float>        {/* Floating CodeNest text - properly centered in view */}
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3} position={[0, 0, 1.5]}>
          <Text3D
            font="/fonts/Inter_Bold.json"
            position={[-1.4, 0, 0]} 
            size={0.4}
            height={0.08}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelSegments={5}
          >
            CodeNest
            <meshPhysicalMaterial 
              color="#ffffff"
              emissive="#4cc9f0" 
              emissiveIntensity={2} 
              toneMapped={false} 
              metalness={0.7}
              roughness={0.2}
              clearcoat={1}
            />
          </Text3D>
        </Float>

        {/* Floating data particles */}
        <group>
          {Array.from({ length: 50 }).map((_, i) => (
            <Float
              key={i}
              speed={1 + Math.random() * 2}
              rotationIntensity={0.2}
              floatIntensity={0.2}
              position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]}
            >
              <mesh>
                <boxGeometry args={[0.05, 0.05, 0.05]} />
                <meshStandardMaterial
                  color={Math.random() > 0.5 ? "#4cc9f0" : "#f72585"}
                  emissive={Math.random() > 0.5 ? "#4cc9f0" : "#f72585"}
                  emissiveIntensity={2}
                />
              </mesh>
            </Float>
          ))}
        </group>

        {/* Holographic grid */}
        <group position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <planeGeometry args={[40, 40, 20, 20]} />
            <meshStandardMaterial
              color="#4cc9f0"
              emissive="#4cc9f0"
              emissiveIntensity={0.3}
              wireframe={true}
              transparent={true}
              opacity={0.1}
            />
          </mesh>
        </group>

        {/* Background stars */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} fade speed={0.5} />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Suspense>      {/* Post-processing effects - disabled for better performance */}
      {/* Using empty fragment to avoid possible effects error */}
      {<></>}
    </Canvas>
  )
}

// Particle Effect
const ParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useRef<MousePosition>({ x: 0, y: 0 })
  const particles = useRef<Particle[]>([])
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let width = window.innerWidth
    let height = window.innerHeight

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles
    const createParticles = () => {
      particles.current = []
      const particleCount = Math.min(width, height) / 10

      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          color: `rgba(76, 201, 240, ${Math.random() * 0.5 + 0.1})`,
        })
      }
    }

    createParticles()

    // Handle mouse movement
    const handleMouseMove = (e: { clientX: any; clientY: any }) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      particles.current.forEach((particle, index) => {
        // Move particles
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x > width) particle.x = 0
        if (particle.x < 0) particle.x = width
        if (particle.y > height) particle.y = 0
        if (particle.y < 0) particle.y = height

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Connect particles near mouse
        const dx = mousePosition.current.x - particle.x
        const dy = mousePosition.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(76, 201, 240, ${0.3 - distance / 500})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(mousePosition.current.x, mousePosition.current.y)
          ctx.stroke()
        }

        // Connect nearby particles
        for (let j = index + 1; j < particles.current.length; j++) {
          const particle2 = particles.current[j]
          const dx2 = particle.x - particle2.x
          const dy2 = particle.y - particle2.y
          const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

          if (distance2 < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(76, 201, 240, ${0.2 - distance2 / 500})`
            ctx.lineWidth = 0.3
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(particle2.x, particle2.y)
            ctx.stroke()
          }
        }
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />
}

// Feature Card Component
const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 20px rgba(76, 201, 240, 0.3)",
        borderColor: "rgba(76, 201, 240, 0.5)",
      }}
      className="relative"
    >
      <Card className="h-full backdrop-blur-sm bg-background/40 border-primary/10 overflow-visible transition-all duration-300">
        <div className="absolute -top-6 left-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            {React.cloneElement(icon, { className: "h-6 w-6" })}
          </div>
        </div>
        <div className="p-6 pt-10">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </Card>
    </motion.div>
  )
}

// Interactive Demo Component
const InteractiveDemo = () => {
  // Demo state
  const [demoMode, setDemoMode] = useState<"default" | "code" | "chat" | "draw">("default")
  const [] = useState(true)

  // Return the appropriate demo based on the selected mode
  const renderDemoContent = () => {
    switch (demoMode) {
      case "code":
        return <CodeCollaborationDemo />
      case "chat":
        return <ChatDemo />
      case "draw":
        return <DrawingDemo />
      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-cyan-500/30 p-8">
            <div className="text-center">
              <div className="text-3xl text-cyan-400 mb-6">
                <div className="flex justify-center">
                  <Code className="h-12 w-12" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Try CodeNest Now</h3>
              <p className="text-gray-300 mb-6">Select a demo feature to experience real-time collaboration</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => setDemoMode("code")} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Code className="mr-2 h-4 w-4" /> Code Editor
                </Button>
                <Button onClick={() => setDemoMode("chat")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <MessageSquare className="mr-2 h-4 w-4" /> Team Chat
                </Button>
                <Button onClick={() => setDemoMode("draw")} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Pencil className="mr-2 h-4 w-4" /> Whiteboard
                </Button>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative">
      {demoMode !== "default" && (
        <Button
          onClick={() => setDemoMode("default")}
          variant="outline"
          size="sm"
          className="absolute -top-12 left-0 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 z-10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Demo Selection
        </Button>
      )}
      {renderDemoContent()}
    </div>
  )
}

// Drawing Demo Component
const DrawingDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#4cc9f0")
  const [brushSize, setBrushSize] = useState(5)
  const lastPos = useRef({ x: 0, y: 0 })
  const otherUserDrawing = useRef<{ interval: NodeJS.Timeout | null; points: { x: number; y: number }[] }>({
    interval: null,
    points: [
      { x: 50, y: 100 },
      { x: 70, y: 120 },
      { x: 90, y: 110 },
      { x: 120, y: 100 },
      { x: 150, y: 90 },
      { x: 180, y: 100 },
      { x: 200, y: 130 },
      { x: 220, y: 150 },
    ],
  })

  // Initialize canvas and start other user's simulated drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#1f2937"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Simulate another user drawing after a delay
    const timer = setTimeout(() => {
      let pointIndex = 0

      otherUserDrawing.current.interval = setInterval(() => {
        if (pointIndex < otherUserDrawing.current.points.length - 1) {
          const startPoint = otherUserDrawing.current.points[pointIndex]
          const endPoint = otherUserDrawing.current.points[pointIndex + 1]

          ctx.beginPath()
          ctx.moveTo(startPoint.x, startPoint.y)
          ctx.lineTo(endPoint.x, endPoint.y)
          ctx.strokeStyle = "#f472b6" // Pink color for other user
          ctx.lineWidth = 4
          ctx.lineCap = "round"
          ctx.stroke()

          pointIndex++
        } else {
          if (otherUserDrawing.current.interval) {
            clearInterval(otherUserDrawing.current.interval)
          }
        }
      }, 300)
    }, 2000)

    return () => {
      clearTimeout(timer)
      if (otherUserDrawing.current.interval) {
        clearInterval(otherUserDrawing.current.interval)
      }
    }
  }, [])

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    lastPos.current = { x, y }
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.stroke()

    lastPos.current = { x, y }
  }

  const endDrawing = () => {
    setIsDrawing(false)
  }

  return (
    <div className="rounded-lg overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/20 bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/30 bg-gray-900/90">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
        </div>
        <div className="font-mono text-sm text-cyan-400">
          Collaborative Whiteboard{" "}
          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full ml-2">ACTIVE</span>
        </div>
        <div className="text-xs text-gray-400">codenest.io</div>
      </div>

      <div className="p-4 bg-gray-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setColor("#4cc9f0")}
                className={`w-6 h-6 rounded-full bg-cyan-500 ${color === "#4cc9f0" ? "ring-2 ring-white" : ""}`}
              />
              <button
                onClick={() => setColor("#f472b6")}
                className={`w-6 h-6 rounded-full bg-pink-500 ${color === "#f472b6" ? "ring-2 ring-white" : ""}`}
              />
              <button
                onClick={() => setColor("#34d399")}
                className={`w-6 h-6 rounded-full bg-green-500 ${color === "#34d399" ? "ring-2 ring-white" : ""}`}
              />
              <button
                onClick={() => setColor("#fbbf24")}
                className={`w-6 h-6 rounded-full bg-yellow-500 ${color === "#fbbf24" ? "ring-2 ring-white" : ""}`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-300">Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number.parseInt(e.target.value))}
                className="w-24"
              />
            </div>
          </div>

          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs border-2 border-gray-800">
              Y
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs border-2 border-gray-800">
              A
            </div>
          </div>
        </div>

        <div className="relative border border-gray-700 rounded">
          <canvas
            ref={canvasRef}
            width={700}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            className="w-full cursor-crosshair"
          />

          <div className="absolute bottom-4 left-4 bg-gray-800/80 px-3 py-1 rounded text-xs text-gray-300 backdrop-blur-sm">
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-pink-500 mr-2"></div>
              Alice is drawing...
            </span>
          </div>

          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
              <Share2 className="h-3 w-3 mr-1" /> Share
            </Button>
            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
              <Save className="h-3 w-3 mr-1" /> Save
            </Button>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          Try drawing on the canvas! Another user (Alice) is also drawing.
        </div>
      </div>
    </div>
  )
}

// Chat Demo Component
const ChatDemo = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: "System", text: "Welcome to the CodeNest team chat!", time: "10:30 AM" },
    { sender: "Alice", text: "Hey everyone! I just pushed the new feature to the repo.", time: "10:31 AM" },
    { sender: "Bob", text: "Great work Alice! I'll review it this afternoon.", time: "10:32 AM" },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Simulate Bob typing after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "Bob",
          text: "Can someone help me with the authentication module? I'm getting a weird error.",
          time: "10:35 AM",
        },
      ])
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const now = new Date()
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`

    setMessages((prev) => [
      ...prev,
      {
        sender: "You",
        text: inputValue.trim(),
        time: timeStr,
      },
    ])

    setInputValue("")

    // Simulate response if user message is a question
    if (inputValue.trim().endsWith("?")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "Alice",
            text: "Good question! Let me check and get back to you on that.",
            time: timeStr,
          },
        ])
      }, 2000)
    }
  }

  return (
    <div className="rounded-lg overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/20 bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/30 bg-gray-900/90">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
        </div>
        <div className="font-mono text-sm text-cyan-400">
          Team Chat{" "}
          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full ml-2">3 ONLINE</span>
        </div>
        <div className="text-xs text-gray-400">codenest.io</div>
      </div>
      <div className="flex flex-col h-[500px]">
        <div className="flex border-b border-cyan-500/30">
          <div className="px-4 py-2 text-cyan-400 border-b-2 border-cyan-400 text-xs">Team Chat</div>
        </div>

        {/* Chat area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-950">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                {msg.sender !== "You" && (
                  <div
                    className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white ${
                      msg.sender === "Alice" ? "bg-cyan-500" : msg.sender === "Bob" ? "bg-purple-500" : "bg-gray-500"
                    }`}
                  >
                    {msg.sender[0]}
                  </div>
                )}

                <div className={`max-w-[70%] ${msg.sender === "System" ? "w-full text-center" : ""}`}>
                  {msg.sender !== "System" && (
                    <div className="flex items-center mb-1">
                      <span
                        className={`text-xs font-semibold ${
                          msg.sender === "You"
                            ? "text-green-400"
                            : msg.sender === "Alice"
                              ? "text-cyan-400"
                              : msg.sender === "Bob"
                                ? "text-purple-400"
                                : "text-gray-400"
                        }`}
                      >
                        {msg.sender}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">{msg.time}</span>
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === "You"
                        ? "bg-green-500/20 text-green-100"
                        : msg.sender === "System"
                          ? "bg-gray-800/50 text-gray-300 text-xs py-1"
                          : "bg-gray-800 text-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                {msg.sender === "You" && (
                  <div className="w-8 h-8 rounded-full ml-2 bg-green-500 flex items-center justify-center text-white">
                    Y
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-cyan-500/30 bg-gray-900">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-l-md py-2 px-3 text-white focus:outline-none focus:border-cyan-500"
              placeholder="Type a message..."
            />
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-r-md">
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// Code Collaboration Demo Component
const CodeCollaborationDemo = () => {
  // Connection steps animation
  const [connectionStage, setConnectionStage] = useState(0)
  const [usersInRoom, setUsersInRoom] = useState<{ name: string; avatar: string; role: string; status: string }[]>([])
  const [inputValue, setInputValue] = useState("")
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["$ npm create codenest-room"])
  const [showEditor, setShowEditor] = useState(false)
  const [code] = useState(`// app.js

function initCodeNestConnection() {
  // Initialize real-time connection
  const socket = io.connect('https://codenest.io');
  
  // Set up room parameters
  const room = {
    id: 'J7X42M',
    language: 'javascript',
    theme: 'dark'
  };
  
  return { socket, room };
}`)

  // Simulated typing in terminal
  useEffect(() => {
    const commands = [
      "Creating package.json...",
      "Installing dependencies...",
      "Setting up secure room...",
      "Generating room ID: J7X42M",
      "Initializing WebSocket connection...",
      "Room creation successful!",
      "Waiting for users to connect...",
    ]

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < commands.length) {
        setTerminalOutput((prev) => [...prev, commands[currentIndex]])
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => setConnectionStage(1), 1000) // Move to next stage after typing
      }
    }, 800)

    return () => clearInterval(typingInterval)
  }, [])

  // Add users joining animation
  useEffect(() => {
    if (connectionStage === 1) {
      // First user joins (you)
      setUsersInRoom([
        {
          name: "You",
          avatar: "Y",
          role: "Admin",
          status: "online",
        },
      ])

      // Add more users with delays
      setTimeout(() => {
        setUsersInRoom((prev) => [
          ...prev,
          {
            name: "Alice",
            avatar: "A",
            role: "Editor",
            status: "joining",
          },
        ])

        setTerminalOutput((prev) => [...prev, "Alice is joining the room..."])

        setTimeout(() => {
          setUsersInRoom((prev) => prev.map((user) => (user.name === "Alice" ? { ...user, status: "online" } : user)))
          setTerminalOutput((prev) => [...prev, "Alice connected successfully!"])
        }, 1500)
      }, 2000)

      setTimeout(() => {
        setUsersInRoom((prev) => [
          ...prev,
          {
            name: "Bob",
            avatar: "B",
            role: "Viewer",
            status: "joining",
          },
        ])

        setTerminalOutput((prev) => [...prev, "Bob is joining the room..."])

        setTimeout(() => {
          setUsersInRoom((prev) => prev.map((user) => (user.name === "Bob" ? { ...user, status: "online" } : user)))
          setTerminalOutput((prev) => [...prev, "Bob connected successfully!"])

          // Show editor after all users join
          setTimeout(() => {
            setShowEditor(true)

            // Start typing simulation
            setTimeout(() => {
              setTypingUser("Alice")
            }, 2000)
          }, 1000)
        }, 2000)
      }, 4000)
    }
  }, [connectionStage])

  // Handle input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Terminal command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setTerminalOutput((prev) => [...prev, `$ ${inputValue}`])

    // Simulate response based on command
    if (inputValue.includes("invite")) {
      setTimeout(() => {
        setTerminalOutput((prev) => [...prev, "Invitation sent! Share this link: https://codenest.io/room/J7X42M"])
      }, 500)
    } else if (inputValue.includes("status")) {
      setTimeout(() => {
        setTerminalOutput((prev) => [...prev, "Room status: Active | Users: 3 | Uptime: 2m 34s"])
      }, 500)
    } else {
      setTimeout(() => {
        setTerminalOutput((prev) => [...prev, `Command not recognized: ${inputValue}`])
      }, 500)
    }

    setInputValue("")
  }

  return (
    <div className="rounded-lg overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/20 bg-gray-900">
      {/* Room header with room ID */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/30 bg-gray-900/90">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
        </div>
        <div className="font-mono text-sm text-cyan-400">
          Room: J7X42M{" "}
          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full ml-2">ACTIVE</span>
        </div>
        <div className="text-xs text-gray-400">codenest.io</div>
      </div>

      {/* Main container with split view */}
      <div className="flex flex-col md:flex-row">
        {/* Left side - terminal/connection log */}
        <div className="w-full md:w-1/3 border-r border-cyan-500/30">
          {/* Terminal output */}{" "}
          <div className="bg-gray-950 h-64 overflow-y-auto p-3 font-mono text-xs">
            {terminalOutput.map((line, i) => (
              <div
                key={i}
                className={`mb-1 ${line && typeof line === "string" && line.startsWith("$") ? "text-green-400" : "text-gray-300"}`}
              >
                {line}
              </div>
            ))}
          </div>
          {/* Terminal input */}
          <form onSubmit={handleSubmit} className="border-t border-cyan-500/30 p-2 flex">
            <span className="text-green-400 font-mono text-xs mr-2">$</span>
            <input
              type="text"
              value={inputValue}
              onChange={handleInput}
              className="bg-transparent border-none outline-none flex-1 text-white font-mono text-xs"
              placeholder="Type a command..."
              spellCheck="false"
            />
          </form>
          {/* User list */}
          <div className="border-t border-cyan-500/30 p-3">
            <div className="text-xs font-semibold text-gray-400 mb-2">USERS IN ROOM</div>

            <div className="space-y-2">
              {usersInRoom.map((user, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs mr-2 ${
                        user.role === "Admin" ? "bg-purple-500" : user.role === "Editor" ? "bg-cyan-500" : "bg-gray-500"
                      }`}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <div className="text-sm text-white">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.role}</div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center text-xs ${
                      user.status === "online"
                        ? "text-green-400"
                        : user.status === "joining"
                          ? "text-yellow-400"
                          : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-1 ${
                        user.status === "online"
                          ? "bg-green-400"
                          : user.status === "joining"
                            ? "bg-yellow-400"
                            : "bg-gray-400"
                      }`}
                    ></div>
                    {user.status === "online" ? "Online" : user.status === "joining" ? "Joining..." : "Offline"}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - code editor */}
        <div className="w-full md:w-2/3">
          {showEditor ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {/* Editor tabs */}
              <div className="flex border-b border-cyan-500/30">
                <div className="px-4 py-2 bg-gray-800 text-cyan-400 border-r border-cyan-500/30 text-xs flex items-center">
                  app.js
                  <span className="ml-2 text-gray-500">×</span>
                </div>
                <div className="px-4 py-2 text-gray-500 border-r border-cyan-500/30 text-xs">index.html</div>
                <div className="px-4 py-2 text-gray-500 border-r border-cyan-500/30 text-xs">styles.css</div>
                <div className="flex-1"></div>
              </div>

              {/* Code editor */}
              <div className="bg-gray-950 h-72 overflow-y-auto p-4 font-mono text-sm relative">
                <div className="flex">
                  {/* Line numbers */}
                  <div className="text-gray-500 mr-4 select-none">
                    {code.split("\n").map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Code content */}
                  <div className="flex-1">
                    {code.split("\n").map((line, i) => (
                      <div key={i} className="relative">
                        {/* Add Alice's cursor and highlight when she's typing */}
                        {typingUser === "Alice" && i === 7 && (
                          <>
                            <motion.span
                              className="absolute bg-cyan-500/30 h-full"
                              style={{ left: 12, width: `${"id: 'J7X42M'".length * 8}px` }}
                              animate={{ opacity: [0.3, 0.8, 0.3] }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            />
                            <motion.div
                              className="absolute h-full w-0.5 bg-cyan-500"
                              style={{ left: 82 }} /* Position after 'J7X42M' text */
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
                            />
                          </>
                        )}

                        {/* Syntax highlighting */}
                        <div className="text-gray-300">
                          {line.match(/^\/\/.*$/) ? (
                            <span className="text-green-400">{line}</span>
                          ) : (
                            line
                              .replace(/(".*?")/g, '<span class="text-yellow-300">$1</span>')
                              .replace(/(function|const|return|let|var)/g, '<span class="text-purple-400">$1</span>')
                              .replace(/({|}|$$|$$|;|,|=>)/g, '<span class="text-cyan-400">$1</span>')
                              .split(" ")
                              .map((word, j) => (
                                <span
                                  key={j}
                                  dangerouslySetInnerHTML={{ __html: word }}
                                  className="inline-block mr-1"
                                />
                              ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Collaboration status bar */}
              <div className="bg-gray-900 p-2 border-t border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {typingUser && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center text-xs text-cyan-400"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></div>
                      <span>{typingUser} is editing...</span>
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {usersInRoom.length > 0 && (
                    <div className="flex -space-x-2">
                      {usersInRoom.map((user, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 rounded-full border border-gray-800 flex items-center justify-center text-white text-xs ${
                            user.role === "Admin"
                              ? "bg-purple-500"
                              : user.role === "Editor"
                                ? "bg-cyan-500"
                                : "bg-gray-500"
                          }`}
                          title={user.name}
                        >
                          {user.avatar}
                        </div>
                      ))}
                    </div>
                  )}
                  <span className="text-gray-400 text-xs ml-2">{usersInRoom.length} online</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64 text-center p-4">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="text-4xl text-cyan-500 mb-3">
                  <div className="flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm1 6h-2v4H7v2h4v4h2v-4h4v-2h-4V8z" />
                    </svg>
                  </div>
                </div>
                <div className="text-gray-300 font-medium">Setting up collaborative environment</div>
                <div className="text-gray-400 text-sm mt-2">Waiting for users to connect...</div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Component
export default function WelcomePage() {
  const [typingText] = useState("const collab = new CodeNest();")
  const [darkMode, setDarkMode] = useState(true)
  const [easterEggTriggered, setEasterEggTriggered] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const isMobile = useMobile()

  const { scrollYProgress } = useScroll()
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -300])
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -150])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 })
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 })

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: { clientX: any; clientY: any }) => {
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      mouseX.set((clientX - centerX) / 50)
      mouseY.set((clientY - centerY) / 50)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mouseX, mouseY])
  // Audio handling removed

  // Handle input for easter egg
  const handleInputChange = (e: { target: { value: any } }) => {
    const value = e.target.value
    setInputValue(value)

    if (value === ":party") {
      triggerConfetti()
      setEasterEggTriggered(true)
      setInputValue("")

      setTimeout(() => {
        setEasterEggTriggered(false)
      }, 5000)
    }
  }

  // Trigger confetti
  const triggerConfetti = () => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  // Features data
  const features = [
    {
      icon: <FileCode />,
      title: "Real-time Code Editor",
      description: "Edit code with syntax highlighting and instant synchronization across all collaborators.",
    },
    {
      icon: <Users />,
      title: "Collaborative Rooms",
      description: "Generate unique room IDs for seamless team collaboration with no setup required.",
    },
    {
      icon: <Globe />,
      title: "Global Connectivity",
      description: "Connect with developers worldwide with low-latency, real-time collaboration.",
    },
    {
      icon: <Zap />,
      title: "Zero Friction",
      description: "Start coding instantly with no downloads, installations, or complex configurations.",
    },
    {
      icon: <MessageSquare />,
      title: "Integrated Chat",
      description: "Communicate with your team without leaving the coding environment.",
    },
    {
      icon: <Bot />,
      title: "AI Assistant",
      description: "Get intelligent code suggestions and help from our built-in AI assistant.",
    },
    {
      icon: <Clock />,
      title: "Version History",
      description: "Access previous versions of your code with automatic history tracking.",
    },
    {
      icon: <Lock />,
      title: "Secure Sharing",
      description: "Control access to your code with customizable permission settings.",
    },
  ]

  return (
    <div className={cn("min-h-screen bg-black text-white overflow-x-hidden", darkMode ? "dark" : "")}>
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      </div>
      {/* Particle Effect */}
      <ParticleEffect /> {/* Audio Element removed */}
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Code className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              CodeNest
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Features
            </a>
            <a href="#demo" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Demo
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Testimonials
            </a>
          </div>{" "}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="hidden sm:flex border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              onClick={() => (window.location.href = "/login")}
            >
              Log In
            </Button>

            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300"
              onClick={() => (window.location.href = "/register")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative min-h-screen pt-24 overflow-hidden">
        <motion.div
          className="absolute top-20 left-0 text-[20rem] font-extrabold text-cyan-500/5 select-none pointer-events-none z-0"
          style={{ y: parallaxY }}
        >
          {"</>"}
        </motion.div>

        <motion.div
          className="absolute bottom-0 right-0 text-[15rem] font-extrabold text-cyan-500/5 select-none pointer-events-none z-0"
          style={{ y: parallaxY2 }}
        >
          {"{}"}
        </motion.div>

        <div className="container mx-auto px-4 pt-16 pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="flex flex-col items-start"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 px-4 py-1 text-sm">
                The Future of Collaborative Coding
              </Badge>
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  Real-Time Code.
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  Real-Time People.
                </span>
                <br />
                <span className="text-white">Zero Friction.</span>
              </motion.h1>
              <motion.p
                className="text-lg text-gray-300 mb-8 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                CodeNest brings developers together in a seamless, real-time collaborative coding environment. Share
                ideas, solve problems, and build the future—together.
              </motion.p>{" "}
              <motion.div
                className="flex flex-wrap gap-4 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 text-lg py-6 px-8"
                  onClick={() => (window.location.href = "/login")}
                >
                  Start Coding Now
                </Button>                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 transform hover:scale-105 text-lg py-6 px-8 group"
                  onClick={() => {
                    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Play className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  Watch Demo
                </Button>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.8 }}>
                <Terminal text={typingText} typing={true} />
              </motion.div>
            </motion.div>

            <motion.div
              className="h-[500px] w-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{
                x: !isMobile ? smoothMouseX : 0,
                y: !isMobile ? smoothMouseY : 0,
              }}
            >
              <HeroScene />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        </motion.div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 px-4 py-1 text-sm">
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              CodeNest combines powerful features with an intuitive interface to create the ultimate collaborative
              coding experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Demo Section */}
      <section id="demo" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 px-4 py-1 text-sm">
              See It In Action
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Real-Time Collaboration
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Watch as multiple developers work together in perfect harmony, with changes syncing instantly across all
              connected clients.
            </p>
          </motion.div>{" "}
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <InteractiveDemo />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 px-4 py-1 text-sm">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Loved by Developers
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of developers who are already using CodeNest to collaborate in real-time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "CodeNest revolutionized how our remote team collaborates. The real-time editing and integrated chat features are game changers!",
                author: "Alex Johnson",
                role: "Senior Developer",
                avatar: "A",
              },
              {
                text: "I use this for teaching programming classes. Being able to work with students in real-time has made remote learning so much more effective.",
                author: "Sarah Miller",
                role: "Computer Science Instructor",
                avatar: "S",
              },
              {
                text: "The AI assistant helped me solve a complex bug in minutes. This platform has become an essential part of our development workflow.",
                author: "Michael Chen",
                role: "Full Stack Developer",
                avatar: "M",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 20px rgba(76, 201, 240, 0.2)",
                  borderColor: "rgba(76, 201, 240, 0.3)",
                }}
              >
                <Card className="h-full backdrop-blur-sm bg-background/40 border-cyan-500/20 overflow-visible transition-all duration-300">
                  <div className="absolute -top-6 left-6">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-cyan-500/30">
                      {testimonial.avatar}
                    </div>
                  </div>
                  <div className="p-8 pt-10">
                    <div className="mb-4 text-yellow-400 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6">{testimonial.text}</p>
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 backdrop-blur-sm border border-cyan-500/30"
          >
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,transparent)]" />

            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <motion.div
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5,
                delay: 1,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to CodeNest?</h2>
                <p className="text-gray-300 text-lg mb-6">
                  Join thousands of developers who are already collaborating in real-time.
                </p>{" "}
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 text-lg py-6 px-8"
                  onClick={() => (window.location.href = "/login")}
                >
                  Start Coding Now
                </Button>
              </div>

              <div className="w-full max-w-sm">
                <Card className="bg-black/30 backdrop-blur-md border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div className="flex-1 text-right text-gray-400 text-sm">collaborative-room.js</div>
                    </div>
                    <div className="space-y-2 font-mono text-sm text-gray-300">
                      <div>
                        <span className="text-cyan-400">function</span>{" "}
                        <span className="text-green-400">createRoom</span>() {"{"}
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-400">const</span> roomId ={" "}
                        <span className="text-yellow-400">generateUniqueId</span>();
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-400">return</span> {"{"} id: roomId, users: [] {"}"}
                      </div>
                      <div>{"}"}</div>
                      <div className="mt-4">
                        <span className="text-green-400">// Users collaborating:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Alice is typing...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Bob is online</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Easter Egg Input */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
        <AnimatePresence>
          {easterEggTriggered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 p-4 rounded-lg text-center text-white"
            >
              🎉 Party mode activated! 🎉
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mt-4">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Try typing :party"
            className="w-full bg-black/30 backdrop-blur-md border border-cyan-500/30 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">Terminal</div>
        </div>
      </div>
      {/* Footer */}
      <footer className="py-12 border-t border-cyan-500/20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                  <Code className="h-4 w-4" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  CodeNest
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                The future of collaborative coding is here. Build together, in real-time.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-cyan-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} CodeNest. All rights reserved.</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch id="theme-toggle" checked={darkMode} onCheckedChange={setDarkMode} />
                <Label htmlFor="theme-toggle" className="text-gray-400 text-sm">
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </Label>
              </div>

              <div className="h-4 w-px bg-cyan-500/20" />

              <div className="font-mono text-sm text-gray-500 flex items-center gap-1">
                <span className="text-cyan-500">$</span>
                <span className="animate-pulse">▋</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
