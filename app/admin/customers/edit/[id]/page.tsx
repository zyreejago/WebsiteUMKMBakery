"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserById, updateUser, type UserRole } from "@/lib/user-service"
import AdminLayout from "@/components/admin/admin-layout"

interface EditCustomerPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditCustomerPage({ params }: EditCustomerPageProps) {
  const router = useRouter()
  // Use React.use() to unwrap the params Promise
  const unwrappedParams = React.use(params)
  const customerId = Number.parseInt(unwrappedParams.id)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "customer" as UserRole,
  })

  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true)
      const customer = await getUserById(customerId)
      if (customer) {
        setFormData({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || "",
          address: customer.address || "",
          role: customer.role as UserRole,
        })
      } else {
        // Redirect if customer not found
        router.push("/admin/customers")
      }
      setLoading(false)
    }

    fetchCustomer()
  }, [customerId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value as UserRole,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updatedCustomer = await updateUser(customerId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        address: formData.address || null,
        role: formData.role,
      })

      if (updatedCustomer) {
        alert("Data pelanggan berhasil diperbarui.")
        router.push(`/admin/customers/${customerId}`)
      } else {
        alert("Gagal memperbarui data pelanggan.")
      }
    } catch (error) {
      console.error("Error updating customer:", error)
      alert("Terjadi kesalahan saat memperbarui data pelanggan.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Pelanggan</h1>
        </div>
        <div className="text-center py-8">Memuat data...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" className="mr-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Pelanggan</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informasi Pelanggan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Peran</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Pelanggan</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AdminLayout>
  )
}

