import { useEffect, useState } from "react"
import api from "../api/client"
import MealCard from "../components/MealCard"

const filters = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "All", value: "all" },
]

export default function HistoryPage() {
  const [period, setPeriod] = useState("week")
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadMeals() {
      try {
        setLoading(true)
        const { data } = await api.get(`/meals?period=${period}`)
        setMeals(data.meals)
      } catch (err) {
        setError(err.response?.data?.detail || "Could not load meal history")
      } finally {
        setLoading(false)
      }
    }
    loadMeals()
  }, [period])

  return (
    <div className="space-y-6">
      <div className="glass-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-brand-300">Meal History</p>
            <h1 className="mt-3 font-display text-4xl font-bold">Your nutrition timeline</h1>
            <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-300">
              Scroll back through visual meal entries and switch between day, week, month, or the complete journal.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 rounded-full border border-slate-200/70 bg-white/80 p-1 dark:border-slate-800 dark:bg-slate-900/70">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setPeriod(item.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  period === item.value ? "bg-brand-500 text-white" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <div className="soft-card p-6">Loading meals...</div>}
      {error && <div className="soft-card p-6 text-rose-500">{error}</div>}
      {!loading && !meals.length && <div className="soft-card p-6">No meals found for this period.</div>}

      <div className="space-y-4">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} apiUrl={import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"} />
        ))}
      </div>
    </div>
  )
}
