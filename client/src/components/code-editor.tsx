"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Users, Code, Terminal, Zap } from "lucide-react"
import { Button } from "./ui/button"

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "typescript", label: "TypeScript" },
]

const codeExamples = {
  javascript: `// Collaborative code editor example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
const results = [];
for (let i = 0; i < 10; i++) {
  results.push(fibonacci(i));
}

console.log(results); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
  python: `# Collaborative code editor example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Calculate first 10 Fibonacci numbers
results = []
for i in range(10):
    results.append(fibonacci(i))

print(results)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeNest Example</title>
  <style>
    body { font-family: system-ui, sans-serif; }
    .container { max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to CodeNest</h1>
    <p>This is a collaborative code editor example.</p>
  </div>
</body>
</html>`,
  css: `/* Collaborative code editor example */
:root {
  --primary: #8b5cf6;
  --secondary: #06b6d4;
  --background: #0f172a;
  --text: #f8fafc;
}

body {
  font-family: system-ui, sans-serif;
  background-color: var(--background);
  color: var(--text);
  line-height: 1.5;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}`,
  typescript: `// Collaborative code editor example
interface FibonacciResult {
  index: number;
  value: number;
}

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
const results: FibonacciResult[] = [];
for (let i = 0; i < 10; i++) {
  results.push({ index: i, value: fibonacci(i) });
}

console.log(results);`,
}

type Cursor = {
  id: string
  position: { line: number; ch: number }
  color: string
  name: string
}

const CodeEditor = () => {
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(codeExamples.javascript)
  const [cursors, setCursors] = useState<Cursor[]>([])
  const editorRef = useRef<HTMLDivElement>(null)
  const [lineNumbers, setLineNumbers] = useState<number[]>([])
  
  // Welcome screen states
  const [showWelcome, setShowWelcome] = useState(true)
  const [collaborationStarted, setCollaborationStarted] = useState(false)
  const [activityLog, setActivityLog] = useState<Array<{ message: string; type: string }>>([]) // Ensure it's initialized as an empty array

  // Function to start collaboration
  const startCollaboration = () => {
    setCollaborationStarted(true)    // Simulate activity logs with a sequence of events
    const simulateActivity = () => {
      const activities = [
        { message: "Creating code room...", type: "system" },
        { message: "Room created successfully: codenest-x7f9q2", type: "system" },
        { message: "Generating connection URL...", type: "system" },
        { message: "Alice joined the room", type: "user" },
        { message: "You joined the room", type: "self" },
        { message: "Bob joined the room", type: "user" },
        { message: "Loading collaborative environment...", type: "system" },
        { message: "Starting real-time code sync...", type: "system" },
        { message: "Ready to code! 3 developers online", type: "success" },
      ]
      
      let i = 0
      const interval = setInterval(() => {
        if (i < activities.length) {
          // Safely add activity with proper object structure
          if (activities[i]) {
            setActivityLog((prev) => [...prev, activities[i]])
          }
          i++
          
          // When the last activity is added, wait for a moment then show the editor
          if (i === activities.length) {
            // Clear the interval immediately to prevent additional updates
            clearInterval(interval)
            
            // Wait for animation to complete before hiding welcome screen
            setTimeout(() => {
              setShowWelcome(false)
            }, 1500)
          }
        } else {
          // Safety measure to clear interval if loop exits abnormally
          clearInterval(interval)
        }
      }, 800)
    }

    simulateActivity()
  }

  // Update code when language changes
  useEffect(() => {
    setCode(codeExamples[language as keyof typeof codeExamples])
  }, [language])

  // Update line numbers when code changes
  useEffect(() => {
    const lines = code.split("\n")
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1))
  }, [code])

  // Simulate another user's cursor
  useEffect(() => {
    const simulateCursor = () => {
      const lines = code.split("\n")
      const randomLine = Math.floor(Math.random() * lines.length)
      const randomCh = Math.floor(Math.random() * (lines[randomLine]?.length || 10))

      setCursors([
        {
          id: "user1",
          position: { line: randomLine, ch: randomCh },
          color: "#06b6d4", // cyan
          name: "Alice",
        },
      ])
    }

    const interval = setInterval(simulateCursor, 2000)
    simulateCursor() // Initial position

    return () => clearInterval(interval)
  }, [code])

  // Handle code changes
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
  }

  // Syntax highlighting
  const highlightCode = (code: string, language: string) => {
    // This is a simplified syntax highlighter
    // In a real app, you'd use a library like Prism or highlight.js

    if (language === "javascript" || language === "typescript") {
      return code
        .replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span style="color: #6b7280;">$1</span>')
        .replace(
          /\b(function|return|if|for|while|var|let|const|class|import|export|from)\b/g,
          '<span style="color: #c084fc;">$1</span>',
        )
        .replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, '<span style="color: #fb7185;">$1</span>')
        .replace(/(".*?"|'.*?'|`.*?`)/g, '<span style="color: #34d399;">$1</span>')
        .replace(/\b(\d+)\b/g, '<span style="color: #f97316;">$1</span>')
        .replace(/\b(console)\b/g, '<span style="color: #06b6d4;">$1</span>')
    } else if (language === "python") {
      return code
        .replace(/(#.*)/g, '<span style="color: #6b7280;">$1</span>')
        .replace(
          /\b(def|return|if|for|while|import|from|class|with|as|try|except|finally)\b/g,
          '<span style="color: #c084fc;">$1</span>',
        )
        .replace(/\b(True|False|None)\b/g, '<span style="color: #fb7185;">$1</span>')
        .replace(/(".*?"|'.*?')/g, '<span style="color: #34d399;">$1</span>')
        .replace(/\b(\d+)\b/g, '<span style="color: #f97316;">$1</span>')
        .replace(/\b(print)\b/g, '<span style="color: #06b6d4;">$1</span>')
    } else if (language === "html") {
      return code
        .replace(/(&lt;[^&]*&gt;)/g, '<span style="color: #c084fc;">$1</span>')
        .replace(/(&lt;\/[^&]*&gt;)/g, '<span style="color: #c084fc;">$1</span>')
        .replace(/(".*?")/g, '<span style="color: #34d399;">$1</span>')
    } else if (language === "css") {
      return code
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6b7280;">$1</span>')
        .replace(/([^:]+):/g, '<span style="color: #c084fc;">$1</span>:')
        .replace(/(#[a-fA-F0-9]{3,6})\b/g, '<span style="color: #34d399;">$1</span>')
        .replace(/\b(\d+)(px|rem|em|vh|vw|%|s|ms)\b/g, '<span style="color: #f97316;">$1$2</span>')
    }

    return code
  }

  // Render code with syntax highlighting
  const renderHighlightedCode = () => {
    const lines = code.split("\n")

    return lines.map((line, i) => {
      // Escape HTML characters
      const escapedLine = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

      const highlightedLine = highlightCode(escapedLine, language)

      return (
        <div key={i} className="relative">
          <div dangerouslySetInnerHTML={{ __html: highlightedLine || "&nbsp;" }} />

          {/* Render cursors on this line */}
          {cursors.map((cursor) =>
            cursor.position.line === i ? (
              <div
                key={cursor.id}
                className="absolute top-0 inline-block animate-pulse"
                style={{
                  left: `${cursor.position.ch * 8}px`, // Approximate character width
                  height: "1.2rem",
                  width: "2px",
                  backgroundColor: cursor.color,
                }}
              >
                <div
                  className="absolute top-0 left-0 transform -translate-y-full px-2 py-1 rounded text-xs whitespace-nowrap"
                  style={{ backgroundColor: cursor.color }}
                >
                  {cursor.name}
                </div>
              </div>
            ) : null,
          )}
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col h-[500px]">
      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute inset-0 z-10 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-lg w-full">
              {!collaborationStarted ? (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <Terminal className="text-white" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-400">
                      CodeNest Collaborative Editor
                    </h2>
                    <p className="text-gray-400 mb-6">
                      Experience real-time code collaboration with syntax highlighting, auto-completion, and more.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/40 border border-violet-500/20 rounded-lg p-4 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <Users size={18} className="text-violet-400" />
                        <span className="text-white font-medium">Real-time Collaboration</span>
                      </div>
                      <p className="text-gray-400 text-sm">Work together with your team in real-time</p>
                    </div>
                    <div className="bg-black/40 border border-violet-500/20 rounded-lg p-4 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <Code size={18} className="text-cyan-400" />
                        <span className="text-white font-medium">Multiple Languages</span>
                      </div>
                      <p className="text-gray-400 text-sm">Support for JavaScript, Python, HTML, CSS and more</p>
                    </div>
                  </div>

                  <Button
                    onClick={startCollaboration}
                    className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white px-6 py-2"
                  >
                    Start Collaborating
                  </Button>
                </motion.div>
              ) : (
                <div className="bg-black/60 border border-violet-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4 border-b border-violet-500/20 pb-3">
                    <Zap className="text-violet-400" size={20} />
                    <h3 className="text-lg font-medium text-white">Setting up collaboration</h3>
                  </div>                  <div className="space-y-3 mb-4 h-64 overflow-y-auto font-mono text-sm">
                    {Array.isArray(activityLog) && activityLog.map((activity, i) => 
                      activity ? (
                        <motion.div
                          key={i}
                          className="flex items-start gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <span
                            className={`inline-block mt-1 w-2 h-2 rounded-full ${
                              activity.type === "system"
                                ? "bg-blue-400"
                                : activity.type === "user"
                                ? "bg-green-400"
                                : activity.type === "self"
                                ? "bg-violet-400"
                                : "bg-cyan-400"
                            }`}
                          ></span>
                          <span
                            className={`${
                              activity.type === "system"
                                ? "text-blue-300"
                                : activity.type === "user"
                                ? "text-green-300"
                                : activity.type === "self"
                                ? "text-violet-300"
                                : "text-cyan-300"
                            }`}
                          >
                            {activity.message || ""}
                          </span>
                        </motion.div>
                      ) : null
                    )}
                  </div>
                  
                  {activityLog.length > 0 && activityLog[activityLog.length - 1]?.type === "success" && (
                    <div className="text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <p className="text-green-400 mb-3">Connection established successfully!</p>
                        <div className="text-xs text-gray-400">Entering editor mode...</div>
                      </motion.div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-violet-500/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-black/60 border border-violet-500/30 rounded text-sm px-2 pr-8 py-1 text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500 appearance-none"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-violet-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span className="text-xs text-gray-400">Alice</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-xs text-gray-400">You</span>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line Numbers */}
        <div className="bg-black/40 text-gray-500 text-right p-2 select-none w-12 font-mono text-sm overflow-y-auto">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Highlighted Code Display */}
          <div ref={editorRef} className="absolute inset-0 p-2 font-mono text-sm text-gray-300 overflow-auto">
            {renderHighlightedCode()}
          </div>

          {/* Textarea for editing (invisible but functional) */}
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="absolute inset-0 p-2 font-mono text-sm bg-transparent text-transparent caret-violet-500 resize-none outline-none w-full h-full"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-t border-violet-500/20 text-xs text-gray-400">
        <div>
          {lineNumbers.length} lines | {code.length} characters
        </div>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-violet-400">Ln</span> {cursors[0]?.position.line + 1 || 1},{" "}
            <span className="text-violet-400">Col</span> {cursors[0]?.position.ch + 1 || 1}
          </div>
          <div>{language.toUpperCase()}</div>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor
