"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getQrisSettings, updateQrisSettings, type QrisSettings } from "@/lib/qris-service"
import AdminLayout from "@/components/admin/admin-layout"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [qrisSettings, setQrisSettings] = useState<QrisSettings | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    image: null as File | null,
    currentImageUrl: null as string | null,
  })

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true)
      const settings = await getQrisSettings()

      if (settings) {
        setQrisSettings(settings)
        setFormData({
          name: settings.name,
          number: settings.number,
          image: null,
          currentImageUrl: settings.image,
        })
        setImagePreview(settings.image)
      }

      setLoading(false)
    }

    fetchSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveQris = async () => {
    setSaving(true)

    try {
      const result = await updateQrisSettings({
        name: formData.name,
        number: formData.number,
        image: formData.image,
        currentImageUrl: formData.currentImageUrl,
      })

      if (result) {
        setQrisSettings(result)
        setFormData({
          name: result.name,
          number: result.number,
          image: null,
          currentImageUrl: result.image,
        })
        alert("Pengaturan QRIS berhasil disimpan!")
      } else {
        alert("Terjadi kesalahan saat menyimpan pengaturan QRIS.")
      }
    } catch (error) {
      console.error("Error saving QRIS settings:", error)
      alert("Terjadi kesalahan saat menyimpan pengaturan QRIS.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Pengaturan</h1>
      </div>

      <Tabs defaultValue="payment">
        <TabsList className="mb-6">
          <TabsTrigger value="payment">Pembayaran</TabsTrigger>
          <TabsTrigger value="account">Akun</TabsTrigger>
          <TabsTrigger value="store">Toko</TabsTrigger>
        </TabsList>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan QRIS</CardTitle>
              <CardDescription>Kelola kode QRIS untuk pembayaran pelanggan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="text-center py-4">Memuat data...</div>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="qris-image">Kode QRIS</Label>
                    <div className="flex flex-col items-center gap-4 border rounded-md p-6">
                      <div className="relative w-64 h-64">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="QRIS Code"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{formData.name}</p>
                        <p className="text-muted-foreground">{formData.number}</p>
                      </div>
                    </div>
                    <div className="grid gap-4 mt-4">
                      <input
                        id="qris-image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="qris-image"
                        className="flex items-center justify-center border rounded-md p-3 cursor-pointer hover:bg-muted"
                      >
                        <span>Upload QRIS Baru</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Nama Penerima</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="number">Nomor QRIS</Label>
                    <Input id="number" name="number" value={formData.number} onChange={handleChange} />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveQris} disabled={loading || saving}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Akun</CardTitle>
              <CardDescription>Kelola informasi akun admin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="admin-name">Nama</Label>
                <Input id="admin-name" defaultValue="Admin" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" defaultValue="admin@bakeryumkm.com" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="admin-password">Password Baru</Label>
                <Input id="admin-password" type="password" placeholder="••••••••" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="admin-confirm-password">Konfirmasi Password</Label>
                <Input id="admin-confirm-password" type="password" placeholder="••••••••" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Simpan Perubahan</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Toko</CardTitle>
              <CardDescription>Kelola informasi toko</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="store-name">Nama Toko</Label>
                <Input id="store-name" defaultValue="Bakery UMKM" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="store-address">Alamat</Label>
                <Input id="store-address" defaultValue="Jl. Kue Lezat No. 123, Kota Rasa, Indonesia" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="store-phone">Nomor Telepon</Label>
                <Input id="store-phone" defaultValue="+62 812-3456-7890" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="store-email">Email</Label>
                <Input id="store-email" type="email" defaultValue="info@bakeryumkm.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Simpan Perubahan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}

