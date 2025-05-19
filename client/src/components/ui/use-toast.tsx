"use client"

import * as React from "react"

interface ToastContextType {
  toast: (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = React.useCallback(
    ({ title, description, variant = "default" }: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
      console.log({ title, description, variant })
      // In a real app, this would use a proper toast library
      alert(`${title || ""}\n${description || ""}`)
    },
    []
  )

  return <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = React.useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}

export const toast = (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
  // This is a simplified version for direct imports
  console.log(props)
  alert(`${props.title || ""}\n${props.description || ""}`)
}
