import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

export default function AppLayout({ theme, toggleTheme }) {
  return (
    <div className="min-h-screen bg-mesh-light transition-colors duration-300 dark:bg-mesh-dark">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
