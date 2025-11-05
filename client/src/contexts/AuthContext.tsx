import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/apiClient'

type User = { id: string; name: string; email: string }

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t && u) {
      setToken(t)
      setUser(JSON.parse(u))
    }
  }, [])

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password })
    const { token: tk, user: usr } = res.data
    localStorage.setItem('token', tk)
    localStorage.setItem('user', JSON.stringify(usr))
    setToken(tk)
    setUser(usr)
  }

  async function signup(name: string, email: string, password: string) {
    const res = await api.post('/auth/signup', { name, email, password })
    const { token: tk, user: usr } = res.data
    localStorage.setItem('token', tk)
    localStorage.setItem('user', JSON.stringify(usr))
    setToken(tk)
    setUser(usr)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ user, token, login, signup, logout }), [user, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

