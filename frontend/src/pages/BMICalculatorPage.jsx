import { useState } from "react"
import { Scale, Activity } from "lucide-react"
import api from "../api/client"

export default function BMICalculatorPage() {
  const [form, setForm] = useState({ height_cm: 170, weight_kg: 68 })
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setError("")
      const { data } = await api.post("/bmi", {
        height_cm: Number(form.height_cm),
        weight_kg: Number(form.weight_kg),
      })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to calculate BMI")
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr,1.2fr]">
      <section className="glass-panel">
        <div className="flex items-center gap-3">
          <Scale className="text-brand-500" />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-brand-300">Body Metrics</p>
            <h1 className="mt-3 font-display text-4xl font-bold">BMI Calculator</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Field label="Height (cm)" value={form.height_cm} onChange={(value) => setForm({ ...form, height_cm: value })} />
          <Field label="Weight (kg)" value={form.weight_kg} onChange={(value) => setForm({ ...form, weight_kg: value })} />
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <button className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600">
            Calculate BMI
          </button>
        </form>
      </section>

      <section className="soft-card p-6">
        <div className="flex items-center gap-3">
          <Activity className="text-sky-500" />
          <h2 className="font-display text-2xl font-semibold">Result</h2>
        </div>
        {result ? (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Metric title="BMI" value={result.bmi} />
            <Metric title="Category" value={result.category} />
            <Metric title="Healthy Range" value={result.healthy_range} />
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Enter your height and weight to calculate BMI.
          </div>
        )}
      </section>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950/60"
        required
      />
    </label>
  )
}

function Metric({ title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 dark:border-slate-800 dark:bg-slate-950/50">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-4 font-display text-3xl font-semibold">{value}</p>
    </div>
  )
}
