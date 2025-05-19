"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, User, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"

type Message = {
  id: string
  sender: string
  content: string
  timestamp: Date
  isUser: boolean
}

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "Alice",
    content: "Hey! I just pushed the new authentication module. Can you review it?",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isUser: false,
  },
  {
    id: "2",
    sender: "You",
    content: "Sure, I'll take a look at it now. Which branch is it on?",
    timestamp: new Date(Date.now() - 1000 * 60 * 14),
    isUser: true,
  },
  {
    id: "3",
    sender: "Alice",
    content: "It's on the feature/auth branch. I'm particularly concerned about the token refresh logic.",
    timestamp: new Date(Date.now() - 1000 * 60 * 13),
    isUser: false,
  },
  {
    id: "4",
    sender: "You",
    content: "Got it. I'll focus on that part. Give me about 30 minutes to review it thoroughly.",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    isUser: true,
  },
]

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate Alice typing
  useEffect(() => {
    const simulateTyping = () => {
      // Only simulate typing if Alice isn't already typing and last message wasn't from Alice
      if (!isTyping && messages[messages.length - 1]?.isUser) {
        setIsTyping(true)

        // Simulate typing duration
        const typingDuration = Math.random() * 3000 + 2000

        setTimeout(() => {
          // Add Alice's response
          const responses = [
            "I've made some updates based on your feedback. Can you check again?",
            "Thanks for the review! I'll fix those issues right away.",
            "What do you think about adding a rate limiting feature to the auth module?",
            "I'm also working on the user profile section. Should we integrate it with the auth module?",
          ]

          const randomResponse = responses[Math.floor(Math.random() * responses.length)]

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: "Alice",
              content: randomResponse,
              timestamp: new Date(),
              isUser: false,
            },
          ])

          setIsTyping(false)
        }, typingDuration)
      }
    }

    // Only start the simulation if the user has sent at least one message
    if (messages.some((m) => m.isUser)) {
      const timeout = setTimeout(simulateTyping, 5000)
      return () => clearTimeout(timeout)
    }
  }, [messages, isTyping])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date(),
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-[500px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-violet-500/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-sm text-gray-300">Team Chat</div>
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

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${message.isUser ? "flex-row-reverse" : ""}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${message.isUser ? "bg-violet-500" : "bg-cyan-500"}`}
                >
                  <User size={16} />
                </div>
                <div
                  className={`rounded-lg p-3 ${message.isUser ? "bg-violet-500/20 border border-violet-500/30" : "bg-black/60 border border-cyan-500/30"}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${message.isUser ? "text-violet-300" : "text-cyan-300"}`}>
                      {message.sender}
                    </span>
                    <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-200">{message.content}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                    <User size={16} />
                  </div>
                  <div className="rounded-lg p-3 bg-black/60 border border-cyan-500/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-cyan-300">Alice</span>
                    </div>
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-violet-500/20 bg-black/40">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full bg-black/60 border border-violet-500/30 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none h-10 max-h-32"
              style={{ minHeight: "40px" }}
            />
            <button className="absolute right-2 top-2 text-gray-400 hover:text-violet-400">
              <Smile size={18} />
            </button>
          </div>
          <Button onClick={handleSendMessage} className="bg-violet-500 hover:bg-violet-600 h-10 px-3">
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
