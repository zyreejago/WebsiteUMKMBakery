"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import type { Product, ProductCategory } from "@/lib/data" // Keep the types

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const categories: ProductCategory[] = ["Kue Kering", "Kue Basah", "Kue Loyang"]

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase.from("products").select("*")

      if (error) {
        console.error("Error fetching products:", error)
      } else if (data) {
        // Convert the Supabase data to our Product type
        const formattedProducts: Product[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description || "",
          image: item.image || "/placeholder.svg?height=300&width=300",
          category: item.category as ProductCategory,
          dailyLimit: item.daily_limit || 50,
        }))
        setProducts(formattedProducts)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const filteredProducts = (category: ProductCategory) => {
    return products
      .filter((product) => product.category === category)
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Menu Kami</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Pilih dari berbagai macam kue homemade berkualitas kami. Semua produk dibuat dengan bahan-bahan pilihan dan
          resep tradisional untuk memberikan cita rasa terbaik.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Cari kue..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Memuat produk...</p>
        </div>
      ) : (
        <Tabs defaultValue="Kue Kering" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              {filteredProducts(category).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Tidak ada produk yang ditemukan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts(category).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <span className="font-medium text-primary">Rp {product.price.toLocaleString()}</span>
        </div>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{product.description}</p>
        <Button asChild className="w-full mt-auto">
          <Link href={`/order?product=${product.id}`}>Pesan Sekarang</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

