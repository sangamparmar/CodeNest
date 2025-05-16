"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Text3D, Float, Sparkles, PerspectiveCamera, Line } from "@react-three/drei"
import * as THREE from "three"
import { LucideCode, LucideTerminalSquare, LucideUsers, LucideZap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

// Typing animation component
const TypingAnimation = ({ texts }: { texts: string[] }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(80)

  useEffect(() => {
    const currentText = texts[currentTextIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length + 1))
        setTypingSpeed(80)

        if (displayText === currentText) {
          setTypingSpeed(2000)
          setIsDeleting(true)
        }
      } else {
        setDisplayText(currentText.substring(0, displayText.length - 1))
        setTypingSpeed(40)

        if (displayText === "") {
          setIsDeleting(false)
          setCurrentTextIndex((currentTextIndex + 1) % texts.length)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [displayText, currentTextIndex, isDeleting, texts, typingSpeed])

  return (
    <div className="font-mono text-xs sm:text-sm text-cyan-400 h-6 opacity-70">
      <span className="text-purple-400">{">"}</span> {displayText}
      <span className="animate-pulse">_</span>
    </div>
  )
}

// Hex Grid Background
const HexGrid = () => {
  const { viewport } = useThree()
  const hexSize = 0.4
  const spacing = hexSize * 1.8
  const rows = Math.ceil(viewport.height / spacing) + 5
  const cols = Math.ceil(viewport.width / spacing) + 5

  const hexagons = []
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = (j + (i % 2) * 0.5) * spacing - viewport.width / 2 - spacing * 2
      const y = i * spacing * 0.866 - viewport.height / 2 - spacing * 2
      const z = -5

      // Add some variation to make it more interesting
      const opacity = Math.random() * 0.15 + 0.05
      const scale = Math.random() * 0.3 + 0.7

      hexagons.push(
        <mesh key={`${i}-${j}`} position={[x, y, z]} scale={scale}>
          <ringGeometry args={[hexSize * 0.9, hexSize, 6]} />
          <meshBasicMaterial color="#8b5cf6" opacity={opacity} transparent />
        </mesh>,
      )
    }
  }

  return <>{hexagons}</>
}

// Floating Code Cubes
const CodeCubes = () => {
  const cubeRefs = useRef<THREE.Mesh[]>([])
  const cubeCount = 15
  const cubeData = useRef(
    Array.from({ length: cubeCount }, () => ({
      position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10 - 10],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.01 + 0.005,
      rotationSpeed: Math.random() * 0.005 + 0.002,
    })),
  )

  useFrame((state) => {
    cubeRefs.current.forEach((cube, i) => {
      if (!cube) return

      const data = cubeData.current[i]

      // Rotate the cube
      cube.rotation.x += data.rotationSpeed
      cube.rotation.y += data.rotationSpeed * 1.3

      // Move the cube in a floating pattern
      cube.position.y += Math.sin(state.clock.elapsedTime * data.speed) * 0.01
    })
  })

  return (
    <>
      {cubeData.current.map((data, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) cubeRefs.current[i] = el
          }}
          position={data.position as [number, number, number]}
          rotation={data.rotation as [number, number, number]}
          scale={data.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#06b6d4" : i % 3 === 1 ? "#8b5cf6" : "#f472b6"}
            metalness={0.8}
            roughness={0.2}
            emissive={i % 3 === 0 ? "#06b6d4" : i % 3 === 1 ? "#8b5cf6" : "#f472b6"}
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </>
  )
}

// Orbital Lines
const OrbitalLines = () => {
  const lineRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.rotation.z = clock.getElapsedTime() * 0.1
      lineRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2
    }
  })

  const points = []
  const radius = 8
  const segments = 64

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0))
  }

  return (
    <group>
      <group ref={lineRef}>
        <Line
          points={points}
          color="#8b5cf6"
          opacity={0.3}
          transparent
          lineWidth={1} derivatives={undefined}        />
      </group>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <Line
          points={points}
          color="#06b6d4"
          opacity={0.2}
          transparent
          lineWidth={1} derivatives={undefined}        />
      </group>
      <group rotation={[0, Math.PI / 2, 0]}>
        <Line
          points={points}
          color="#f472b6"
          opacity={0.2}
          transparent
          lineWidth={1} derivatives={undefined}        />
      </group>
    </group>
  )
}

// CodeNest Orb
const CodeNestOrb = () => {
  const orbRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = clock.getElapsedTime() * 0.2
      orbRef.current.rotation.z = clock.getElapsedTime() * 0.1
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime()) * 0.05)
    }
  })

  return (
    <group position={[0, 0, -15]}>
      <mesh ref={orbRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} emissive="#8b5cf6" emissiveIntensity={0.2} />
      </mesh>      <mesh ref={glowRef} scale={1.2}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.1} />
      </mesh>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          position={[-1.5, 0, 2.1]}
          rotation={[0, 0, 0]}
          size={0.5}
          height={0.1}
          curveSegments={12}
        >
          CODE
          <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.5} />
        </Text3D>

        <Text3D
          font="/fonts/Inter_Bold.json"
          position={[-1.5, -0.7, 2.1]}
          rotation={[0, 0, 0]}
          size={0.5}
          height={0.1}
          curveSegments={12}
        >
          NEST
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
        </Text3D>
      </Float>
    </group>
  )
}

// Main 3D Scene
const Scene = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame(() => {
    if (cameraRef.current) {
      // Subtle camera movement based on mouse position
      cameraRef.current.position.x += (mousePosition.x * 2 - cameraRef.current.position.x) * 0.01
      cameraRef.current.position.y += (mousePosition.y * 1 - cameraRef.current.position.y) * 0.01
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={75} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={0.2} />

      <Suspense fallback={null}>
        <Environment preset="night" />
        <HexGrid />
        <CodeCubes />
        <OrbitalLines />
        <CodeNestOrb />
        <Sparkles count={100} scale={20} size={2} speed={0.3} opacity={0.2} />
      </Suspense>
    </>
  )
}

// Form Component
const RoomForm = () => {
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const navigate = useNavigate()
  
  // Clear previously stored values when visiting the room creation page
  useEffect(() => {
    // We keep the username in memory but clear it from form
    setUsername("")
    setRoomId("")
  }, [])
    const handleCreateRoom = () => {
    if (!username) return
    
    setIsCreating(true)
    
    // Generate a random room ID if one wasn't provided
    const finalRoomId = roomId || Math.random().toString(36).substring(2, 8).toUpperCase()
    
    // Store only username in localStorage for persistence across sessions
    localStorage.setItem('codenest-username', username)
    
    // Simulate API call
    setTimeout(() => {
      setIsCreating(false)
      
      // Navigate to the editor page with the roomId and username
      navigate(`/editor/${finalRoomId}`, {
        state: { username, roomId: finalRoomId }
      })
    }, 2000)
  }
  const handleJoinRoom = () => {
    if (!username || !roomId) return
    
    setIsJoining(true)
    
    // Store only username in localStorage for persistence across sessions
    localStorage.setItem('codenest-username', username)
    
    // Simulate API call
    setTimeout(() => {
      setIsJoining(false)
      
      // Navigate to the editor page with the roomId and username
      navigate(`/editor/${roomId}`, {
        state: { username, roomId }
      })
    }, 2000)
  }

  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="create" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
          Create Room
        </TabsTrigger>
        <TabsTrigger value="join" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
          Join Room
        </TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="space-y-4">
        <div className="space-y-4">          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-200 block mb-2">
              Your Username
            </label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}              className="bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white"
              style={{ zIndex: 100 }}
            />
          </div>          <div>
            <label htmlFor="room-id" className="text-sm font-medium text-gray-200 block mb-2">
              Room ID (Optional)
            </label>
            <div className="flex gap-2">
              <Input
                id="room-id"
                placeholder="Enter room ID or generate random"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}                className="bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white flex-grow"
                style={{ zIndex: 100 }}
              />                <Button 
                onClick={() => setRoomId(Math.random().toString(36).substring(2, 8).toUpperCase())}
                className="bg-gray-700 hover:bg-gray-600 px-3 text-white text-xs"                title="Generate random Room ID"
                style={{ zIndex: 100 }}
              >
                Generate
              </Button>
            </div>
          </div>            <Button
              onClick={handleCreateRoom}
              disabled={!username || isCreating}              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] relative overflow-hidden group"
              style={{ zIndex: 100 }}
            >
            {isCreating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Room...
              </span>
            ) : (
              <>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/0 via-purple-400/30 to-purple-600/0 -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                Create New Room
              </>
            )}
          </Button>
        </div>

        <TypingAnimation
          texts={[
            "Generating secure nest...",
            "Initializing real-time sync...",
            "Preparing collaborative environment...",
            "Setting up code compiler...",
          ]}
        />
      </TabsContent>

      <TabsContent value="join" className="space-y-4">
        <div className="space-y-4">          <div>
            <label htmlFor="username-join" className="text-sm font-medium text-gray-200 block mb-2">
              Your Username
            </label>            <Input
              id="username-join"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
              style={{ zIndex: 100 }}
            />
          </div>

          <div>
            <label htmlFor="room-id" className="text-sm font-medium text-gray-200 block mb-2">
              Room ID
            </label>            <Input
              id="room-id"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
              style={{ zIndex: 100 }}
            />
          </div>          <Button
            onClick={handleJoinRoom}
            disabled={!username || !roomId || isJoining}            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] relative overflow-hidden group"
            style={{ zIndex: 100 }}
          >
            {isJoining ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Joining Room...
              </span>
            ) : (
              <>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-600/0 via-cyan-400/30 to-cyan-600/0 -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                Join Room
              </>
            )}
          </Button>
        </div>

        <TypingAnimation
          texts={[
            "Connecting to nest...",
            "Syncing with collaborators...",
            "Preparing workspace...",
            "Loading code history...",
          ]}
        />
      </TabsContent>
    </Tabs>
  )
}

// Main Component
export default function RoomCreationPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Force dark theme
    document.documentElement.classList.remove("light")
    document.documentElement.classList.add("dark")

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: -(e.clientY / window.innerHeight - 0.5),
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Background */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <Canvas>
          <Scene mousePosition={mousePosition} />
        </Canvas>
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-md flex justify-between items-center"
        style={{
          backgroundColor: "rgba(15, 15, 20, 0.7)",
          borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CodeNest</h1>
        </motion.div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-screen">
        <motion.div
          className="w-full max-w-md px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
              type: "spring",
              stiffness: 100,
            }}
          >
            {/* Animated border glow effect */}
            <motion.div
              className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur-sm"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <Card className="relative bg-gray-900/80 backdrop-blur-xl border-gray-800 p-6 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.3)]">
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              />              <div className="mb-6 text-center">
                <motion.h2
                  className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Create or Join a Room
                </motion.h2>
                <motion.p
                  className="text-gray-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  Start collaborating in real-time with your team
                </motion.p>
              </div>

              <div style={{ position: 'relative', zIndex: 200 }}>
                <RoomForm />
              </div>

              <motion.div
                className="mt-6 grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <div className="flex items-center text-xs text-gray-400">
                  <LucideUsers className="w-4 h-4 mr-2 text-purple-500" />
                  <span>Multiple users</span>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <LucideCode className="w-4 h-4 mr-2 text-cyan-500" />
                  <span>Code sharing</span>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <LucideZap className="w-4 h-4 mr-2 text-purple-500" />
                  <span>Real-time sync</span>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <LucideTerminalSquare className="w-4 h-4 mr-2 text-cyan-500" />
                  <span>Terminal access</span>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
