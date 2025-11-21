"use client"

import { useState } from "react"
import { DispenseControl } from "@/components/dispense-control"
import { ScheduleManager } from "@/components/schedule-manager"
import { FeedingHistory } from "@/components/feeding-history"

export type FeedingRecord = {
  id: string
  timestamp: Date
  type: "manual" | "scheduled"
}

export type Schedule = {
  id: string
  time: string // HH:mm format
  days: number[] // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  enabled: boolean
}

export function PetFeederDashboard() {
  const [history, setHistory] = useState<FeedingRecord[]>([
    { id: "1", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), type: "scheduled" },
    { id: "2", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), type: "manual" },
    { id: "3", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 27), type: "scheduled" },
  ])

  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: "1", time: "08:00", days: [1, 2, 3, 4, 5], enabled: true }, // Weekdays
    { id: "2", time: "18:00", days: [0, 1, 2, 3, 4, 5, 6], enabled: true }, // Every day
  ])

  const [lastFedTime, setLastFedTime] = useState<Date | null>(history.length > 0 ? history[0].timestamp : null)

  const handleDispense = () => {
    const newRecord: FeedingRecord = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: "manual",
    }

    const newHistory = [newRecord, ...history]
    setHistory(newHistory)
    setLastFedTime(newRecord.timestamp)
  }

  const handleAddSchedule = (time: string, days: number[]) => {
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      time,
      days,
      enabled: true,
    }
    setSchedules([...schedules, newSchedule])
  }

  const handleToggleSchedule = (id: string) => {
    setSchedules(schedules.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))
  }

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <section className="w-full">
        <DispenseControl lastFedTime={lastFedTime} onDispense={handleDispense} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScheduleManager
          schedules={schedules}
          onAdd={handleAddSchedule}
          onToggle={handleToggleSchedule}
          onDelete={handleDeleteSchedule}
        />

        <FeedingHistory history={history} />
      </div>
    </div>
  )
}
