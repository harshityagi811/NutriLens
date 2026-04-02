import { Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { useAuth } from "./hooks/useAuth"
import { useTheme } from "./hooks/useTheme"
import ProtectedRoute from "./components/ProtectedRoute"
import AppLayout from "./components/AppLayout"
import DashboardPage from "./pages/DashboardPage"
import UploadMealPage from "./pages/UploadMealPage"
import HistoryPage from "./pages/HistoryPage"
import BMICalculatorPage from "./pages/BMICalculatorPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

function AppRoutes() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/upload-meal" element={<UploadMealPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/bmi" element={<BMICalculatorPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
