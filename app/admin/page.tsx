"use client"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Package, ShoppingCart, Users, DollarSign, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { orders, products, users } from "@/lib/data"
import AdminLayout from "@/components/admin/admin-layout"

export default function AdminDashboard() {
  // Calculate some statistics
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalProducts = products.length
  const totalCustomers = users.filter((user) => user.role === "customer").length

  // Get recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/orders">Lihat Semua Pesanan</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesanan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+12.5% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">+3 produk baru bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+7.2% dari bulan lalu</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
            <CardDescription>{recentOrders.length} pesanan terbaru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const customer = users.find((user) => user.id === order.userId)

                return (
                  <div key={order.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{customer?.name || "Unknown Customer"}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), "d MMMM yyyy", { locale: id })}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">Rp {order.total.toLocaleString()}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/admin/orders">
                Lihat Semua Pesanan
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Pesanan Mendatang</CardTitle>
            <CardDescription>Pesanan yang akan dikirim dalam 7 hari ke depan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders
                .filter(
                  (order) =>
                    new Date(order.deliveryDate) > new Date() &&
                    new Date(order.deliveryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                )
                .slice(0, 5)
                .map((order) => {
                  const customer = users.find((user) => user.id === order.userId)

                  return (
                    <div key={order.id} className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{customer?.name || "Unknown Customer"}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.deliveryDate), "d MMMM yyyy", { locale: id })}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">Rp {order.total.toLocaleString()}</div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

