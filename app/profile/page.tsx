"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Package, User, MapPin, Phone, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { getOrdersByUserId } from "@/lib/order-service"
import { getUserById } from "@/lib/user-service"
import type { Order } from "@/lib/order-service"
import type { User as UserType } from "@/lib/user-service"

export default function ProfilePage() {
  const router = useRouter()
  const { user: authUser, isAuthenticated, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserType | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login?returnUrl=/profile")
      return
    }

    async function fetchUserData() {
      if (!authUser) return

      setLoading(true) // Set loading to true while fetching

      try {
        // Ambil data pengguna dan pesanan secara paralel
        const [userData, userOrders] = await Promise.all([
          getUserById(authUser.id),
          getOrdersByUserId(authUser.id),
        ])

        if (userData) {
          setUser(userData)
        }
        if (userOrders) {
          setOrders(userOrders)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false) // Set loading to false after fetching is done
      }
    }

    // Only fetch data if authenticated and authUser exists
    if (isAuthenticated && authUser) {
      fetchUserData()
    }
  }, [isAuthenticated, authUser, router]) // Removed loading from dependencies to prevent unnecessary rerenders

  // Handling loading and authentication state
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Memuat data...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Anda perlu login terlebih dahulu.</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Selesai</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Diproses</Badge>
      case "waiting_payment":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu Pembayaran</Badge>
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Dibatalkan</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle>{user?.name || authUser?.name || "User"}</CardTitle>
                <CardDescription>{user?.email || authUser?.email || ""}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.phone || "-"}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span>{user?.address || "-"}</span>
                </div>
                <Separator />
                <div className="pt-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/profile/edit">Edit Profil</Link>
                  </Button>
                </div>
                <div>
                  <Button variant="ghost" className="w-full text-muted-foreground" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="orders">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">Riwayat Pesanan</TabsTrigger>
              <TabsTrigger value="favorites">Favorit</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Riwayat Pesanan</h2>

              {orders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Anda belum memiliki pesanan.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/menu">Mulai Belanja</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">Pesanan #{order.id}</CardTitle>
                            <CardDescription>
                              {format(new Date(order.created_at), "d MMMM yyyy", { locale: id })}
                            </CardDescription>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="relative w-10 h-10 rounded overflow-hidden">
                                    <Image
                                      src={item.product?.image || "/placeholder.svg"}
                                      alt={item.product?.name || "Product"}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {item.product?.name || `Product #${item.product_id}`}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {item.quantity} x Rp {item.price.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm font-medium">
                                  Rp {(item.quantity * item.price).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>

                          <Separator />

                          <div className="flex justify-between">
                            <p className="font-medium">Total</p>
                            <p className="font-medium">Rp {order.total.toLocaleString()}</p>
                          </div>

                          <div className="flex justify-between text-sm">
                            <p className="text-muted-foreground">Tanggal Pengiriman</p>
                            <p>{format(new Date(order.delivery_date), "d MMMM yyyy", { locale: id })}</p>
                          </div>

                          <div className="flex justify-between text-sm">
                            <p className="text-muted-foreground">Alamat</p>
                            <p className="text-right">{order.address}</p>
                          </div>

                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/order/${order.id}`}>Lihat Detail</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Kue Favorit</h2>
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">Anda belum memiliki kue favorit.</p>
                  <Button className="mt-4" asChild>
                    <Link href="/menu">Jelajahi Menu</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}