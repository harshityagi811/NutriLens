import { Moon, Sun, Target, LogOut } from "lucide-react"
import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../hooks/useAuth"

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/upload-meal", label: "Upload Meal" },
  { to: "/history", label: "History" },
  { to: "/bmi", label: "BMI" },
]

export default function Navbar({ theme, toggleTheme }) {
  const { user, logout } = useAuth()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 border-b border-white/10 bg-white/60 backdrop-blur-xl dark:bg-slate-950/60"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            NutriVision
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            AI nutrition tracking for image-based food logging
          </p>
        </div>
        <nav className="hidden items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 p-1 shadow-glass dark:border-slate-800 dark:bg-slate-900/80 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-500 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-sm text-brand-700 dark:text-brand-300 sm:flex">
              <Target size={16} />
              <span>{user.daily_calorie_goal} kcal goal</span>
            </div>
          )}
          <button
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 bg-white p-3 text-slate-700 transition hover:scale-105 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user && (
            <button
              onClick={logout}
              className="rounded-full border border-slate-200 bg-white p-3 text-slate-700 transition hover:scale-105 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-4 md:hidden sm:px-6 lg:px-8">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-brand-500 text-white"
                  : "bg-white/80 text-slate-700 dark:bg-slate-900/80 dark:text-slate-300"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </motion.header>
  )
}
