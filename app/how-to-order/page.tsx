import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

export default function HowToOrderPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Cara Pemesanan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Panduan lengkap untuk memesan kue favorit Anda dengan mudah dan cepat.
        </p>
      </div>

      {/* Steps Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="grid gap-8">
          {/* Step 1 */}
          <Card>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=500&h=300&auto=format&fit=crop"
                    alt="Pilih Menu"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                    1
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Pilih Menu</h2>
                  <p className="text-muted-foreground mb-4">
                    Jelajahi berbagai pilihan kue kami dan pilih yang Anda inginkan. Anda dapat melihat detail produk,
                    harga, dan deskripsi untuk membantu Anda memilih.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/menu">Lihat Menu</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="order-1 md:order-2 relative h-64 md:h-auto">
                  <Image
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=500&h=300&auto=format&fit=crop"
                    alt="Tentukan Tanggal"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="order-2 md:order-1 p-6 flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                    2
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Tentukan Tanggal</h2>
                  <p className="text-muted-foreground mb-4">
                    Pilih tanggal pengiriman yang Anda inginkan. Perlu diingat bahwa pemesanan harus dilakukan minimal 2
                    hari sebelum tanggal pengiriman untuk memastikan kualitas terbaik.
                  </p>
                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                    <strong>Catatan:</strong> Untuk acara besar seperti pernikahan, kami sarankan untuk memesan minimal
                    1 minggu sebelumnya.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=500&h=300&auto=format&fit=crop"
                    alt="Lakukan Pembayaran"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                    3
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Lakukan Pembayaran</h2>
                  <p className="text-muted-foreground mb-4">
                    Setelah memesan, lakukan pembayaran melalui QRIS dan unggah bukti pembayaran. Pesanan Anda akan
                    diproses setelah pembayaran dikonfirmasi.
                  </p>
                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                    <strong>Metode Pembayaran:</strong> Saat ini kami hanya menerima pembayaran melalui QRIS.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="order-1 md:order-2 relative h-64 md:h-auto">
                  <Image
                    src="https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=500&h=300&auto=format&fit=crop"
                    alt="Terima Pesanan"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="order-2 md:order-1 p-6 flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                    4
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Terima Pesanan</h2>
                  <p className="text-muted-foreground mb-4">
                    Pada tanggal pengiriman yang telah ditentukan, pesanan Anda akan dikirimkan ke alamat yang Anda
                    berikan. Pastikan ada seseorang yang dapat menerima pesanan.
                  </p>
                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                    <strong>Area Pengiriman:</strong> Saat ini kami melayani pengiriman untuk area kota dan sekitarnya.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Pertanyaan Umum</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Berapa lama waktu pemesanan minimal?</h3>
              <p className="text-muted-foreground">
                Pemesanan harus dilakukan minimal 2 hari sebelum tanggal pengiriman. Untuk acara besar seperti
                pernikahan, kami sarankan untuk memesan minimal 1 minggu sebelumnya.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Apakah ada biaya pengiriman?</h3>
              <p className="text-muted-foreground">
                Biaya pengiriman sudah termasuk dalam harga untuk area dalam kota. Untuk pengiriman ke luar kota, akan
                dikenakan biaya tambahan sesuai jarak.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Bagaimana jika saya ingin membatalkan pesanan?</h3>
              <p className="text-muted-foreground">
                Pembatalan pesanan dapat dilakukan maksimal 24 jam setelah pemesanan dan belum melakukan pembayaran.
                Setelah pembayaran dilakukan, pesanan tidak dapat dibatalkan.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Apakah ada pesanan minimum?</h3>
              <p className="text-muted-foreground">
                Tidak ada pesanan minimum untuk pembelian kue. Anda dapat memesan sesuai kebutuhan Anda.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Siap Memesan?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Jelajahi menu kami dan temukan kue favorit Anda. Proses pemesanan yang mudah dan cepat.
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

