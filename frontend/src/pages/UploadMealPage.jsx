import { useState } from "react"
import { Camera, UploadCloud } from "lucide-react"
import { motion } from "framer-motion"
import api from "../api/client"

export default function UploadMealPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFile = (selectedFile) => {
    if (!selectedFile) return
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setResult(null)
    setError("")
  }

  const submitMeal = async () => {
    if (!file) {
      setError("Please choose an image first.")
      return
    }

    const form = new FormData()
    form.append("image", file)

    try {
      setLoading(true)
      setError("")
      const { data } = await api.post("/upload-meal", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || "Could not analyze meal.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr,0.9fr]">
      <motion.section initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="glass-panel">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-brand-300">Meal Capture</p>
        <h1 className="mt-4 font-display text-4xl font-bold">Upload a meal photo</h1>
        <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-300">
          NutriVision uses API-based vision analysis to estimate the meal, quantity, and nutrition details from your image. For the MVP, it falls back to smart mock analysis when no API key is configured.
        </p>

        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-[32px] border border-dashed border-brand-400/50 bg-brand-500/5 px-6 py-14 text-center transition hover:bg-brand-500/10">
          <UploadCloud size={40} className="text-brand-500" />
          <span className="mt-4 font-semibold">Drop your food photo here or browse</span>
          <span className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Supports any common image file for MVP testing
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={submitMeal}
            disabled={loading}
            className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Analyzing..." : "Analyze Meal"}
          </button>
          <button
            onClick={() => {
              setFile(null)
              setPreview("")
              setResult(null)
              setError("")
            }}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold dark:border-slate-800 dark:bg-slate-950"
          >
            Reset
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}
      </motion.section>

      <motion.section initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="soft-card p-6">
        <div className="flex items-center gap-3">
          <Camera className="text-brand-500" />
          <h2 className="font-display text-2xl font-semibold">Preview & Result</h2>
        </div>
        <div className="mt-6 overflow-hidden rounded-[28px] bg-slate-200 dark:bg-slate-800">
          {preview ? (
            <img src={preview} alt="Meal preview" className="h-80 w-full object-cover" />
          ) : (
            <div className="flex h-80 items-center justify-center text-slate-400">Your preview will appear here</div>
          )}
        </div>
        {result && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoCard label="Food" value={result.food_name} />
            <InfoCard label="Quantity" value={result.quantity} />
            <InfoCard label="Calories" value={`${result.calories} kcal`} />
            <InfoCard label="Carbs" value={`${result.carbs} g`} />
            <InfoCard label="Protein" value={`${result.protein} g`} />
            <InfoCard label="Fats" value={`${result.fats} g`} />
          </div>
        )}
      </motion.section>
    </div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  )
}
