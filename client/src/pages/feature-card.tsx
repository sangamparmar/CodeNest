"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card.tsx"

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
      <Card className="overflow-hidden border-primary/10 transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:border-primary/30 h-full">
        <CardContent className="p-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary"
          >
            {icon}
          </motion.div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
