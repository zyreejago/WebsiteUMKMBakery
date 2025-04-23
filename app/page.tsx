import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/data" // Keep the type

// This is a server component, so we can fetch data directly
async function getFeaturedProducts(): Promise<Product[]> {
  // Get 3 random products
  const { data, error } = await supabase.from("products").select("*").limit(3)

  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }

  // Convert the Supabase data to our Product type
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    description: item.description || "",
    image: item.image || "/placeholder.svg?height=300&width=300",
    category: item.category as any,
    dailyLimit: item.daily_limit || 50,
  }))
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&h=500&auto=format&fit=crop"
          alt="Bakery Hero"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Rasa Rumahan, Cita Rasa Istimewa
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
          Kami percaya, makanan terbaik adalah yang dibuat dengan hati, karena rasa enak dimulai dari niat baik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/menu">
                Lihat Menu
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link href="/order">Pesan Sekarang</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=600&h=400&auto=format&fit=crop"
                alt="About Us"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>
              <p className="text-muted-foreground mb-4">
              Dapur Madu adalah usaha kuliner rumahan yang telah berdiri sejak tahun 2012. Berawal dari dapur kecil penuh semangat, kami tumbuh dengan satu tujuan: menghadirkan masakan lezat dan hangat seperti buatan rumah sendiri.</p>
              <p className="text-muted-foreground mb-6">
                Kami menggunakan bahan-bahan segar dan berkualitas tinggi untuk memastikan setiap gigitan memberikan
                pengalaman yang tak terlupakan. Semua produk kami dibuat fresh setiap hari berdasarkan pesanan.
              </p>
              <Button asChild variant="outline">
                <Link href="/menu">Pelajari Lebih Lanjut</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Menu Favorit</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <span className="font-medium text-primary">Rp {product.price.toLocaleString()}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                  <Button asChild className="w-full">
                    <Link href={`/order?product=${product.id}`}>Pesan Sekarang</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href="/menu">
                Lihat Semua Menu
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="py-16 px-4 bg-accent/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Cara Pemesanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Pilih Menu</h3>
              <p className="text-muted-foreground">Pilih kue favorit Anda dari berbagai pilihan menu yang tersedia</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Tentukan Tanggal</h3>
              <p className="text-muted-foreground">
                Pilih tanggal pengiriman yang Anda inginkan (minimal H-2 pemesanan)
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Lakukan Pembayaran</h3>
              <p className="text-muted-foreground">Bayar melalui QRIS dan upload bukti pembayaran untuk konfirmasi</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

