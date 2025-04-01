"use client"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Package, User, MapPin, Phone, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { orders, products } from "@/lib/data"

export default function ProfilePage() {
  // In a real app, you would fetch the user data from your API
  const user = {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    phone: "081234567891",
    address: "Jl. Contoh No. 123, Jakarta",
  }

  // Filter orders for this user
  const userOrders = orders.filter((order) => order.userId === user.id)

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
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span>{user.address}</span>
                </div>
                <Separator />
                <div className="pt-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/profile/edit">Edit Profil</Link>
                  </Button>
                </div>
                <div>
                  <Button variant="ghost" className="w-full text-muted-foreground" asChild>
                    <Link href="/login">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Link>
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

              {userOrders.length === 0 ? (
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
                  {userOrders.map((order) => {
                    // Get product details for each item in the order
                    const orderItems = order.items.map((item) => {
                      const product = products.find((p) => p.id === item.productId)
                      return {
                        ...item,
                        product,
                      }
                    })

                    return (
                      <Card key={order.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">Pesanan #{order.id}</CardTitle>
                              <CardDescription>
                                {format(new Date(order.createdAt), "d MMMM yyyy", { locale: id })}
                              </CardDescription>
                            </div>
                            <Badge
                              className={
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : order.status === "waiting_payment"
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                              }
                            >
                              {order.status === "completed"
                                ? "Selesai"
                                : order.status === "processing"
                                  ? "Diproses"
                                  : order.status === "waiting_payment"
                                    ? "Menunggu Pembayaran"
                                    : "Pending"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              {orderItems.map((item, index) => (
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
                                      <p className="text-sm font-medium">{item.product?.name}</p>
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
                              <p>{format(new Date(order.deliveryDate), "d MMMM yyyy", { locale: id })}</p>
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
                    )
                  })}
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

