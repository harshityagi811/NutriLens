import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthShell from "../components/AuthShell"
import { useAuth } from "../hooks/useAuth"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    email: "",
    password: "",
    daily_calorie_goal: 2200,
  })
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setError("")
      await register({ ...form, daily_calorie_goal: Number(form.daily_calorie_goal) })
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create account")
    }
  }

  return (
    <AuthShell title="Create account" subtitle="Start your AI food journal in under a minute">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(value) => setForm({ ...form, password: value })}
        />
        <Field
          label="Daily calorie goal"
          type="number"
          value={form.daily_calorie_goal}
          onChange={(value) => setForm({ ...form, daily_calorie_goal: value })}
        />
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <button className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600">
          Create Account
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-300">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}

function Field({ label, type, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950/60"
        required
      />
    </label>
  )
}
