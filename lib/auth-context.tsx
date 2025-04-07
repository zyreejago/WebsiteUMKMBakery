"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authenticateUser, getUserById, type User } from "@/lib/user-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, redirectUrl?: string) => Promise<boolean>
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
            localStorage.removeItem("userRole")
          }
        } catch (error) {
          console.error("Error checking session:", error)
          localStorage.removeItem("userId")
          localStorage.removeItem("userRole")
        }
      }

      setLoading(false)
    }

    checkSession()
  }, [])

  // Update the login function to store the user role in localStorage and handle redirects
  const login = async (email: string, password: string, redirectUrl?: string) => {
    try {
      const userData = await authenticateUser(email, password)

      if (userData) {
        setUser(userData)
        localStorage.setItem("userId", userData.id.toString())
        localStorage.setItem("userRole", userData.role)

        // Handle redirection based on user role
        if (redirectUrl) {
          // If a specific redirect URL is provided, use it
          router.push(redirectUrl)
        } else {
          // Otherwise redirect based on role
          if (userData.role === "admin") {
            router.push("/admin")
          } else {
            router.push("/")
          }
        }

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

