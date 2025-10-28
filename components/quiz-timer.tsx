"use client"

import { useEffect, useState } from "react"

interface QuizTimerProps {
  initialSeconds: number
  onTimeUp: () => void
  isActive: boolean
}

export function QuizTimer({ initialSeconds, onTimeUp, isActive }: QuizTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds)

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, onTimeUp])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const isWarning = timeRemaining < 300 // Less than 5 minutes

  return (
    <div className={`text-2xl font-bold ${isWarning ? "text-red-600" : "text-blue-600"}`}>
      {formatTime(timeRemaining)}
    </div>
  )
}
