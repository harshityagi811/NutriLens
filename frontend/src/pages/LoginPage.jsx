import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthShell from "../components/AuthShell"
import { useAuth } from "../hooks/useAuth"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: "demo@nutrivision.app", password: "demo1234" })
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setError("")
      await login(form)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to sign in")
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to keep tracking your meals with AI">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(value) => setForm({ ...form, password: value })}
        />
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <button className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600">
          Sign In
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        New here?{" "}
        <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-300">
          Create an account
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
