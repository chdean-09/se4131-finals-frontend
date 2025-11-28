"use client"

import { DispenseControl } from "@/components/dispense-control"
import { ScheduleManager } from "@/components/schedule-manager"
import { FeedingHistory } from "@/components/feeding-history"
import { useQuery } from "@tanstack/react-query"
import { feedQuery } from "@/lib/queries/feedQueries"
import { scheduleQuery } from "@/lib/queries/scheduleQueries"
import { WeekDays } from "@/lib/queries/scheduleQueries"

export function PetFeederDashboard() {
  const { error, data, isFetching } = useQuery(feedQuery())
  const { error: scheduleError, data: scheduleData, isFetching: scheduleIsFetching } = useQuery(scheduleQuery())

  const lastFedTime = data && data.length > 0 ? data[0].createdAt : null

  const handleDispense = async () => {
    await fetch(process.env.NEXT_PUBLIC_SERVER_API_URL + "/feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "MANUAL",
      }),
    })
  }

  const handleAddSchedule = async (time: string, days: WeekDays[]) => {
    await fetch(process.env.NEXT_PUBLIC_SERVER_API_URL + "/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        time,
        days,
      }),
    })
  }

  const handleToggleSchedule = async (id: string) => {
    await fetch(process.env.NEXT_PUBLIC_SERVER_API_URL + `/schedule/${id}/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  const handleDeleteSchedule = async (id: string) => {
    await fetch(process.env.NEXT_PUBLIC_SERVER_API_URL + `/schedule/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  return (
    <div className="space-y-6">
      <section className="w-full">
        <DispenseControl lastFedTime={lastFedTime} onDispense={handleDispense} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScheduleManager
          schedules={scheduleData}
          isFetching={scheduleIsFetching}
          error={scheduleError}
          onAdd={handleAddSchedule}
          onToggle={handleToggleSchedule}
          onDelete={handleDeleteSchedule}
        />

        <FeedingHistory history={data} isFetching={isFetching} error={error} />
      </div>
    </div>
  )
}
