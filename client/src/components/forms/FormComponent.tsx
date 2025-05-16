"use client"

import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LucideArrowRight } from "lucide-react"

export default function FormComponent() {
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect would happen here
      window.location.href = "/create-room"
    }, 1500)
  }

  return (
    <div>
      <motion.h2
        className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Real-time Collaborative Coding
      </motion.h2>

      <motion.p
        className="text-gray-300 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Create or join a room to start coding together with your team in real-time.
      </motion.p>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="create" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Create Room
          </TabsTrigger>
          <TabsTrigger value="join" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            Join Room
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-medium text-gray-300 block mb-2">
                Your Username
              </label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e: { target: { value: React.SetStateAction<string> } }) => setUsername(e.target.value)}
                className="bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={!username || isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Creating...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Create Room <LucideArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="join">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username-join" className="text-sm font-medium text-gray-300 block mb-2">
                Your Username
              </label>
              <Input
                id="username-join"
                placeholder="Enter your username"
                value={username}
                onChange={(e: { target: { value: React.SetStateAction<string> } }) => setUsername(e.target.value)}
                className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="room-id" className="text-sm font-medium text-gray-300 block mb-2">
                Room ID
              </label>
              <Input
                id="room-id"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e: { target: { value: React.SetStateAction<string> } }) => setRoomId(e.target.value)}
                className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={!username || !roomId || isLoading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Joining...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Join Room <LucideArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
