import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts"

const macroColors = ["#34d399", "#60a5fa", "#fb7185"]

export function MacroPieCard({ data }) {
  return (
    <div className="soft-card p-6">
      <div className="mb-4">
        <h3 className="font-display text-xl font-semibold">Macro Split</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Today’s carbs, protein and fats</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={68} outerRadius={95}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={macroColors[index % macroColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {data.map((item, index) => (
          <span
            key={item.name}
            className="rounded-full px-3 py-1 text-sm"
            style={{ backgroundColor: `${macroColors[index]}20`, color: macroColors[index] }}
          >
            {item.name}: {item.value}g
          </span>
        ))}
      </div>
    </div>
  )
}

export function DailyCaloriesCard({ data }) {
  return (
    <div className="soft-card p-6">
      <h3 className="font-display text-xl font-semibold">Daily Calories</h3>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Last 7 days of intake</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="calories" fill="#1f9c62" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function TrendLineCard({ title, subtitle, data }) {
  return (
    <div className="soft-card p-6">
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="calories" stroke="#38bdf8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
