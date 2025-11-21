import { PetFeederDashboard } from "@/components/pet-feeder-dashboard"

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 pb-10">
      <header className="bg-white border-b border-slate-200 px-6 py-4 mb-8">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            F
          </div>
          <h1 className="text-xl font-bold text-slate-800">RSC Feeder</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <PetFeederDashboard />
      </div>
    </main>
  )
}
