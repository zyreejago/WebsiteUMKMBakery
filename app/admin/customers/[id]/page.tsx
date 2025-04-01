"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ArrowLeft, Mail, Phone, MapPin, Package, Calendar, User, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { getUserById, deleteUser, type User as UserType } from "@/lib/user-service"
import { getOrdersByUserId, type Order } from "@/lib/order-service"
import AdminLayout from "@/components/admin/admin-layout"

interface CustomerDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const router = useRouter()
  // Use React.use() to unwrap the params Promise
  const unwrappedParams = React.use(params)
  const customerId = Number.parseInt(unwrappedParams.id)

  const [customer, setCustomer] = useState<UserType | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const customerData = await getUserById(customerId)

      if (customerData) {
        setCustomer(customerData)

        // Fetch customer orders
        const ordersData = await getOrdersByUserId(customerId)
        setOrders(ordersData)
      }

      setLoading(false)
    }

    fetchData()
  }, [customerId])

  const handleDeleteCustomer = async () => {
    setDeleting(true)
    try {
      const success = await deleteUser(customerId)
      if (success) {
        alert("Pelanggan berhasil dihapus.")
        router.push("/admin/customers")
      } else {
        alert("Gagal menghapus pelanggan.")
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      alert("Terjadi kesalahan saat menghapus pelanggan.")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
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
          <h1 className="text-3xl font-bold">Detail Pelanggan</h1>
        </div>
        <div className="text-center py-8">Memuat data...</div>
      </AdminLayout>
    )
  }

  if (!customer) {
    return (
      <AdminLayout>
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Detail Pelanggan</h1>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Pelanggan tidak ditemukan.</p>
            <Button className="mt-4" asChild>
              <Link href="/admin/customers">Kembali ke Daftar Pelanggan</Link>
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
          <h1 className="text-3xl font-bold">Detail Pelanggan</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/customers/edit/${customer.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-2">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">{customer.name}</h2>
                <p className="text-muted-foreground">{customer.email}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telepon</p>
                    <p>{customer.phone || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Alamat</p>
                    <p>{customer.address || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Daftar</p>
                    <p>
                      {customer.created_at ? format(new Date(customer.created_at), "d MMMM yyyy", { locale: id }) : "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full" asChild>
                  <Link href={`mailto:${customer.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Kirim Email
                  </Link>
                </Button>
                {customer.phone && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`tel:${customer.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Hubungi
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="orders">
            <TabsList className="mb-4">
              <TabsTrigger value="orders">Riwayat Pesanan</TabsTrigger>
              <TabsTrigger value="stats">Statistik</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Pesanan</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Pelanggan ini belum memiliki pesanan.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-4 border rounded-md">
                          <div>
                            <div className="font-medium">Pesanan #{order.id}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), "d MMMM yyyy", { locale: id })}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-medium">Rp {order.total.toLocaleString()}</div>
                              <div>{getStatusBadge(order.status)}</div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/orders/${order.id}`}>Lihat</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button asChild>
                    <Link href={`/admin/orders/add?customer=${customer.id}`}>Buat Pesanan Baru</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Statistik Pelanggan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{orders.length}</div>
                          <p className="text-muted-foreground">Total Pesanan</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">
                            Rp {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                          </div>
                          <p className="text-muted-foreground">Total Pembelian</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">
                            {orders.filter((order) => order.status === "completed").length}
                          </div>
                          <p className="text-muted-foreground">Pesanan Selesai</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">
                            {orders.length > 0
                              ? format(
                                  new Date(Math.max(...orders.map((order) => new Date(order.created_at).getTime()))),
                                  "d MMM yyyy",
                                  { locale: id },
                                )
                              : "-"}
                          </div>
                          <p className="text-muted-foreground">Pesanan Terakhir</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pelanggan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pelanggan ini? Semua data pesanan terkait juga akan dihapus. Tindakan
              ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer} disabled={deleting}>
              {deleting ? "Menghapus..." : "Hapus Pelanggan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

