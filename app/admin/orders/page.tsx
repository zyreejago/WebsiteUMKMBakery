"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Eye, Search, Check, X, MoreHorizontal, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOrders, updateOrderStatus, type Order, type OrderStatus } from "@/lib/order-service"
import AdminLayout from "@/components/admin/admin-layout"

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const data = await getOrders()
    setOrders(data)
    setLoading(false)
  }

  async function handleRefresh() {
    setRefreshing(true)
    await fetchOrders()
    setRefreshing(false)
  }

  async function handleUpdateStatus(orderId: number, status: OrderStatus) {
    const confirmMessage =
      status === "processing"
        ? "Terima pembayaran untuk pesanan ini?"
        : status === "completed"
          ? "Selesaikan pesanan ini?"
          : "Batalkan pesanan ini?"

    if (confirm(confirmMessage)) {
      const updatedOrder = await updateOrderStatus(orderId, status)
      if (updatedOrder) {
        // Update the order in the local state
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))
        alert("Status pesanan berhasil diubah.")
      } else {
        alert("Gagal mengubah status pesanan.")
      }
    }
  }

  const filteredOrders = orders
    .filter((order) => statusFilter === "all" || order.status === statusFilter)
    .filter((order) => {
      const customerName = order.user?.name?.toLowerCase() || ""
      const orderId = order.id.toString()

      return orderId.includes(searchQuery.toLowerCase()) || customerName.includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

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
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Daftar Pesanan</h1>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pesanan..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="waiting_payment">Menunggu Pembayaran</SelectItem>
            <SelectItem value="processing">Diproses</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Tanggal Pemesanan</TableHead>
              <TableHead>Tanggal Pengiriman</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">Memuat data...</p>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">Tidak ada pesanan yang ditemukan.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.user?.name || "Unknown"}</TableCell>
                  <TableCell>{format(new Date(order.created_at), "d MMM yyyy", { locale: id })}</TableCell>
                  <TableCell>{format(new Date(order.delivery_date), "d MMM yyyy", { locale: id })}</TableCell>
                  <TableCell>Rp {order.total.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </Link>
                        </DropdownMenuItem>
                        {order.status === "waiting_payment" && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "processing")}>
                            <Check className="h-4 w-4 mr-2" />
                            Terima Pembayaran
                          </DropdownMenuItem>
                        )}
                        {order.status === "processing" && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "completed")}>
                            <Check className="h-4 w-4 mr-2" />
                            Selesaikan Pesanan
                          </DropdownMenuItem>
                        )}
                        {(order.status === "waiting_payment" || order.status === "pending") && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "cancelled")}>
                            <X className="h-4 w-4 mr-2" />
                            Batalkan Pesanan
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  )
}

