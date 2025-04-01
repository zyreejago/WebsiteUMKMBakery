"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Search, Mail, Phone, MoreHorizontal, RefreshCw, User, Trash2, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { getUsers, deleteUser, type User as UserType } from "@/lib/user-service"
import AdminLayout from "@/components/admin/admin-layout"

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    setLoading(true)
    const allUsers = await getUsers()
    // Filter only customers (users with role "customer")
    const customerUsers = allUsers.filter((user) => user.role === "customer")
    setCustomers(customerUsers)
    setLoading(false)
  }

  async function handleRefresh() {
    setRefreshing(true)
    await fetchCustomers()
    setRefreshing(false)
  }

  function openDeleteDialog(id: number) {
    setCustomerToDelete(id)
    setDeleteDialogOpen(true)
  }

  async function handleDeleteCustomer() {
    if (!customerToDelete) return

    setDeleting(true)
    try {
      const success = await deleteUser(customerToDelete)
      if (success) {
        setCustomers(customers.filter((customer) => customer.id !== customerToDelete))
        alert("Pelanggan berhasil dihapus.")
      } else {
        alert("Gagal menghapus pelanggan.")
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      alert("Terjadi kesalahan saat menghapus pelanggan.")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setCustomerToDelete(null)
    }
  }

  const filteredCustomers = customers
    .filter((customer) => {
      const name = customer.name.toLowerCase()
      const email = customer.email.toLowerCase()
      const query = searchQuery.toLowerCase()

      return name.includes(query) || email.includes(query)
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Daftar Pelanggan</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/admin/customers/add">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pelanggan
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pelanggan..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
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
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">Tidak ada pelanggan yang ditemukan.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">#{customer.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Link href={`/admin/customers/${customer.id}`} className="hover:underline">
                        {customer.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || "-"}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{customer.address || "-"}</TableCell>
                  <TableCell>
                    {customer.created_at ? format(new Date(customer.created_at), "dd/MM/yyyy") : "-"}
                  </TableCell>
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
                          <Link href={`/admin/customers/${customer.id}`}>
                            <User className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/customers/edit/${customer.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`mailto:${customer.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Kirim Email
                          </Link>
                        </DropdownMenuItem>
                        {customer.phone && (
                          <DropdownMenuItem asChild>
                            <Link href={`tel:${customer.phone}`}>
                              <Phone className="h-4 w-4 mr-2" />
                              Hubungi
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(customer.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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

