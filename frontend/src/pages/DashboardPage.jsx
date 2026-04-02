import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import api from "../api/client"
import StatCard from "../components/StatCard"
import { DailyCaloriesCard, MacroPieCard, TrendLineCard } from "../components/ChartCards"

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await api.get("/stats")
        setStats(data)
      } catch (err) {
        setError(err.response?.data?.detail || "Could not load dashboard")
      }
    }
    loadStats()
  }, [])

  if (error) return <div className="soft-card p-6 text-rose-500">{error}</div>
  if (!stats) return <div className="soft-card p-6">Loading dashboard...</div>

  const { summary } = stats

  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-brand-300">Daily Snapshot</p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">
              Your nutrition dashboard, powered by meal photos.
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
              Track every meal visually, monitor macros in real time, and keep an eye on weekly and monthly calorie trends without manual logging.
            </p>
          </div>
          <div className="rounded-[28px] border border-brand-500/10 bg-brand-500/10 p-6">
            <p className="text-sm text-slate-600 dark:text-slate-300">Goal Progress</p>
            <p className="mt-4 font-display text-5xl font-bold text-brand-600 dark:text-brand-300">
              {Math.round(summary.goal_progress * 100)}%
            </p>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/60 dark:bg-slate-950/60">
              <div
                className={`h-full rounded-full ${summary.exceeded ? "bg-rose-500" : "bg-brand-500"}`}
                style={{ width: `${Math.min(summary.goal_progress * 100, 100)}%` }}
              />
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              {summary.remaining_calories > 0
                ? `${summary.remaining_calories} kcal remaining today`
                : `${Math.abs(summary.remaining_calories)} kcal over goal`}
            </p>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Calories" value={`${summary.calories} kcal`} subtitle={`Goal: ${summary.goal} kcal`} accent="brand" />
        <StatCard title="Carbs" value={`${summary.carbs} g`} subtitle="Energy fuel for the day" accent="sky" />
        <StatCard title="Protein" value={`${summary.protein} g`} subtitle="Muscle recovery and satiety" accent="rose" />
        <StatCard title="Fats" value={`${summary.fats} g`} subtitle="Hormonal and metabolic support" accent="amber" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <MacroPieCard data={stats.macro_distribution} />
        <DailyCaloriesCard data={stats.daily_calorie_bars} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <TrendLineCard title="Weekly Trend" subtitle="Daily calorie totals for the last month" data={stats.weekly_trend} />
        <TrendLineCard title="Monthly Trend" subtitle="Top-line monthly intake trend" data={stats.monthly_trend} />
      </section>

      <section className="soft-card p-6">
        <h2 className="font-display text-xl font-semibold">Coach Notes</h2>
        <div className="mt-4 grid gap-3">
          {stats.notifications.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
