"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bone, Clock } from "lucide-react"

interface DispenseControlProps {
  lastFedTime: Date | null
  onDispense: () => void
}

export function DispenseControl({ lastFedTime, onDispense }: DispenseControlProps) {
  const [isDispensing, setIsDispensing] = useState(false)
  const [timeAgo, setTimeAgo] = useState<string>("")

  // Update the "time ago" text every minute
  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastFedTime) {
        setTimeAgo("No feeding record")
        return
      }

      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - lastFedTime.getTime()) / 1000)

      if (diffInSeconds < 60) {
        setTimeAgo("Just now")
      } else if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60)
        setTimeAgo(`${mins} min${mins > 1 ? "s" : ""} ago`)
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        setTimeAgo(`${hours} hr${hours > 1 ? "s" : ""} ago`)
      } else {
        const days = Math.floor(diffInSeconds / 86400)
        setTimeAgo(`${days} day${days > 1 ? "s" : ""} ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000)
    return () => clearInterval(interval)
  }, [lastFedTime])

  const handleDispenseClick = () => {
    setIsDispensing(true)
    // Simulate network/hardware delay
    setTimeout(() => {
      onDispense()
      setIsDispensing(false)
    }, 1500)
  }

  return (
    <Card className="border-none shadow-md bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600" />
      <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 text-sm font-medium uppercase tracking-wide">
            <Clock className="w-4 h-4" />
            Last Feeding
          </div>
          <h2 className="text-4xl font-bold text-slate-800">{timeAgo}</h2>
          <p className="text-slate-500">
            {lastFedTime ? lastFedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
            {lastFedTime && <span className="mx-2">•</span>}
            {lastFedTime && lastFedTime.toLocaleDateString()}
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
          <Button
            size="lg"
            className="relative h-24 w-24 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
            onClick={handleDispenseClick}
            disabled={isDispensing}
          >
            {isDispensing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            ) : (
              <>
                <Bone className="w-8 h-8 mb-1" />
                <span className="text-xs font-bold">FEED</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
