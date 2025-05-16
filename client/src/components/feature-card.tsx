"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  index: number
}

export default function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(0.1 * index, 0.5) }}
    >
      <Card className="overflow-hidden border-primary/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30 h-full relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-6 relative">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="mb-6 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary shadow-md"
          >
            <div className="text-xl">
              {icon}
            </div>
          </motion.div>
          
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          
          <div className="absolute bottom-3 right-3 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}