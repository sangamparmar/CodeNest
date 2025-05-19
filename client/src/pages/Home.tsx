"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
// Removed useTheme import
import ParticleBackground from "@/components/particle-background"
import CodeEditor from "@/components/code-editor"
import ChatInterface from "@/components/chat-interface"
import DrawingBoard from "@/components/drawing-board"
import {
  Code,
  MessageSquare,
  PenTool,
  Users,
  Zap,
  Globe,
  Github,
  Twitter,
  Linkedin,
  ChevronDown,
  Menu,
  X,
  Terminal,
}from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WelcomePage() {  const [activeTab, setActiveTab] = useState("code")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  // Theme functionality removed
  const mainRef = useRef<HTMLDivElement>(null)
  
  // Handle tab change without scrolling
  const handleTabChange = (value: string) => {
    // Store current scroll position
    const scrollPos = window.scrollY;
    
    // Set the active tab
    setActiveTab(value);
    
    // Prevent scroll jumping by maintaining position after state update
    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPos,
        behavior: "auto" // Use "auto" to prevent smooth scrolling animation
      });
    });
  };

  // Simulate loading sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Handle scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/80 via-black/70 to-black/60 text-white overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Loading Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center">
                <Terminal className="text-black" size={24} />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-400">
                CodeNest
              </h1>
            </motion.div>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-violet-600 to-cyan-400"
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-gray-400"
            >
              Initializing collaborative environment...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-violet-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center">
                <Terminal className="text-black" size={16} />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-400">
                CodeNest
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-300 hover:text-violet-400 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("demo")}
                className="text-gray-300 hover:text-violet-400 transition-colors"
              >
                Demo
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-300 hover:text-violet-400 transition-colors"
              >
                About
              </button>              <Button 
                variant="outline" 
                className="border-violet-500/50 text-violet-400 hover:bg-violet-500/20 hover:text-white"
                onClick={() => window.location.href = '/login'}
              >
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white"
                onClick={() => window.location.href = '/register'}
              >
                Sign Up
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/90 backdrop-blur-md border-b border-violet-500/20"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="py-2 text-gray-300 hover:text-violet-400 transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("demo")}
                  className="py-2 text-gray-300 hover:text-violet-400 transition-colors"
                >
                  Demo
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="py-2 text-gray-300 hover:text-violet-400 transition-colors"
                >
                  About
                </button>
                <div className="flex gap-4 mt-2">                  <Button
                    variant="outline"
                    className="flex-1 border-violet-500/50 text-violet-400 hover:bg-violet-500/20 hover:text-white"
                    onClick={() => window.location.href = '/login'}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white"
                    onClick={() => window.location.href = '/register'}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main ref={mainRef} className="pt-20">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-5rem)] flex flex-col justify-center relative overflow-hidden">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight flex flex-col">
                    <span className="text-white">Real-Time Code.</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                      Real-Time People.
                    </span>
                    <span className="text-white font-extrabold">Zero Friction.</span>
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <p className="text-xl text-gray-300 mb-8 max-w-xl">
                    CodeNest brings together live coding, chat, and real-time creativity in one seamless platform.
                    Build, share, and create together.
                  </p>
                </motion.div>                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                  className="flex flex-wrap gap-4"
                >                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white"
                    onClick={() => window.location.href = '/register'}
                  >
                    Get Started Now
                  </Button><Button
                    size="lg"
                    variant="outline"
                    className="border-violet-500/50 text-violet-400 hover:bg-violet-500/20 hover:text-white"
                    onClick={() => scrollToSection("demo")}
                  >
                    Watch Demo
                  </Button>
                </motion.div><motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                  className="mt-12"
                >
                  <p className="text-gray-400 mb-3 flex items-center gap-2">
                    <span className="text-violet-400">
                      <Users size={16} />
                    </span>
                    Trusted by developers from all around the world
                  </p>
                  <p className="text-gray-500 text-sm">
                    Join our growing community of programmers building the future together
                  </p>
                </motion.div>
              </div>              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 1.5 }}
                className="relative"
              >
                <div className="relative z-10 bg-black/40 backdrop-blur-md border border-violet-500/20 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between gap-2 px-4 py-2 bg-black/60 border-b border-violet-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 text-center text-gray-400 text-xs">codenest-live-collaboration</div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-xs text-green-500">3 online</span>
                    </div>
                  </div>
                  
                  <div className="p-4 font-mono text-sm h-[350px] overflow-hidden bg-gradient-to-b from-gray-900 to-black">
                    {/* Interactive Code Collaboration Visualization */}
                    <div className="h-full relative">
                      {/* 3D-like code editor visualization */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.9 }}
                        className="mb-6"
                      >
                        <TerminalAnimation delay={2.0} />
                      </motion.div>
                      
                      {/* Visual effects */}
                      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"></div>
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-purple-500/20 rounded-xl blur-xl -z-10" />
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/5 to-cyan-500/5 rounded-lg -z-5" />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-400 hover:text-violet-400 transition-colors flex flex-col items-center"
            >
              <p className="mb-2">Explore Features</p>
              <ChevronDown size={24} className="animate-bounce" />
            </button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-400">
                    Powerful Features
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Everything you need for seamless collaboration in one platform
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Code size={24} />}
                title="Real-Time Code Editor"
                description="Collaborate on code in real-time with syntax highlighting, auto-completion, and multiple language support."
                delay={0.1}
              />
              <FeatureCard
                icon={<MessageSquare size={24} />}
                title="Integrated Chat"
                description="Communicate with your team without leaving the platform. Share ideas, links, and code snippets."
                delay={0.2}
              />
              <FeatureCard
                icon={<PenTool size={24} />}
                title="Collaborative Drawing"
                description="Sketch ideas, create diagrams, and visualize concepts together on a shared canvas."
                delay={0.3}
              />
              <FeatureCard
                icon={<Users size={24} />}
                title="Team Management"
                description="Create and manage teams, assign roles, and control access to your projects."
                delay={0.4}
              />
              <FeatureCard
                icon={<Zap size={24} />}
                title="Instant Deployment"
                description="Deploy your code directly from the editor to popular hosting platforms with one click."
                delay={0.5}
              />
              <FeatureCard
                icon={<Globe size={24} />}
                title="Global Accessibility"
                description="Access your projects from anywhere in the world, on any device, at any time."
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="py-20 bg-gradient-to-b from-transparent to-violet-950/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-400">
                    Interactive Demo
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Experience the power of CodeNest with our interactive demo
                </p>
              </motion.div>
            </div>            <div className="max-w-5xl mx-auto">              <Tabs defaultValue="code" value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/50 border border-violet-500/20">                  <TabsTrigger
                    value="code" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400"
                  >
                    <Code size={16} className="mr-2" />
                    Code Editor
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400"
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Live Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="draw"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400"
                  >
                    <PenTool size={16} className="mr-2" />
                    Drawing Board
                  </TabsTrigger>
                </TabsList>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black/40 backdrop-blur-md border border-violet-500/20 rounded-xl overflow-hidden"
                >                  <TabsContent value="code" className="m-0 focus:outline-none" onFocus={(e) => e.preventDefault()}>
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="focus:outline-none"
                      tabIndex={-1}
                    >
                      <CodeEditor />
                    </div>
                  </TabsContent>
                  <TabsContent value="chat" className="m-0 focus:outline-none" onFocus={(e) => e.preventDefault()}>
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="focus:outline-none"
                      tabIndex={-1}
                      id="chat-interface-container"
                    >
                      <ChatInterface />
                    </div>
                  </TabsContent>
                  <TabsContent value="draw" className="m-0 focus:outline-none" onFocus={(e) => e.preventDefault()}>
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="focus:outline-none"
                      tabIndex={-1}
                    >
                      <DrawingBoard />
                    </div>
                  </TabsContent>
                </motion.div>
              </Tabs>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-400">
                    About CodeNest
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  CodeNest was born from a simple idea: make collaboration between developers seamless, intuitive, and
                  enjoyable.
                </p>
                <p className="text-gray-400 mb-6">
                  Our platform combines the best tools for coding, communication, and creativity in one unified
                  interface. Whether you're working with a team across the globe or pair programming with a colleague,
                  CodeNest provides the environment you need to build amazing things together.
                </p>
                <p className="text-gray-400 mb-8">
                  Founded by a team of developers who were frustrated with juggling multiple tools and platforms,
                  CodeNest is designed by developers, for developers.
                </p>
                <Button className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white">
                  Learn More About Us
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="relative z-10 bg-black/40 backdrop-blur-md border border-violet-500/20 rounded-xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-violet-500/10 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                        <Code size={24} className="text-violet-400" />
                      </div>
                      <h3 className="font-bold mb-2">10,000+</h3>
                      <p className="text-gray-400 text-sm">Active Developers</p>
                    </div>
                    <div className="bg-cyan-500/10 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                        <Globe size={24} className="text-cyan-400" />
                      </div>
                      <h3 className="font-bold mb-2">50+</h3>
                      <p className="text-gray-400 text-sm">Countries</p>
                    </div>
                    <div className="bg-pink-500/10 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
                        <Zap size={24} className="text-pink-400" />
                      </div>
                      <h3 className="font-bold mb-2">1M+</h3>
                      <p className="text-gray-400 text-sm">Lines of Code</p>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                        <Users size={24} className="text-green-400" />
                      </div>
                      <h3 className="font-bold mb-2">5,000+</h3>
                      <p className="text-gray-400 text-sm">Teams</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-xl blur-xl -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl shadow-2xl"
            >
              {/* Enhanced gradient background with animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 via-purple-600/80 to-cyan-500/90 -z-10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)] -z-10" />
              
              {/* Animated particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/20"
                    initial={{ 
                      x: Math.random() * 100 + "%", 
                      y: Math.random() * 100 + "%",
                      scale: Math.random() * 0.5 + 0.5,
                      opacity: Math.random() * 0.5 + 0.25
                    }}
                    animate={{ 
                      x: Math.random() * 100 + "%", 
                      y: Math.random() * 100 + "%",
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ 
                      duration: Math.random() * 20 + 10, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                ))}
              </div>
              
              {/* Enhanced code-themed decorative elements */}
              <motion.div 
                className="absolute top-6 left-6 text-white/10 text-6xl font-mono"
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >{"<>"}</motion.div>
              <motion.div 
                className="absolute bottom-6 right-6 text-white/10 text-6xl font-mono"
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              >{"</>"}</motion.div>

              {/* Glowing border effect */}
              <div className="absolute inset-0 border border-white/10 rounded-3xl" />
              <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/30 via-transparent to-cyan-500/30 rounded-3xl blur-[2px]" />

              <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-cyan-100">
                        Ready to Transform Your Development Workflow?
                      </span>
                    </h2>
                    <p className="text-white/90 text-xl mb-8 leading-relaxed">
                      Join thousands of developers who are already collaborating in real-time with CodeNest.
                    </p>
                  </motion.div>                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-white to-purple-50 text-violet-600 hover:text-violet-800 font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-violet-500/30 py-6 px-8 rounded-xl relative overflow-hidden group"
                      onClick={() => window.location.href = '/signup'}
                    >
                      <span className="relative z-10">Get Started Free</span>
                      <span className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="absolute -right-4 -bottom-4 w-12 h-12 bg-cyan-400/30 rounded-full blur-lg group-hover:bg-cyan-400/50 transition-colors duration-300"></span>
                      <span className="absolute -left-4 -top-4 w-12 h-12 bg-violet-500/30 rounded-full blur-lg group-hover:bg-violet-500/50 transition-colors duration-300"></span>
                    </Button>                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white/70 bg-white/5 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 font-semibold py-6 px-8 rounded-xl group flex items-center gap-2"
                      onClick={() => window.location.href = '/login'}
                    >
                      <Zap size={18} className="text-cyan-300 group-hover:scale-110 transition-transform duration-300" />
                      <span>Start Now</span>
                    </Button>
                  </motion.div>
                </div>                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full max-w-sm relative"
                >
                  {/* Glow behind code editor */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-violet-500/20 via-transparent to-cyan-500/20 rounded-xl blur-xl" />
                  
                  <div className="relative bg-black/60 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center gap-2 px-4 py-3 bg-black/70 border-b border-white/20">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div className="flex-1 text-center text-gray-300 text-xs font-mono">transform.js</div>
                      <div className="bg-violet-500/20 text-violet-300 text-xs px-2 py-0.5 rounded-full border border-violet-500/30">LIVE</div>
                    </div>
                    <div className="p-5 font-mono text-sm text-white/90 relative">
                      {/* Line numbers */}
                      <div className="absolute top-5 left-2 text-gray-500 text-xs text-right pr-2 select-none">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="h-6">{i + 1}</div>
                        ))}
                      </div>
                      
                      <div className="space-y-2 pl-6 border-l border-gray-700/30">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <span className="text-pink-300">import</span>{" "}
                          <span className="text-yellow-300">{"{ CodeNest }"}</span>{" "}
                          <span className="text-pink-300">from</span>{" "}
                          <span className="text-green-400">&apos;codenest&apos;</span>;
                        </motion.div>
                        <div>&nbsp;</div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          <span className="text-pink-300">const</span> workspace ={" "}
                          <span className="text-blue-400">CodeNest</span>.
                          <span className="text-yellow-300">createWorkspace</span>
                          ();
                        </motion.div>
                        <div>&nbsp;</div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.0 }}
                        >
                          <span className="text-gray-500">// Transform your workflow instantly</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          workspace.<span className="text-yellow-300">transform</span>({"{"}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.4 }}
                          className="pl-4"
                        >
                          <span className="text-blue-400">team</span>: [
                          <span className="text-orange-300">&apos;your-team@example.com&apos;</span>],
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6 }}
                          className="pl-4"
                        >
                          <span className="text-blue-400">features</span>:{" "}
                          <span className="text-orange-300">&apos;unlimited&apos;</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.8 }}
                        >{"});"}</motion.div>
                      </div>
                      
                      {/* Blinking cursor */}
                      <motion.div 
                        className="absolute bottom-5 left-[108px] h-4 w-[2px] bg-white"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      
                      {/* Code execution indicator */}
                      <div className="mt-4 border-t border-gray-700/30 pt-2 text-green-400 text-xs">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.0 }}
                        >
                          ✓ Workflow transformation complete
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>      {/* Footer - Redesigned */}
      <footer className="py-12 border-t border-violet-500/20 relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-950/10 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-20 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-10 justify-between">
            {/* Brand section */}
            <div className="md:max-w-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Terminal className="text-black" size={18} />
                </div>
                <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-400">
                  CodeNest
                </span>
              </div>
              <p className="text-gray-300 mb-5 text-lg">The next-gen developer collaboration hub built for seamless real-time coding experiences.</p>
              
              {/* Social links with enhanced design */}
              <div className="flex gap-5 mb-8">
                <a href="#" className="text-gray-400 hover:text-violet-400 transition-all transform hover:scale-110 duration-200" aria-label="Twitter">
                  <div className="bg-gray-800/50 hover:bg-violet-500/20 p-2.5 rounded-full">
                    <Twitter size={18} />
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-violet-400 transition-all transform hover:scale-110 duration-200" aria-label="GitHub">
                  <div className="bg-gray-800/50 hover:bg-violet-500/20 p-2.5 rounded-full">
                    <Github size={18} />
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-violet-400 transition-all transform hover:scale-110 duration-200" aria-label="LinkedIn">
                  <div className="bg-gray-800/50 hover:bg-violet-500/20 p-2.5 rounded-full">
                    <Linkedin size={18} />
                  </div>
                </a>
              </div>
            </div>

            {/* Quick links & CTA buttons */}
            <div className="flex flex-col md:items-end justify-between">
              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-8 w-full">
                <div className="bg-violet-500/10 rounded-lg p-4 backdrop-blur-sm border border-violet-500/10 hover:border-violet-500/20 transition-colors">
                  <h4 className="font-bold text-lg text-white mb-1">10,000+</h4>
                  <p className="text-gray-400 text-sm">Active Developers</p>
                </div>
                <div className="bg-cyan-500/10 rounded-lg p-4 backdrop-blur-sm border border-cyan-500/10 hover:border-cyan-500/20 transition-colors">
                  <h4 className="font-bold text-lg text-white mb-1">50+</h4>
                  <p className="text-gray-400 text-sm">Countries</p>
                </div>
                <div className="bg-pink-500/10 rounded-lg p-4 backdrop-blur-sm border border-pink-500/10 hover:border-pink-500/20 transition-colors col-span-2 sm:col-span-1">
                  <h4 className="font-bold text-lg text-white mb-1">1M+</h4>
                  <p className="text-gray-400 text-sm">Lines of Code</p>
                </div>
              </div>
                {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Button 
                  onClick={() => window.location.href = '/login'} 
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white py-6 px-8 font-bold group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Now <Zap size={16} className="animate-pulse text-yellow-200" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-tr from-violet-500/0 via-white/10 to-cyan-500/0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>
                <Button 
                  onClick={() => scrollToSection("demo")} 
                  variant="outline" 
                  className="border-violet-500/30 hover:border-violet-500/50 text-violet-400 hover:bg-violet-500/20 hover:text-white py-6 px-8 transition-all duration-300"
                >
                  View Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Footer bottom section */}
          <div className="mt-12 pt-8 border-t border-violet-500/20 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-6 md:mb-0">
              &copy; {new Date().getFullYear()} CodeNest. All rights reserved.
            </p>
            <div className="font-mono text-sm text-gray-400 bg-black/30 px-4 py-2 rounded-full border border-gray-700/30">
              <span className="text-violet-400">$</span> npm install codenest
              <span className="inline-block w-2 h-4 bg-violet-400 ml-1 animate-pulse" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// CodeFlow Animation Component - More advanced than simple terminal
const TerminalAnimation = ({ delay = 0 }: { delay?: number }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [highlightedLines, setHighlightedLines] = useState<number[]>([])
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showConnections, setShowConnections] = useState(false)
  
  const codeSnippets = [
    {
      language: "bash",
      code: `> npm install codenest\n> Downloading packages...`,
      output: `✓ CodeNest installed successfully!`,
      highlight: [1]
    },
    {
      language: "javascript",
      code: `import { createWorkspace } from 'codenest';\n\nconst workspace = createWorkspace({\n  name: 'My Awesome Project',\n  template: 'react-ts'\n});`,
      output: `✓ Workspace initialized with React + TypeScript template`,
      highlight: [3, 4]
    },
    {
      language: "javascript",
      code: `workspace.invite([\n  'alex@example.com',\n  'taylor@example.com',\n  'jamie@example.com'\n]);\n\n// Send welcome message\nworkspace.sendMessage('Welcome to our collaborative project!');`,
      output: `✓ 3 team members invited successfully\n✓ Welcome message sent to team`,
      highlight: [1, 2, 3, 4, 7]
    },
    {
      language: "javascript", 
      code: `// Initialize real-time connections\nworkspace.connect();\n\n// Enable code sharing features\nworkspace.features.enableLiveEditing();\nworkspace.features.enableVoiceChat();\nworkspace.features.enableDrawing();`,
      output: `✓ Real-time collaboration started\n✓ Session URL: https://codenest.dev/workspace/x7f9q2\n✓ All team members are now connected`,
      highlight: [2, 5, 6, 7]
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      let step = 0
      const advanceStep = () => {
        if (step < codeSnippets.length) {
          setActiveStep(step)
          setHighlightedLines(codeSnippets[step].highlight)
          
          // Wait before showing output
          setTimeout(() => {
            setCompletedSteps(prev => [...prev, step])
            
            // Move to next step after delay
            setTimeout(() => {
              step++
              if (step < codeSnippets.length) {
                advanceStep()
              } else {
                // Show connections animation at the end
                setTimeout(() => {
                  setShowConnections(true)
                }, 500)
              }
            }, 1800)
          }, 1200)
        }
      }
      
      advanceStep()
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [delay])

  // Syntax highlighting colors
  const syntaxColors = {
    keyword: "text-pink-300",
    function: "text-yellow-300",
    string: "text-green-300",
    comment: "text-gray-500",
    variable: "text-blue-300",
    operator: "text-purple-300",
    number: "text-orange-300",
    bracket: "text-gray-300",
    default: "text-gray-100"
  }

  // Simple syntax highlighting function
  const highlightSyntax = (code: string, language: string) => {
    if (language === "bash") {
      return (
        <div>
          {code.split("\n").map((line, i) => (
            <div key={i} className={`${highlightedLines.includes(i+1) ? "bg-purple-500/20" : ""}`}>
              {line.startsWith(">") ? (
                <>
                  <span className="text-violet-400">{line.substring(0, 1)}</span>
                  <span>{line.substring(1)}</span>
                </>
              ) : line.startsWith("✓") ? (
                <span className="text-green-400">{line}</span>
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}
        </div>
      )
    }
    
    // Very simple JS highlighting
    return (
      <div>
        {code.split("\n").map((line, i) => {
          // Process the line for syntax highlighting
          let processedLine = line
            .replace(/(['"`])(.*?)\1/g, '<span class="' + syntaxColors.string + '">$&</span>') // strings
            .replace(/\b(const|let|var|import|from|function|return|if|for|while)\b/g, 
                     '<span class="' + syntaxColors.keyword + '">$&</span>') // keywords
            .replace(/\b(true|false|null|undefined)\b/g, 
                     '<span class="' + syntaxColors.variable + '">$&</span>') // special values
            .replace(/\/\/(.*)/g, '<span class="' + syntaxColors.comment + '">$&</span>') // comments
            
          return (
            <div 
              key={i} 
              className={`${highlightedLines.includes(i+1) ? "bg-purple-500/20" : ""}`}
              dangerouslySetInnerHTML={{ __html: processedLine }} 
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="bg-gray-900 rounded-md p-2 font-mono text-sm">
        <div className="relative">
          {/* Animation for connections between collaborators */}
          {showConnections && (
            <div className="absolute inset-0 z-10">
              <svg className="w-full h-full absolute inset-0" style={{ overflow: 'visible' }}>
                <motion.path
                  d="M50,40 C100,30 150,60 210,30"
                  fill="transparent"
                  stroke="rgba(139, 92, 246, 0.6)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                />
                <motion.path
                  d="M50,60 C120,90 160,40 210,70"
                  fill="transparent"
                  stroke="rgba(6, 182, 212, 0.6)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />
                <motion.path
                  d="M50,70 C80,110 170,100 210,50"
                  fill="transparent"
                  stroke="rgba(236, 72, 153, 0.6)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                />
                
                {/* Animated dots representing data transfer */}
                <motion.circle
                  cx="0" cy="0" r="3"
                  fill="#8B5CF6"
                  initial={{ x: 50, y: 40 }}
                  animate={{ x: 210, y: 30 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.circle
                  cx="0" cy="0" r="3"
                  fill="#06B6D4"
                  initial={{ x: 210, y: 70 }}
                  animate={{ x: 50, y: 60 }}
                  transition={{ duration: 2.3, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                />
                <motion.circle
                  cx="0" cy="0" r="3"
                  fill="#EC4899"
                  initial={{ x: 50, y: 70 }}
                  animate={{ x: 210, y: 50 }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
                />
              </svg>
              
              {/* Animated nodes/avatars */}
              <motion.div
                className="absolute left-8 top-8 w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold border border-violet-300/30"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                A
              </motion.div>
              <motion.div
                className="absolute right-8 top-5 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 flex items-center justify-center text-xs font-bold border border-cyan-300/30"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                T
              </motion.div>
              <motion.div
                className="absolute right-8 bottom-5 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-700 flex items-center justify-center text-xs font-bold border border-pink-300/30"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                J
              </motion.div>
            </div>
          )}
          
          {/* Main code display */}
          <div className="min-h-[180px] relative z-0">
            {highlightSyntax(codeSnippets[activeStep]?.code || "", codeSnippets[activeStep]?.language || "")}
          </div>
          
          {/* Output section */}
          {completedSteps.includes(activeStep) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 border-t border-gray-700 pt-2 text-green-400"
            >
              {codeSnippets[activeStep]?.output.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </motion.div>
          )}

          {/* Cursor */}
          <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="bg-black/40 backdrop-blur-md border border-violet-500/20 rounded-xl p-6 hover:border-violet-500/40 transition-colors"
    >
      <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
        {title}
      </h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}
