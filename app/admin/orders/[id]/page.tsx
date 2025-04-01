"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getOrderById, updateOrderStatus, type Order, type OrderItem } from "@/lib/order-service"
import AdminLayout from "@/components/admin/admin-layout"

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter()
  // Use React.use() to unwrap the params Promise
  const unwrappedParams = React.use(params)
  const orderId = Number.parseInt(unwrappedParams.id)

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true)
      const data = await getOrderById(orderId)
      setOrder(data)
      setLoading(false)
    }

    fetchOrder()
  }, [orderId])

  const handleUpdateStatus = async (status: "processing" | "completed" | "cancelled") => {
    if (!order) return

    setUpdating(true)
    try {
      const updatedOrder = await updateOrderStatus(orderId, status)
      if (updatedOrder) {
        setOrder(updatedOrder)
        alert(
          status === "processing"
            ? "Pembayaran diterima! Status pesanan diubah menjadi Diproses."
            : status === "completed"
              ? "Pesanan telah diselesaikan!"
              : "Pesanan telah dibatalkan!",
        )
      } else {
        alert("Gagal mengubah status pesanan.")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Terjadi kesalahan saat mengubah status pesanan.")
    } finally {
      setUpdating(false)
    }
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Detail Pesanan</h1>
        </div>
        <div className="text-center py-8">Memuat data...</div>
      </AdminLayout>
    )
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Detail Pesanan</h1>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Pesanan tidak ditemukan.</p>
            <Button className="mt-4" asChild>
              <Link href="/admin/orders">Kembali ke Daftar Pesanan</Link>
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="icon" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Detail Pesanan #{order.id}</h1>
        </div>
        <div>{getStatusBadge(order.status)}</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Pemesanan</p>
                  <p className="font-medium">
                    {format(new Date(order.created_at), "d MMMM yyyy, HH:mm", { locale: id })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Pengiriman</p>
                  <p className="font-medium">{format(new Date(order.delivery_date), "d MMMM yyyy", { locale: id })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pelanggan</p>
                  <p className="font-medium">
                    {order.user?.name ? (
                      <Link href={`/admin/customers/${order.user_id}`} className="hover:underline">
                        {order.user.name}
                      </Link>
                    ) : (
                      "Unknown"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.user?.email || "Unknown"}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Alamat Pengiriman</p>
                <p className="font-medium">{order.address}</p>
              </div>

              {order.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Catatan</p>
                  <p className="font-medium">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Item Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: OrderItem) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product?.image || "/placeholder.svg"}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">
                        {item.product?.name ? (
                          <Link href={`/admin/products/edit/${item.product_id}`} className="hover:underline">
                            {item.product.name}
                          </Link>
                        ) : (
                          `Product #${item.product_id}`
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x Rp {item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-medium">Rp {(item.quantity * item.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>Rp {order.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bukti Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              {order.payment_proof ? (
                <div className="relative w-full h-64">
                  <Image
                    src={order.payment_proof || "/placeholder.svg"}
                    alt="Bukti Pembayaran"
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Belum ada bukti pembayaran.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.status === "waiting_payment" && (
                <Button className="w-full" onClick={() => handleUpdateStatus("processing")} disabled={updating}>
                  <Check className="h-4 w-4 mr-2" />
                  Terima Pembayaran
                </Button>
              )}

              {order.status === "processing" && (
                <Button className="w-full" onClick={() => handleUpdateStatus("completed")} disabled={updating}>
                  <Check className="h-4 w-4 mr-2" />
                  Selesaikan Pesanan
                </Button>
              )}

              {(order.status === "waiting_payment" || order.status === "pending") && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleUpdateStatus("cancelled")}
                  disabled={updating}
                >
                  <X className="h-4 w-4 mr-2" />
                  Batalkan Pesanan
                </Button>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/orders">Kembali ke Daftar Pesanan</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

