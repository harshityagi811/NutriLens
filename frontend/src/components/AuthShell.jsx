import { motion } from "framer-motion"

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr,0.9fr]">
      <div className="relative hidden overflow-hidden bg-mesh-dark p-12 text-white lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_0%,transparent_35%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.14),transparent_0%,transparent_30%)]" />
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <p className="font-display text-4xl font-bold">NutriVision</p>
            <p className="mt-4 max-w-md text-lg text-slate-200">
              Turn every meal photo into a clean daily nutrition story with AI-powered tracking,
              polished analytics, and a dashboard that feels like a premium health product.
            </p>
          </div>
          <div className="glass-panel max-w-md bg-white/10 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Today</p>
            <p className="mt-4 font-display text-3xl font-semibold">Stay aware, not overwhelmed.</p>
            <p className="mt-3 text-slate-200">
              Calories, macros, and trends update as soon as each meal lands in your journal.
            </p>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-center bg-mesh-light px-4 py-12 dark:bg-mesh-dark lg:px-10"
      >
        <div className="glass-panel w-full max-w-md">
          <p className="font-display text-3xl font-semibold">{title}</p>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </motion.div>
    </div>
  )
}
