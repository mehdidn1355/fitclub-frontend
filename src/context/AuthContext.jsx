import { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '../api/endpoints'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('fitclub-user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email, password })
      localStorage.setItem('fitclub-token', data.access_token)
      localStorage.setItem('fitclub-user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'خطا در ورود',
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const { data } = await authAPI.register(payload)
      localStorage.setItem('fitclub-token', data.access_token)
      localStorage.setItem('fitclub-user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'خطا در ثبت‌نام',
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('fitclub-token')
    localStorage.removeItem('fitclub-user')
    setUser(null)
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'
  const isTrainer = user?.role === 'trainer' || isAdmin
  const isCustomer = user?.role === 'customer'

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isTrainer,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth باید داخل AuthProvider استفاده بشه')
  return ctx
}