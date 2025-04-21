"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { updateUser } from "@/lib/user-service" // pastikan kamu memiliki fungsi updateUser

export default function EditProfilePage() {
  const router = useRouter()
  const { user: authUser, isAuthenticated, logout } = useAuth()

  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?returnUrl=/profile/edit")
    }

    if (authUser) {
      setUser({
        name: authUser.name || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        address: authUser.address || ''
      })
    }
  }, [isAuthenticated, authUser, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
  
    try {
      // Memanggil updateUser dengan dua argumen: ID pengguna dan data pengguna yang diubah
      if (authUser) {
        await updateUser(authUser.id, user) // Mengirimkan ID dan data pengguna
      }
      router.push("/profile")
    } catch (err) {
      setError("Gagal memperbarui profil. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }
  

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Memperbarui data...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-1 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Edit Profil</CardTitle>
              <CardDescription>Perbarui informasi pribadi Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nama</label>
                  <Input
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    placeholder="Nama Lengkap"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Nomor Telepon</label>
                  <Input
                    id="phone"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    placeholder="Nomor Telepon"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">Alamat</label>
                  <Input
                    id="address"
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                    placeholder="Alamat"
                    className="w-full"
                  />
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between">
                  <Button variant="outline" className="w-full" onClick={() => router.push('/profile')}>
                    Kembali
                  </Button>
                  <Button variant="outline"  type="submit" className="w-full">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
