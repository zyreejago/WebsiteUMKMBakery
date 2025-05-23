"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProduct, updateProduct, getProductById, type ProductInput } from "@/lib/product-service"
import type { ProductCategory } from "@/lib/data"

interface ProductFormProps {
  productId?: number
}

// Fungsi untuk mendeteksi file HEIC
const isHeicFile = (file: File): boolean => {
  return file.name.toLowerCase().endsWith('.heic') || 
         file.name.toLowerCase().endsWith('.heif') || 
         file.type === 'image/heic' || 
         file.type === 'image/heif'
}

// Fungsi untuk mengkonversi HEIC ke JPEG
const convertHeicToJpeg = async (file: File): Promise<File> => {
  try {
    // Dynamically import heic2any hanya ketika diperlukan
    const heic2any = (await import('heic2any')).default
    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8
    }) as Blob

    // Buat File baru dari Blob hasil konversi
    return new File([result], file.name.replace(/\.[^/.]+$/, '.jpg'), {
      type: 'image/jpeg',
      lastModified: new Date().getTime()
    })
  } catch (error) {
    console.error('Konversi HEIC gagal:', error)
    throw new Error('Gagal mengkonversi gambar HEIC')
  }
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!productId

  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProductInput>({
    name: "",
    price: 0,
    description: "",
    image: null,
    currentImageUrl: null,
    category: "Kue Kering",
    daily_limit: 50,
  })

  // Fetch product data if editing
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        setLoading(true)
        const product = await getProductById(productId)
        if (product) {
          setFormData({
            name: product.name,
            price: product.price,
            description: product.description || "",
            image: null,
            currentImageUrl: product.image,
            category: product.category as ProductCategory,
            daily_limit: product.daily_limit || 50,
          })
          setImagePreview(product.image)
        }
        setLoading(false)
      }
      fetchProduct()
    }
  }, [productId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "daily_limit" ? Number(value) : value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as ProductCategory,
    }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      let processedFile = file
      
      // Konversi HEIC ke JPEG jika perlu
      if (isHeicFile(file)) {
        processedFile = await convertHeicToJpeg(file)
      }

      setFormData((prev) => ({
        ...prev,
        image: processedFile,
      }))

      // Buat preview gambar
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(processedFile)
    } catch (error) {
      console.error("Error processing image:", error)
      alert("Gagal memproses gambar. Pastikan format gambar valid.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing) {
        await updateProduct(productId, formData)
      } else {
        await createProduct(formData)
      }
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Terjadi kesalahan saat menyimpan produk.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Memuat data...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Produk" : "Tambah Produk Baru"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Produk</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kue Kering">Kue Kering</SelectItem>
                <SelectItem value="Kue Basah">Kue Basah</SelectItem>
                <SelectItem value="Kue Loyang">Kue Loyang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Harga (Rp)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="daily_limit">Limit Harian</Label>
            <Input
              id="daily_limit"
              name="daily_limit"
              type="number"
              min="1"
              value={formData.daily_limit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Gambar Produk</Label>
            {imagePreview && (
              <div className="relative w-full h-48 mb-2">
                <Image 
                  src={imagePreview || "/placeholder.svg"} 
                  alt="Preview" 
                  fill 
                  className="object-contain"
                  unoptimized // Untuk menangani blob URL dengan benar
                />
              </div>
            )}
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*,.heic,.heif"
              onChange={handleImageChange}
              className="cursor-pointer"
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              {isEditing ? "Unggah gambar baru untuk mengganti gambar saat ini" : "Unggah gambar produk"}
              <br />
              Format HEIC/HEIF akan otomatis dikonversi ke JPG
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Produk"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}