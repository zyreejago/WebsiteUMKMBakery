"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Package, ShoppingCart, Users, Settings, LogOut, Menu, Cake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/login")
    }
  }, [loading, isAdmin, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <p>Loading...</p>
      </div>
    )
  }

  // Don't render the admin layout for non-admin users
  if (!isAdmin) {
    return null
  }

  const isActive = (path: string) => pathname === path

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: BarChart3 },
    { name: "Pesanan", path: "/admin/orders", icon: ShoppingCart },
    { name: "Produk", path: "/admin/products", icon: Package },
    { name: "Pelanggan", path: "/admin/customers", icon: Users },
    { name: "Pengaturan", path: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r">
        <div className="p-4 border-b">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
            <Cake className="h-6 w-6" />
            <span>Dapur Madu</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                  isActive(item.path) ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name || "Admin"}</p>
              <p className="text-sm text-muted-foreground">{user?.email || "admin@bakeryumkm.com"}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/login">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Link>
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden absolute top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4 border-b">
            <Link href="/admin" className="flex items-center gap-2 font-bold text-xl" onClick={() => setIsOpen(false)}>
              <Cake className="h-6 w-6" />
              <span>Dapur Madu</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive(item.path) ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name || "Admin"}</p>
                <p className="text-sm text-muted-foreground">{user?.email || "admin@bakeryumkm.com"}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  )
}

