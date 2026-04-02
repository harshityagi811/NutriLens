import { motion } from "framer-motion"
import { Flame, Drumstick, Wheat, Droplets } from "lucide-react"

export default function MealCard({ meal, apiUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="soft-card overflow-hidden"
    >
      <div className="grid gap-4 md:grid-cols-[220px,1fr]">
        <div className="h-52 overflow-hidden bg-slate-200 dark:bg-slate-800">
          {meal.image_path ? (
            <img
              src={`${apiUrl}${meal.image_path}`}
              alt={meal.food_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">No image</div>
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold">{meal.food_name}</h3>
              <p className="mt-1 text-slate-500 dark:text-slate-400">{meal.quantity}</p>
            </div>
            <div className="rounded-full bg-brand-500/10 px-4 py-2 text-brand-600 dark:text-brand-300">
              {new Date(meal.created_at).toLocaleString()}
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MacroChip icon={<Flame size={16} />} label="Calories" value={`${meal.calories} kcal`} />
            <MacroChip icon={<Wheat size={16} />} label="Carbs" value={`${meal.carbs} g`} />
            <MacroChip icon={<Drumstick size={16} />} label="Protein" value={`${meal.protein} g`} />
            <MacroChip icon={<Droplets size={16} />} label="Fats" value={`${meal.fats} g`} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function MacroChip({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  )
}
