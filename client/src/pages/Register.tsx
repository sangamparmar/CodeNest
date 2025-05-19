"use client"

import React, { useState, type FormEvent, useEffect, useRef } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./auth.css"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

const Register: React.FC = () => {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showOtpVerification, setShowOtpVerification] = useState<boolean>(false)
  const [otp, setOtp] = useState<string>("")
  const [otpError, setOtpError] = useState<string>("")
  const [statusMessage, setStatusMessage] = useState<string>("")
  const navigate = useNavigate()
  const terminalRef = useRef<HTMLDivElement>(null)  // Terminal typing effect with proper cleanup
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
    const canvas = document.getElementById("particles-register") as HTMLCanvasElement
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
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setStatusMessage("Initializing registration protocol...")

    try {
      // Minimal delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 150))

      setStatusMessage("Validating credentials...")

      // Minimal delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 100))

      const result = await axios.post(`${BACKEND_URL}/register`, { username, name, email, password })

      if (result.data.needsVerification) {
        setStatusMessage("Registration successful. Verification required.")
        setShowOtpVerification(true)
        setOtpError("")
        alert(result.data.message)
      } else if (result.data === "Already registered") {
        setStatusMessage("Error: Email already exists in database.")
        alert("E-mail already registered! Please login to proceed.")
        navigate("/login")
      } else {
        setStatusMessage("Registration successful. Redirecting to login portal...")
        alert("Registered successfully! Please login to proceed.")
        navigate("/login")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      setStatusMessage("Error encountered during registration process.")
      if (error.response && error.response.data) {
        alert(error.response.data.message || "An error occurred during registration.")
      } else {
        alert("An error occurred during registration. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setOtpError("")
    setStatusMessage("Verifying security code...")

    try {
      // Minimal delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 150))

      const result = await axios.post(`${BACKEND_URL}/verify-otp`, { email, otp })
      setStatusMessage("Verification successful. Finalizing account setup...")

      // Minimal delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 100))

      alert(result.data.message)
      navigate("/login")
    } catch (error: any) {
      console.error("OTP verification error:", error)
      setStatusMessage("Verification failed. Invalid security code.")
      if (error.response && error.response.data) {
        setOtpError(error.response.data.message || "Invalid OTP. Please try again.")
      } else {
        setOtpError("An error occurred during verification. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true)
    setStatusMessage("Generating new security code...")
    try {
      // Minimal delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 150))

      const result = await axios.post(`${BACKEND_URL}/resend-otp`, { email })
      setStatusMessage("New security code sent successfully.")
      alert(result.data.message)
    } catch (error: any) {
      console.error("Resend OTP error:", error)
      setStatusMessage("Failed to generate new security code.")
      if (error.response && error.response.data) {
        alert(error.response.data.message || "Failed to resend OTP.")
      } else {
        alert("Failed to resend OTP. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="futuristic-auth-container">
      <canvas id="particles-register" className="particles-canvas"></canvas>
      <div className="cyber-grid"></div>

      <motion.div
        className="futuristic-auth-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="card-glow"></div>

        {!showOtpVerification ? (
          <>
            <div className="futuristic-auth-header">
              <h2>
                <span className="text-gradient">Create Account</span>
                <span className="header-subtitle">Registration Portal</span>
              </h2>
            </div>

            <div className="terminal-container">
              <div ref={terminalRef} className="terminal-text">
                {!statusMessage && "> New user registration. Enter your details..."}
              </div>
            </div>            <form onSubmit={handleSubmit} className="futuristic-auth-form">
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
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="futuristic-input"
                    autoComplete="username"
                  />
                  <span className="input-glow"></span>
                </div>
              </div>              <div className="input-group mb-4">
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
                    name="password" 
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="futuristic-input"
                    autoComplete="new-password"
                  />
                  <span className="input-glow"></span>
                </div>
              </div><div className="futuristic-row mb-4">
                <div className="futuristic-col">
                  <label htmlFor="username">
                    <span className="label-icon">⟨⟩</span>
                    Username
                  </label>
                  <div className="futuristic-input-wrapper">
                    <span className="input-icon">
                      <i className="bi bi-person-badge-fill"></i>
                    </span>
                    <input
                      type="text"
                      id="username"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="futuristic-input"
                    />
                    <span className="input-glow"></span>
                  </div>
                </div>
                
                <div className="futuristic-col">
                  <label htmlFor="name">
                    <span className="label-icon">⟨⟩</span>
                    Full Name
                  </label>
                  <div className="futuristic-input-wrapper">
                    <span className="input-icon">
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="futuristic-input"
                    />
                    <span className="input-glow"></span>
                  </div>
                </div>
              </div>              <div className="futuristic-checkbox mb-4 mt-3">
                <input className="futuristic-checkbox-input" type="checkbox" id="termsCheck" required />
                <label className="futuristic-checkbox-label" htmlFor="termsCheck">
                  I agree to the <Link to="/terms" className="futuristic-link">Terms of Service</Link> and{" "}
                  <Link to="/privacy" className="futuristic-link">Privacy Policy</Link>
                </label>
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
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="button-content">
                    <span>Register</span>
                    <span className="button-glow"></span>
                  </div>
                )}
              </motion.button>
            </form>

            <div className="futuristic-auth-link">
              <p>Already have an account?</p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
              >
                <Link to="/login" className="futuristic-alt-button">
                  <span>Sign In</span>
                  <span className="button-glow"></span>
                </Link>
              </motion.div>
            </div>
          </>
        ) : (
          <>
            <div className="futuristic-auth-header">
              <h2>
                <span className="text-gradient">Verify Account</span>
                <span className="header-subtitle">Security Protocol</span>
              </h2>
            </div>

            <div className="terminal-container">
              <div ref={terminalRef} className="terminal-text">
                {!statusMessage && "> Enter verification code sent to your email..."}
              </div>
            </div>

            <div className="otp-container mb-3">
              {otpError && (
                <motion.div
                  className="futuristic-auth-error mb-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {otpError}
                </motion.div>
              )}
            </div>

            <form onSubmit={handleVerifyOtp} className="futuristic-auth-form">              <div className="input-group mt-2 mb-4">
                <label htmlFor="otp">
                  <span className="label-icon">⟨⟩</span>
                  Verification Code
                </label>
                <div className="futuristic-input-wrapper otp-input-wrapper">
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="futuristic-input otp-input"
                    maxLength={6}
                  />
                  <span className="input-glow"></span>
                </div>
              </div>              <motion.button
                type="submit"
                className="futuristic-button mb-3"
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
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <div className="button-content">
                    <span>Verify Code</span>
                    <span className="button-glow"></span>
                  </div>
                )}
              </motion.button>
            </form>

            <div className="futuristic-action-buttons">
              <button
                onClick={handleResendOtp}
                className="futuristic-text-button"
                disabled={isLoading}
              >
                Resend Code
              </button>

              <button
                onClick={() => navigate("/login")}
                className="futuristic-text-button"
                disabled={isLoading}
              > 
                Back to Login
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default Register
