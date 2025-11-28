"use client"

import type React from "react"
import { useState, useEffect } from "react" // Import useEffect
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CalendarClock, Plus, Trash2 } from "lucide-react"
import { Schedule, WeekDays } from "@/lib/queries/scheduleQueries"
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

// --- DAYJS IMPORTS ---
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface ScheduleManagerProps {
  schedules: Schedule[] | undefined
  isFetching: boolean
  error: Error | null
  onAdd: (time: string, days: WeekDays[]) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const DAY_INDEX_TO_ENUM = [
  WeekDays.SUNDAY,
  WeekDays.MONDAY,
  WeekDays.TUESDAY,
  WeekDays.WEDNESDAY,
  WeekDays.THURSDAY,
  WeekDays.FRIDAY,
  WeekDays.SATURDAY
]

export function ScheduleManager({ schedules, isFetching, error, onAdd, onToggle, onDelete }: ScheduleManagerProps) {
  const [newTime, setNewTime] = useState("08:00")
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b),
    )
  }

  const formatDays = (days: WeekDays[]): string => {
    if (days.length === 7) return "Every day"

    const dayNameMap: Record<WeekDays, string> = {
      [WeekDays.SUNDAY]: "Sun",
      [WeekDays.MONDAY]: "Mon",
      [WeekDays.TUESDAY]: "Tue",
      [WeekDays.WEDNESDAY]: "Wed",
      [WeekDays.THURSDAY]: "Thu",
      [WeekDays.FRIDAY]: "Fri",
      [WeekDays.SATURDAY]: "Sat"
    }

    return days.map((d) => dayNameMap[d]).join(", ")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTime && selectedDays.length > 0) {
      const selectedWeekDays = selectedDays.map(index => DAY_INDEX_TO_ENUM[index])
      onAdd(newTime, selectedWeekDays)
      setNewTime("08:00")
      setSelectedDays([])
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <CalendarClock className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg font-semibold text-slate-800">Feeding Schedule</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 -mt-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Select Days</label>
            <div className="flex gap-2 mb-4">
              {DAY_NAMES.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`flex-1 px-1 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all ${selectedDays.includes(index)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700 block">Select Time</label>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopTimePicker
                timeSteps={{ minutes: 1 }}
                className="w-full"
                value={dayjs(newTime, "HH:mm")}
                onChange={(newValue) => {
                  if (newValue) {
                    setNewTime(newValue.format("HH:mm"))
                  }
                }}
              />
            </LocalizationProvider>

            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 mt-3"
              disabled={selectedDays.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Schedule
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          {isFetching && (
            <p className="text-center text-slate-400 py-4 text-sm">Loading schedules...</p>
          )}

          {error && (
            <p className="text-center text-red-500 py-4 text-sm">Error loading schedules</p>
          )}

          {schedules && schedules.length === 0 && (
            <p className="text-center text-slate-400 py-4 text-sm">No scheduled feedings yet</p>
          )}

          {schedules && schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div
                  className={`text-lg font-mono font-medium ${schedule.isEnabled ? "text-slate-800" : "text-slate-400"}`}
                >
                  {schedule.time}
                </div>
                <span className="text-xs text-slate-500 font-medium">{formatDays(schedule.days)}</span>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={schedule.isEnabled} onCheckedChange={() => onToggle(schedule.id)} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => onDelete(schedule.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}