import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("nutrivision_theme") || "dark")

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    localStorage.setItem("nutrivision_theme", theme)
  }, [theme])

  return {
    theme,
    toggleTheme: () => setTheme((value) => (value === "dark" ? "light" : "dark")),
  }
}
