import Link from "next/link"
import { Cake, Instagram, Facebook, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cake className="h-6 w-6" />
              <span className="font-bold text-lg">Dapur Madu</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Menyediakan kue homemade berkualitas dengan resep tradisional sejak 2015.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              {/* <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="mailto:info@bakeryumkm.com" className="text-muted-foreground hover:text-primary">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link> */}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu?category=kue-kering" className="text-muted-foreground hover:text-primary text-sm">
                  Kue Kering
                </Link>
              </li>
              <li>
                <Link href="/menu?category=kue-basah" className="text-muted-foreground hover:text-primary text-sm">
                  Kue Basah
                </Link>
              </li>
              <li>
                <Link href="/menu?category=kue-loyang" className="text-muted-foreground hover:text-primary text-sm">
                  Kue Loyang
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Informasi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary text-sm">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/how-to-order" className="text-muted-foreground hover:text-primary text-sm">
                  Cara Pemesanan
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Kontak</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                <span>+62 811-1799-189</span>
              </li>
              {/* <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                <span>info@bakeryumkm.com</span>
              </li> */}
              <li className="text-muted-foreground text-sm mt-2">
              Jl, Jambu VIII
                <br />
                No.30, Depok I
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Dapur Madu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

