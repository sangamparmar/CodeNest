"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Code } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { toast } from "../components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import "../styles/input-styles.css"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { setTheme } = useTheme()
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const navigate = useNavigate()
    // Split useEffect hooks for better hydration consistency
  useEffect(() => {
    // Apply dark theme immediately
    setTheme("dark")
  }, [setTheme])
  
  // Handle mounting separately to avoid hydration mismatch
  useEffect(() => {
    // Use requestAnimationFrame for smoother transitions
    const frame = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  // Generate particles for the background with deterministic values
  // Using a seeded approach to ensure client/server consistency
  const generateDeterministicValue = (index: number, multiplier: number = 1, offset: number = 0) => {
    // Create a deterministic value based on the index
    return (((index * 13) % 100) * multiplier / 100) + offset;
  };
  
  const particles = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    x: generateDeterministicValue(i, 100),
    y: generateDeterministicValue(i + 50, 100),
    size: generateDeterministicValue(i + 25, 3, 1),
    duration: generateDeterministicValue(i + 10, 20, 10),
    delay: generateDeterministicValue(i + 5, 10),
  }));

  const createNewRoomId = () => {
    setIsGenerating(true)
    setTimeout(() => {
      // Generate a 6 character alphanumeric room ID in the format "az549k"
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setRoomId(result);
      setIsGenerating(false)
    }, 600)
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return
    
    // Store username in sessionStorage
    sessionStorage.setItem('editorUsername', username)
    
    // Use React Router's navigate to go to the editor page immediately
    // Pass the username directly in the state to avoid sessionStorage issues
    navigate(`/editor/${roomId}`, {
      state: { username }
    })
  }

  const validateForm = () => {
    if (username.trim().length === 0) {
      toast({
        title: "Error",
        description: "Enter your username",
        variant: "destructive",
      })
      return false
    } else if (roomId.trim().length === 0) {
      toast({
        title: "Error",
        description: "Enter a room ID",
        variant: "destructive",
      })
      return false
    } else if (roomId.trim().length < 5) {
      toast({
        title: "Error",
        description: "Room ID must be at least 5 characters long",
        variant: "destructive",
      })
      return false
    } else if (username.trim().length < 3) {
      toast({
        title: "Error",
        description: "Username must be at least 3 characters long",
        variant: "destructive",
      })
      return false
    }
    return true
  }
  if (!mounted) return null
  return (
    <div className="relative h-screen flex flex-col items-center justify-between overflow-hidden bg-[#050816]" suppressHydrationWarning>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-cyan-500"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{
              opacity: 0.1,
              x: `${particle.x}%`,
              y: `${particle.y}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
              x: [`${particle.x}%`, `${particle.x + (Math.random() * 10 - 5)}%`],
              y: [`${particle.y}%`, `${particle.y + (Math.random() * 10 - 5)}%`],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Animated gradient orbs */}      <motion.div
        className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-700 rounded-full mix-blend-screen filter blur-[80px] opacity-30"
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          repeatDelay: 0, // Ensure consistent timing
        }}
      />      <motion.div
        className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-700 rounded-full mix-blend-screen filter blur-[80px] opacity-30"
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          repeatDelay: 0, // Ensure consistent timing
        }}
      />{/* Digital circuit lines */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#0ea5e9" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path
            d="M0,50 Q25,25 50,50 T100,50 T150,50 T200,50"
            stroke="url(#circuitGradient)"
            strokeWidth="1"
            fill="none"
            transform="translate(0, 100)"
          />
          <path
            d="M0,50 Q25,75 50,50 T100,50 T150,50 T200,50"
            stroke="url(#circuitGradient)"
            strokeWidth="1"
            fill="none"
            transform="translate(50, 200)"
          />
        </svg>
      </div>      {/* Main content */}
      <div className="container relative z-10 px-4 mx-auto flex flex-col items-center justify-center mt-6 mb-2">        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-4"
        >          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Code<span className="text-cyan-400">Nest</span>
            </span>
          </motion.h1>          <motion.p
            className="text-sm md:text-base max-w-2xl mx-auto mb-2 text-cyan-100/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Join a secure collaborative coding environment and build the future together
          </motion.p>
        </motion.div>        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="w-full max-w-sm"
        >
          <Card className="overflow-hidden border-0 bg-black/50 backdrop-blur-xl border border-cyan-900/50 shadow-[0_0_15px_rgba(8,145,178,0.2)]">
            <div className="p-4 sm:p-5">              <div className="mb-5 flex justify-center">
                <motion.div
                  className="h-12 w-12 rounded-md bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg"
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(8, 145, 178, 0.4)",
                      "0 0 20px rgba(8, 145, 178, 0.6)",
                      "0 0 0 rgba(8, 145, 178, 0.4)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Code className="h-6 w-6 text-white" />
                </motion.div>
              </div>

              <h2 className="text-center text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                Access Terminal
              </h2>              <form onSubmit={handleJoinRoom} className="space-y-5">
                <div>
                  <label className="neon-label mb-2 block">ROOM ID</label>
                  <div className="neon-input-wrapper compact">
                    <div className="neon-icon-container">
                      <motion.div
                        className="neon-icon"
                        initial={{ rotate: 0 }}
                        animate={{
                          rotate: isGenerating ? [0, 360] : 0,
                        }}
                        transition={{ duration: 1, repeat: isGenerating ? Number.POSITIVE_INFINITY : 0 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                        </svg>
                      </motion.div>
                    </div>
                    <Input
                      type="text"
                      placeholder="Enter secure room ID"
                      className="neon-input"
                      value={roomId}
                      onChange={(e: { target: { value: React.SetStateAction<string> } }) => setRoomId(e.target.value)}
                    />
                    <div className="input-glow"></div>
                  </div>
                </div>                <div>
                  <label className="neon-label mb-2 block">USERNAME</label>
                  <div className="neon-input-wrapper compact">
                    <div className="neon-icon-container">
                      <div className="neon-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    </div>
                    <Input
                      type="text"
                      placeholder="Choose your identity"
                      className="neon-input"
                      value={username}
                      onChange={(e: { target: { value: React.SetStateAction<string> } }) => setUsername(e.target.value)}
                    />
                    <div className="input-glow"></div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="relative w-full py-6 text-lg font-semibold overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0 shadow-[0_0_15px_rgba(8,145,178,0.5)]"
                  >
                    <span className="relative z-10">Initialize Session</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </Button>
                </motion.div>                <motion.button
                  type="button"
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 text-sm font-medium text-cyan-400 transition-all border border-cyan-900/50 bg-black/50 hover:bg-cyan-900/20 hover:text-cyan-300 hover:border-cyan-600/50 relative overflow-hidden"
                  style={{ 
                    clipPath: "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))" 
                  }}
                  onClick={createNewRoomId}
                  whileHover={{ 
                    boxShadow: "0 0 15px rgba(8, 145, 178, 0.4)",
                    scale: 1.01
                  }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isGenerating}
                >
                  <span className="absolute bg-gradient-to-r from-cyan-500/10 to-transparent w-10 h-full left-0 top-0 transform -skew-x-12 animate-shimmer"></span>
                  {isGenerating ? (
                    <svg
                      className="animate-spin h-4 w-4 mr-1 text-cyan-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-cyan-400"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  )}
                  <span className="relative z-10">Generate Secure Room ID</span>
                </motion.button>
              </form>
            </div>
          </Card>
        </motion.div>      </div>

      {/* Removed animated tech rings */}      {/* Futuristic data streams - deterministic for hydration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => {
          // Use the deterministic function we created earlier
          const streamWidth = generateDeterministicValue(i + 100, 200, 100);
          const streamLeft = generateDeterministicValue(i + 200, 100);
          const streamTop = generateDeterministicValue(i + 300, 100);
          const animDuration = generateDeterministicValue(i + 400, 3, 2);
          const animDelay = generateDeterministicValue(i + 500, 5);
          
          return (
            <motion.div
              key={`stream-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
              style={{
                width: `${streamWidth}px`,
                left: `${streamLeft}%`,
                top: `${streamTop}%`,
                opacity: 0.3,
              }}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{
                x: ["-100%", "200%"],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: animDuration,
                repeat: Number.POSITIVE_INFINITY,
                delay: animDelay,
                ease: "linear",
                repeatDelay: 0, // Ensure consistent timing
              }}
            />
          );
        })}
      </div>

      {/* Footer */}
      <motion.footer
        className="w-full py-6 px-4 mt-auto text-center text-cyan-500/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="container mx-auto">
          <p className="font-medium">&copy; {new Date().getFullYear()} CodeNest. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-3">
            <div className="h-1 w-1 rounded-full bg-cyan-500"></div>
            <div className="h-1 w-1 rounded-full bg-purple-500"></div>
            <div className="h-1 w-1 rounded-full bg-cyan-500"></div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
