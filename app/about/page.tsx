import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tentang Kami</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Mengenal lebih dekat Bakery UMKM, perjalanan kami, dan komitmen kami untuk menyajikan kue berkualitas.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Cerita Kami</h2>
          <p className="text-muted-foreground mb-4">
            Bakery UMKM didirikan pada tahun 2015 oleh Ibu Siti, seorang pecinta kue dengan hasrat untuk berbagi resep
            keluarga yang telah diwariskan selama beberapa generasi.
          </p>
          <p className="text-muted-foreground mb-4">
            Berawal dari dapur rumah yang kecil, Ibu Siti mulai menerima pesanan kue untuk acara-acara kecil di
            lingkungan sekitar. Berkat kualitas dan cita rasa yang konsisten, pesanan terus bertambah hingga akhirnya
            Bakery UMKM resmi didirikan.
          </p>
          <p className="text-muted-foreground">
            Saat ini, Bakery UMKM telah berkembang menjadi usaha kue homemade yang dipercaya oleh banyak pelanggan setia
            di seluruh kota. Meski telah berkembang, kami tetap berpegang pada prinsip untuk menggunakan bahan-bahan
            berkualitas dan resep tradisional yang autentik.
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&h=400&auto=format&fit=crop"
            alt="Bakery Story"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-muted/30 py-16 px-4 rounded-lg mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nilai-Nilai Kami</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Prinsip-prinsip yang menjadi landasan dalam setiap langkah kami.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Kualitas</h3>
                <p className="text-muted-foreground">
                  Kami hanya menggunakan bahan-bahan berkualitas terbaik untuk memastikan setiap gigitan memberikan
                  pengalaman yang memuaskan.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tradisi</h3>
                <p className="text-muted-foreground">
                  Kami menjaga resep tradisional yang telah diwariskan turun-temurun, memberikan cita rasa autentik yang
                  sulit ditemukan di tempat lain.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Kepuasan Pelanggan</h3>
                <p className="text-muted-foreground">
                  Kepuasan pelanggan adalah prioritas utama kami. Kami selalu berusaha memberikan pelayanan terbaik dan
                  produk yang sesuai dengan harapan.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tim Kami</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kenali orang-orang hebat di balik setiap kue lezat yang kami sajikan.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
              <Image
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
                alt="Siti - Founder"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Siti</h3>
            <p className="text-muted-foreground">Founder & Head Baker</p>
          </div>

          <div className="text-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
                alt="Budi - Pastry Chef"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Budi</h3>
            <p className="text-muted-foreground">Pastry Chef</p>
          </div>

          <div className="text-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
                alt="Dewi - Cake Decorator"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Dewi</h3>
            <p className="text-muted-foreground">Cake Decorator</p>
          </div>

          <div className="text-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop"
                alt="Andi - Customer Service"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Andi</h3>
            <p className="text-muted-foreground">Customer Service</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ingin Mencoba Kue Kami?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Jelajahi menu kami dan temukan kue favorit Anda. Kami menerima pesanan untuk berbagai acara, dari ulang tahun
          hingga pernikahan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/menu">
              Lihat Menu
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/order">Pesan Sekarang</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

