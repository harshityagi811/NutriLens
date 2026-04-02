import { createContext, useEffect, useMemo, useState } from "react"
import api from "../api/client"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("nutrivision_user")
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem("nutrivision_token"))

  useEffect(() => {
    if (token) {
      localStorage.setItem("nutrivision_token", token)
    } else {
      localStorage.removeItem("nutrivision_token")
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem("nutrivision_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("nutrivision_user")
    }
  }, [user])

  const login = async (payload) => {
    const { data } = await api.post("/login", payload)
    setToken(data.access_token)
    setUser(data.user)
  }

  const register = async (payload) => {
    const { data } = await api.post("/register", payload)
    setToken(data.access_token)
    setUser(data.user)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, token, login, register, logout, isAuthenticated: Boolean(token) }),
    [user, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
