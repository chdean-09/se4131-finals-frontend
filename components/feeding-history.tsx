import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { History, Utensils } from "lucide-react"
import type { FeedingRecord } from "./pet-feeder-dashboard"

interface FeedingHistoryProps {
  history: FeedingRecord[]
}

export function FeedingHistory({ history }: FeedingHistoryProps) {
  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <History className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg font-semibold text-slate-800">Feeding History</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-center text-slate-400 py-8 text-sm">No history available</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-medium">Date & Time</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-700">
                      <div className="font-medium">{record.timestamp.toLocaleDateString()}</div>
                      <div className="text-slate-500 text-xs">
                        {record.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.type === "manual" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {record.type === "manual" ? <Utensils className="w-3 h-3" /> : <History className="w-3 h-3" />}
                        {record.type === "manual" ? "Manual" : "Scheduled"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
