"use client"

import React from "react"
import { useState, type FormEvent, useEffect, useRef } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./auth.css"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"

// Use the same backend URL definition as in Register.tsx
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [statusMessage, setStatusMessage] = useState<string>("")
  const navigate = useNavigate()
  const terminalRef = useRef<HTMLDivElement>(null)
  // Terminal typing effect with proper cleanup
  useEffect(() => {
    if (statusMessage && terminalRef.current) {
      const terminal = terminalRef.current
      terminal.innerHTML = ""; // Clear previous content
      const txt = `> ${statusMessage}`
      
      // Display full message immediately instead of typing it character by character
      terminal.textContent = txt;
      
      // Add blinking cursor after the text
      const cursorSpan = document.createElement('span');
      cursorSpan.className = 'cursor';
      cursorSpan.textContent = '_';
      terminal.appendChild(cursorSpan);
    }
  }, [statusMessage])

  // Particle animation
  useEffect(() => {
    const canvas = document.getElementById("particles") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
    }[] = []

    const createParticles = () => {
      const particleCount = 100
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(
            Math.random() * 100 + 155,
          )}, 255, ${Math.random() * 0.5 + 0.25})`,
        })
      }
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY

        if (p.x > canvas.width) p.x = 0
        if (p.x < 0) p.x = canvas.width
        if (p.y > canvas.height) p.y = 0
        if (p.y < 0) p.y = canvas.height
      }

      requestAnimationFrame(animateParticles)
    }

    createParticles()
    animateParticles()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    setStatusMessage("Authenticating credentials...")

    try {      const normalizedEmail = email.trim().toLowerCase()      // Minimal delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 100))

      const result = await axios.post(`${BACKEND_URL}/login`, {
        email: normalizedEmail,
        password,
      });
      if (result.data.message === "Login successful") {
        setStatusMessage("Authentication successful. Establishing secure connection...")
        // Very minimal delay for visual feedback
        await new Promise((resolve) => setTimeout(resolve, 50))
          localStorage.setItem("authToken", result.data.token)
        localStorage.setItem("username", normalizedEmail.split("@")[0])
        setStatusMessage("Connection established. Initializing room creation interface...")

        // Very minimal delay for visual feedback
        await new Promise((resolve) => setTimeout(resolve, 50))

        alert("Login successful!")
        navigate("/HomePage")
      } else {
        setStatusMessage("Authentication failed. Invalid credentials.")
        setErrorMessage("Invalid email or password. Please try again.")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setStatusMessage("Error encountered during authentication process.")

      if (error.response && error.response.data) {
        const message = error.response.data.message || "An error occurred during login. Please try again."
        setErrorMessage(message)

        if (error.response.status === 403 && error.response.data.needsVerification) {
          const resendConfirm = window.confirm(
            "Your email has not been verified. Would you like to resend the verification email?",
          )

          if (resendConfirm) {
            try {
              setStatusMessage("Resending verification code...")
              const emailToResend = email.trim().toLowerCase()
              const resendResult = await axios.post(`${BACKEND_URL}/resend-otp`, { email: emailToResend })
              alert(resendResult.data.message || "Verification email sent. Please check your inbox.")
              navigate("/register")
            } catch (resendError: any) {
              console.error("Resend OTP error:", resendError)
              setStatusMessage("Failed to resend verification code.")
              alert("Failed to resend verification email. Please try again.")
            }
          }
        }
      } else {
        setErrorMessage("An error occurred during login. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="futuristic-auth-container">
      <canvas id="particles" className="particles-canvas"></canvas>
      <div className="cyber-grid"></div>

      <motion.div
        className="futuristic-auth-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}      >
        <div className="card-glow"></div>

        <div className="futuristic-auth-header">
          <h2>
            <span className="text-gradient">CodeNest</span>
            <span className="header-subtitle">Access Terminal</span>
          </h2>
        </div>

        {errorMessage && (
          <motion.div
            className="futuristic-auth-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errorMessage}
          </motion.div>
        )}
        
        <div className="terminal-container">
          <div ref={terminalRef} className="terminal-text">
            {!statusMessage && "> System ready. Awaiting credentials..."}
          </div>
        </div>
          <form onSubmit={handleSubmit} className="futuristic-auth-form">
          <div className="input-group mt-3 mb-4">
            <label htmlFor="email">
              <span className="label-icon">⟨⟩</span>
              Email Address
            </label>
            <div className="futuristic-input-wrapper">
              <span className="input-icon">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="futuristic-input"
                autoComplete="username"
              />
              <span className="input-glow"></span>
            </div>
          </div>

          <div className="input-group mb-4">
            <label htmlFor="password">
              <span className="label-icon">⟨⟩</span>
              Password
            </label>
            <div className="futuristic-input-wrapper">
              <span className="input-icon">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="futuristic-input"
                autoComplete="current-password"
              />
              <span className="input-glow"></span>
            </div>
          </div>          <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
            <div className="futuristic-checkbox">
              <input className="futuristic-checkbox-input" type="checkbox" id="rememberMe" />
              <label className="futuristic-checkbox-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="futuristic-link">
              Forgot Password?
            </Link>
          </div><motion.button
            type="submit"
            className="futuristic-button"
            disabled={isLoading}
            whileHover={{ scale: 1.03, boxShadow: "0 0 20px 5px rgba(0, 195, 255, 0.7)" }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
          >
            {isLoading ? (
              <div className="button-content">
                <div className="cyber-spinner"></div>
                <span>Authenticating...</span>
              </div>
            ) : (
              <div className="button-content">
                <span>Sign In</span>
                <span className="button-glow"></span>
              </div>
            )}
          </motion.button>
        </form>

        <div className="futuristic-auth-link">
          <p>Don't have an account?</p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
          >
            <Link to="/register" className="futuristic-alt-button">
              <span>Create Account</span>
              <span className="button-glow"></span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
