"use client"

import { DispenseControl } from "@/components/dispense-control"
import { ScheduleManager } from "@/components/schedule-manager"
import { FeedingHistory } from "@/components/feeding-history"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Feed, feedQuery, FeedType } from "@/lib/queries/feedQueries"
import { scheduleQuery, WeekDays } from "@/lib/queries/scheduleQueries"

export function PetFeederDashboard() {
  const queryClient = useQueryClient()

  const { error, data, isFetching } = useQuery(feedQuery())
  const {
    error: scheduleError,
    data: scheduleData,
    isFetching: scheduleIsFetching
  } = useQuery(scheduleQuery())

  const lastFedTime = data && data.length > 0 ? new Date(data[0].createdAt) : null

  const dispenseMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_API_URL + "/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "MANUAL" }),
      })
      if (!res.ok) throw new Error("Network response was not ok")
      return res.json()
    },
    onMutate: async () => {
      await queryClient.cancelQueries(feedQuery())

      const previousFeeds = queryClient.getQueryData(feedQuery().queryKey)

      const optimisticFeed = {
        id: "temp-id-" + Date.now(),
        createdAt: new Date(),
        type: FeedType.MANUAL,
      }

      queryClient.setQueryData(feedQuery().queryKey, (old) => [
        optimisticFeed,
        ...(old ?? []),
      ])

      return { previousFeeds }
    },
    onError: (err, variables, context) => {
      if (context?.previousFeeds) {
        queryClient.setQueryData(feedQuery().queryKey, context.previousFeeds)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedQuery().queryKey })
    },
  })

  const addScheduleMutation = useMutation({
    mutationFn: async ({ time, days }: { time: string; days: WeekDays[] }) => {
      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_API_URL + "/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time, days }),
      })
      if (!res.ok) throw new Error("Network response was not ok")
      return res.json()
    },
    onMutate: async (newSchedule) => {
      await queryClient.cancelQueries(scheduleQuery())

      const previousSchedules = queryClient.getQueryData(scheduleQuery().queryKey)

      queryClient.setQueryData(scheduleQuery().queryKey, (old: any) => [
        ...(old ?? []),
        { ...newSchedule, id: "temp-id-" + Date.now(), isActive: true },
      ])

      return { previousSchedules }
    },
    onError: (err, variables, context) => {
      if (context?.previousSchedules) {
        queryClient.setQueryData(scheduleQuery().queryKey, context.previousSchedules)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQuery().queryKey })
    },
  })

  const toggleScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_SERVER_API_URL + `/schedule/${id}/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      )
      if (!res.ok) throw new Error("Network response was not ok")
      return res.json()
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries(scheduleQuery())

      const previousSchedules = queryClient.getQueryData(scheduleQuery().queryKey)

      queryClient.setQueryData(scheduleQuery().queryKey, (old: any) =>
        old?.map((schedule: any) =>
          schedule.id === id
            ? { ...schedule, isActive: !schedule.isActive }
            : schedule
        )
      )

      return { previousSchedules }
    },
    onError: (err, variables, context) => {
      if (context?.previousSchedules) {
        queryClient.setQueryData(scheduleQuery().queryKey, context.previousSchedules)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQuery().queryKey })
    },
  })

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_SERVER_API_URL + `/schedule/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      )
      if (!res.ok) throw new Error("Network response was not ok")
      return res.json()
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries(scheduleQuery())

      const previousSchedules = queryClient.getQueryData(scheduleQuery().queryKey)

      queryClient.setQueryData(scheduleQuery().queryKey, (old: any) =>
        old?.filter((schedule: any) => schedule.id !== id)
      )

      return { previousSchedules }
    },
    onError: (err, variables, context) => {
      if (context?.previousSchedules) {
        queryClient.setQueryData(scheduleQuery().queryKey, context.previousSchedules)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQuery().queryKey })
    },
  })

  const handleDispense = async () => {
    dispenseMutation.mutate()
  }

  const handleAddSchedule = async (time: string, days: WeekDays[]) => {
    addScheduleMutation.mutate({ time, days })
  }

  const handleToggleSchedule = async (id: string) => {
    toggleScheduleMutation.mutate(id)
  }

  const handleDeleteSchedule = async (id: string) => {
    deleteScheduleMutation.mutate(id)
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