"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUser, type UserRole } from "@/lib/user-service"
import AdminLayout from "@/components/admin/admin-layout"

export default function AddCustomerPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "customer" as UserRole,
  })
  const [error, setError] = useState("")

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
    setError("")
    setSaving(true)

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Semua field wajib diisi")
      setSaving(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok")
      setSaving(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      setSaving(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid")
      setSaving(false)
      return
    }

    try {
      const newUser = await createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        address: formData.address || null,
        phone: formData.phone || null,
      })

      if (newUser) {
        alert("Pelanggan berhasil ditambahkan.")
        router.push("/admin/customers")
      } else {
        setError("Email sudah terdaftar atau terjadi kesalahan saat menambahkan pelanggan.")
      }
    } catch (error) {
      console.error("Error creating customer:", error)
      setError("Terjadi kesalahan saat menambahkan pelanggan.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" className="mr-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Tambah Pelanggan Baru</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informasi Pelanggan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}

            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">Password minimal 6 karakter</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
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
              {saving ? "Menyimpan..." : "Tambah Pelanggan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AdminLayout>
  )
}

