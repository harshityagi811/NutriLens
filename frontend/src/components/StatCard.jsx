import { motion } from "framer-motion"

const accentMap = {
  brand: "text-brand-600 dark:text-brand-300",
  sky: "text-sky-600 dark:text-sky-300",
  rose: "text-rose-600 dark:text-rose-300",
  amber: "text-amber-600 dark:text-amber-300",
}

export default function StatCard({ title, value, subtitle, accent = "brand" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="soft-card p-5"
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className={`mt-3 font-display text-3xl font-semibold ${accentMap[accent] || accentMap.brand}`}>
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </motion.div>
  )
}
