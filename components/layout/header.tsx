"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Cake, Menu, ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Cara Pesan", path: "/how-to-order" },
    { name: "Tentang Kami", path: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-4 py-4">
                <Link href="/" className="flex items-center gap-2 px-2" onClick={() => setIsOpen(false)}>
                  <Cake className="h-5 w-5" />
                  <span className="font-bold">Bakery UMKM</span>
                </Link>
                <div className="flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`px-2 py-1 rounded-md ${
                        isActive(item.path) ? "bg-muted font-medium" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/order"
                    className="bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/90"
                    onClick={() => setIsOpen(false)}
                  >
                    Pesan Sekarang
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <Cake className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">Bakery UMKM</span>
          </Link>
        </div>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <Link href={item.path} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle({
                      className: isActive(item.path) ? "bg-muted" : "",
                    })}
                  >
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Button asChild variant="outline" size="icon">
                  <Link href="/admin">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="sr-only">Admin Dashboard</span>
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="icon">
                <Link href="/profile">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <Link href="/order">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <Link href="/order">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>
            </>
          )}
          <Button asChild className="hidden sm:flex">
            <Link href="/order">Pesan Sekarang</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

