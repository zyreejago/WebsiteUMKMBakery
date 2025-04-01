"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getOrderById, updateOrderPaymentProof, type Order, type OrderItem } from "@/lib/order-service"
import { useAuth } from "@/lib/auth-context"

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  // Use React.use() to unwrap the params Promise
  const unwrappedParams = React.use(params)
  const orderId = Number.parseInt(unwrappedParams.id)

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated && !loading) {
      router.push("/login")
      return
    }

    async function fetchOrder() {
      setLoading(true)
      const data = await getOrderById(orderId)

      // Only allow access to the user's own orders
      if (data && data.user_id === user?.id) {
        setOrder(data)
      } else {
        // Redirect if the order doesn't exist or doesn't belong to the user
        router.push("/profile")
      }

      setLoading(false)
    }

    if (isAuthenticated) {
      fetchOrder()
    }
  }, [orderId, isAuthenticated, user, router])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !order) return

    setUploading(true)
    try {
      const updatedOrder = await updateOrderPaymentProof(orderId, file)
      if (updatedOrder) {
        setOrder(updatedOrder)
        alert("Bukti pembayaran berhasil diunggah!")
      } else {
        alert("Gagal mengunggah bukti pembayaran.")
      }
    } catch (error) {
      console.error("Error uploading payment proof:", error)
      alert("Terjadi kesalahan saat mengunggah bukti pembayaran.")
    } finally {
      setUploading(false)
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
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Detail Pesanan</h1>
        </div>
        <div className="text-center py-8">Memuat data...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4">
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
              <Link href="/profile">Kembali ke Profil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
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
                      <p className="font-medium">{item.product?.name || `Product #${item.product_id}`}</p>
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
              <CardTitle>Status Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${order.status !== "cancelled" ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <p className="font-medium">Pesanan Dibuat</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${order.status === "waiting_payment" || order.status === "processing" || order.status === "completed" ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <p className="font-medium">Menunggu Pembayaran</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${order.status === "processing" || order.status === "completed" ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <p className="font-medium">Diproses</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${order.status === "completed" ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <p className="font-medium">Selesai</p>
                </div>
                {order.status === "cancelled" && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <p className="font-medium">Dibatalkan</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">Belum ada bukti pembayaran.</p>
                  {order.status === "pending" || order.status === "waiting_payment" ? (
                    <>
                      <input
                        id="payment-proof"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="payment-proof"
                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90"
                      >
                        <Upload className="h-4 w-4" />
                        {uploading ? "Mengunggah..." : "Unggah Bukti Pembayaran"}
                      </label>
                    </>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bantuan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Jika Anda memiliki pertanyaan atau masalah dengan pesanan ini, silakan hubungi kami.
              </p>
              <Button className="w-full" asChild>
                <Link href="mailto:info@bakeryumkm.com">Hubungi Kami</Link>
              </Button>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/profile">Kembali ke Profil</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

