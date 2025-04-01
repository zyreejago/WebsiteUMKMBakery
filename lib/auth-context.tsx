"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authenticateUser, getUserById, type User } from "@/lib/user-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const userId = localStorage.getItem("userId")

      if (userId) {
        try {
          const userData = await getUserById(Number.parseInt(userId))
          if (userData) {
            setUser(userData)
          } else {
            localStorage.removeItem("userId")
          }
        } catch (error) {
          console.error("Error checking session:", error)
          localStorage.removeItem("userId")
        }
      }

      setLoading(false)
    }

    checkSession()
  }, [])

  // Update the login function to store the user role in localStorage
  const login = async (email: string, password: string) => {
    try {
      const userData = await authenticateUser(email, password)

      if (userData) {
        setUser(userData)
        localStorage.setItem("userId", userData.id.toString())
        localStorage.setItem("userRole", userData.role)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // Update the logout function to also remove the role
  const logout = () => {
    setUser(null)
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  const isAuthenticated = !!user
  const isAdmin = isAuthenticated && user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

