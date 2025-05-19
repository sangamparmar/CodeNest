"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Trash2, MousePointer, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"

type Point = {
  x: number
  y: number
  color: string
  size: number
}

type Line = {
  points: Point[]
  color: string
  size: number
}

type OtherCursor = {
  x: number
  y: number
  color: string
  name: string
}

const colors = [
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#10b981", // green
  "#f97316", // orange
  "#f43f5e", // rose
]

const DrawingBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const [currentLine, setCurrentLine] = useState<Point[]>([])
  const [color, setColor] = useState(colors[0])
  const [size, setSize] = useState(3)
  const [tool, setTool] = useState<"pen" | "pointer">("pen")
  const [otherCursor, setOtherCursor] = useState<OtherCursor>({
    x: 0,
    y: 0,
    color: "#06b6d4",
    name: "Alice",
  })

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw all lines
    lines.forEach((line) => {
      if (line.points.length < 2) return

      ctx.beginPath()
      ctx.moveTo(line.points[0].x, line.points[0].y)

      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y)
      }

      ctx.strokeStyle = line.color
      ctx.lineWidth = line.size
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
    })

    // Draw current line
    if (currentLine.length > 1) {
      ctx.beginPath()
      ctx.moveTo(currentLine[0].x, currentLine[0].y)

      for (let i = 1; i < currentLine.length; i++) {
        ctx.lineTo(currentLine[i].x, currentLine[i].y)
      }

      ctx.strokeStyle = color
      ctx.lineWidth = size
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
    }
  }, [lines, currentLine, color, size])

  // Simulate other user's cursor
  useEffect(() => {
    const simulateOtherCursor = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height

      setOtherCursor((prev) => ({
        ...prev,
        x,
        y,
      }))

      // Occasionally simulate drawing
      if (Math.random() > 0.7) {
        simulateOtherDrawing(x, y)
      }
    }

    const simulateOtherDrawing = (startX: number, startY: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const newLine: Line = {
        points: [{ x: startX, y: startY, color: otherCursor.color, size: 2 }],
        color: otherCursor.color,
        size: 2,
      }

      // Generate a simple shape (circle, line, etc.)
      const shapeType = Math.floor(Math.random() * 3)

      if (shapeType === 0) {
        // Draw a line
        const endX = startX + (Math.random() * 100 - 50)
        const endY = startY + (Math.random() * 100 - 50)

        newLine.points.push({ x: endX, y: endY, color: otherCursor.color, size: 2 })
      } else if (shapeType === 1) {
        // Draw a square
        const size = Math.random() * 50 + 20

        newLine.points.push({ x: startX + size, y: startY, color: otherCursor.color, size: 2 })
        newLine.points.push({ x: startX + size, y: startY + size, color: otherCursor.color, size: 2 })
        newLine.points.push({ x: startX, y: startY + size, color: otherCursor.color, size: 2 })
        newLine.points.push({ x: startX, y: startY, color: otherCursor.color, size: 2 })
      } else {
        // Draw a circle-like shape
        const radius = Math.random() * 30 + 10
        const steps = 20

        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2
          const x = startX + Math.cos(angle) * radius
          const y = startY + Math.sin(angle) * radius

          newLine.points.push({ x, y, color: otherCursor.color, size: 2 })
        }
      }

      setLines((prev) => [...prev, newLine])
    }

    const interval = setInterval(simulateOtherCursor, 3000)
    return () => clearInterval(interval)
  }, [otherCursor.color])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== "pen") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setCurrentLine([{ x, y, color, size }])
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool !== "pen") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCurrentLine((prev) => [...prev, { x, y, color, size }])
  }

  const stopDrawing = () => {
    if (!isDrawing || currentLine.length === 0) return

    setIsDrawing(false)
    setLines((prev) => [...prev, { points: currentLine, color, size }])
    setCurrentLine([])
  }

  const clearCanvas = () => {
    setLines([])
    setCurrentLine([])
  }

  return (
    <div className="flex flex-col h-[500px]">
      {/* Drawing Board Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-violet-500/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-sm text-gray-300">Collaborative Drawing Board</div>
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

      {/* Drawing Tools */}
      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border-b border-violet-500/20">
        <div className="flex items-center gap-1">
          <Button
            variant={tool === "pointer" ? "default" : "outline"}
            size="sm"
            className={`p-1 h-8 w-8 ${tool === "pointer" ? "bg-violet-500 hover:bg-violet-600" : "border-violet-500/30 hover:bg-violet-500/10"}`}
            onClick={() => setTool("pointer")}
          >
            <MousePointer size={16} />
          </Button>
          <Button
            variant={tool === "pen" ? "default" : "outline"}
            size="sm"
            className={`p-1 h-8 w-8 ${tool === "pen" ? "bg-violet-500 hover:bg-violet-600" : "border-violet-500/30 hover:bg-violet-500/10"}`}
            onClick={() => setTool("pen")}
          >
            <PenTool size={16} />
          </Button>
        </div>

        <div className="h-6 w-px bg-violet-500/20" />

        <div className="flex items-center gap-1">
          {colors.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full ${color === c ? "ring-2 ring-white" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-violet-500/20" />

        <div className="flex items-center gap-1">
          <button
            className={`w-6 h-6 rounded-full flex items-center justify-center border ${size === 2 ? "bg-violet-500/20 border-violet-500" : "border-violet-500/30"}`}
            onClick={() => setSize(2)}
          >
            <div className="w-2 h-2 rounded-full bg-white" />
          </button>
          <button
            className={`w-6 h-6 rounded-full flex items-center justify-center border ${size === 4 ? "bg-violet-500/20 border-violet-500" : "border-violet-500/30"}`}
            onClick={() => setSize(4)}
          >
            <div className="w-3 h-3 rounded-full bg-white" />
          </button>
          <button
            className={`w-6 h-6 rounded-full flex items-center justify-center border ${size === 6 ? "bg-violet-500/20 border-violet-500" : "border-violet-500/30"}`}
            onClick={() => setSize(6)}
          >
            <div className="w-4 h-4 rounded-full bg-white" />
          </button>
        </div>

        <div className="flex-1" />

        <Button
          variant="outline"
          size="sm"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          onClick={clearCanvas}
        >
          <Trash2 size={16} className="mr-1" /> Clear
        </Button>
      </div>

      {/* Drawing Canvas */}
      <div className="relative flex-1 bg-black/20 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {/* Other user's cursor */}
        <div
          className="absolute w-4 h-4 pointer-events-none"
          style={{
            left: `${otherCursor.x}px`,
            top: `${otherCursor.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: otherCursor.color }} />
          <div
            className="absolute top-5 left-2 px-2 py-1 rounded text-xs whitespace-nowrap"
            style={{ backgroundColor: otherCursor.color }}
          >
            {otherCursor.name}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DrawingBoard
