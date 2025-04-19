"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format, addDays, isBefore } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Minus, Plus, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import type { Product, ProductCategory } from "@/lib/data" // Keep the type
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

interface CartItem {
  product: Product
  quantity: number
}

interface QrisSettings {
  image: string
  name: string
  number: string
}

export default function OrderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const productId = searchParams.get("product")

  const [cart, setCart] = useState<CartItem[]>([])
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 2))
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [paymentProof, setPaymentProof] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [qrisSettings, setQrisSettings] = useState<QrisSettings>({
    image: "/placeholder.svg?height=400&width=400",
    name: "Bakery UMKM",
    number: "1234567890",
  })
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup")
  const [shippingMethod, setShippingMethod] = useState<string>("")

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      // Redirect to login page with a return URL
      router.push(`/login?returnUrl=${encodeURIComponent("/order" + (productId ? `?product=${productId}` : ""))}`)
    }
  }, [isAuthenticated, loading, router, productId])

  // Fetch products and QRIS settings
  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Fetch products
      const { data: productsData, error: productsError } = await supabase.from("products").select("*")

      if (productsError) {
        console.error("Error fetching products:", productsError)
      } else if (productsData) {
        // Convert the Supabase data to our Product type
        const formattedProducts: Product[] = productsData.map((item) => ({
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

      // Fetch QRIS settings
      const { data: qrisData, error: qrisError } = await supabase.from("qris_settings").select("*").single()

      if (qrisError && qrisError.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        console.error("Error fetching QRIS settings:", qrisError)
      } else if (qrisData) {
        setQrisSettings({
          image: qrisData.image || "/placeholder.svg?height=400&width=400",
          name: qrisData.name,
          number: qrisData.number,
        })
      }

      setLoading(false)
    }

    if (isAuthenticated) {
      fetchData()

      // Set user's address if available
      if (user?.address) {
        setAddress(user.address)
      }
    }
  }, [isAuthenticated, user])

  // Add product from URL param to cart
  useEffect(() => {
    if (productId && products.length > 0 && isAuthenticated) {
      const product = products.find((p) => p.id === Number.parseInt(productId))
      if (product && !cart.some((item) => item.product.id === product.id)) {
        setCart([...cart, { product, quantity: 1 }])
      }
    }
  }, [productId, products, cart, isAuthenticated])

  const openCategoryDialog = (category: ProductCategory) => {
    setSelectedCategory(category)
    const filteredProducts = products.filter((p) => p.category === category)
    setCategoryProducts(filteredProducts)
    setCategoryDialogOpen(true)
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }

    // Close the dialog after adding to cart
    setCategoryDialogOpen(false)
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return

    setCart(cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this file to Supabase Storage
      // For now, we'll just create a local URL
      const url = URL.createObjectURL(file)
      setPaymentProof(url)
    }
  }

  const getAvailableShippingMethods = () => {
    // Check if cart has only dry cakes
    const hasOnlyDryCakes = cart.every((item) => item.product.category === "Kue Kering")

    // Check if cart has only dry cakes and layer cakes
    const hasOnlyDryAndLayerCakes = cart.every(
      (item) => item.product.category === "Kue Kering" || item.product.category === "Kue Loyang",
    )

    // Count items by category to check limits
    const dryCount = cart.reduce((sum, item) => (item.product.category === "Kue Kering" ? sum + item.quantity : sum), 0)
    const wetCount = cart.reduce((sum, item) => (item.product.category === "Kue Basah" ? sum + item.quantity : sum), 0)
    const layerCount = cart.reduce(
      (sum, item) => (item.product.category === "Kue Loyang" ? sum + item.quantity : sum),
      0,
    )

    // Define shipping methods
    const methods = [
      {
        id: "gosend-instant-motor",
        name: "Gosend Instant (Motor)",
        description: "Seluruh jenis dengan jarak kurang dari 50km",
        restrictions: "12 Kue Kering, 250 Kue Basah, 4 Kue Loyang",
        available: dryCount <= 12 && wetCount <= 250 && layerCount <= 4,
      },
      {
        id: "gosend-sameday-motor",
        name: "Gosend Sameday (Motor)",
        description: "Kue Kering & Kue Loyang dengan jarak kurang dari 50km",
        restrictions: "12 Kue Kering, 4 Kue Loyang",
        available: hasOnlyDryAndLayerCakes && dryCount <= 12 && layerCount <= 4,
      },
      {
        id: "gosend-instant-car",
        name: "Gosend Instant (Mobil)",
        description: "Seluruh jenis dengan jarak kurang dari 50km",
        available: true,
      },
      {
        id: "gosend-sameday-car",
        name: "Gosend Sameday (Mobil)",
        description: "Kue Kering & Kue Loyang dengan jarak kurang dari 50km",
        available: hasOnlyDryAndLayerCakes,
      },
      {
        id: "paxel",
        name: "Paxel",
        description: "Kue kering dengan jarak maksimal 250km",
        available: hasOnlyDryCakes,
      },
    ]

    return methods.filter((method) => method.available)
  }

  const handleSubmitOrder = async () => {
    if (
      !date ||
      (deliveryMethod === "delivery" && (!address || !shippingMethod)) ||
      !paymentProof ||
      !isAuthenticated ||
      !user
    )
      return

    try {
      // 1. Insert the order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id, // Use the authenticated user's ID
          total: calculateTotal(),
          status: "waiting_payment",
          delivery_date: format(date, "yyyy-MM-dd"),
          payment_proof: paymentProof, // In a real app, this would be a URL to Supabase Storage
          delivery_method: deliveryMethod,
          shipping_method: deliveryMethod === "delivery" ? shippingMethod : null,
          address: deliveryMethod === "delivery" ? address : null,
          notes,
        })
        .select()
        .single()

      if (orderError) {
        console.error("Error creating order:", orderError)
        alert("Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.")
        return
      }

      // 2. Insert the order items
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        console.error("Error creating order items:", itemsError)
        alert("Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.")
        return
      }

      alert("Pesanan berhasil dibuat! Terima kasih telah berbelanja.")
      setCart([])
      setDate(addDays(new Date(), 2))
      setStep(1)
      setAddress("")
      setNotes("")
      setPaymentProof(null)

      // Redirect to order detail page
      router.push(`/order/${orderData.id}`)
    } catch (error) {
      console.error("Error submitting order:", error)
      alert("Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.")
    }
  }

  // Disable dates that are less than 2 days from now
  const disabledDays = (date: Date) => {
    const twoDaysFromNow = addDays(new Date(), 1)
    return isBefore(date, twoDaysFromNow)
  }

  // Filter products by search query
  const filteredCategoryProducts = categoryProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // If not authenticated, show loading state until redirect happens
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Mengalihkan ke halaman login...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Pesan Kue</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Pilih kue favorit Anda, tentukan tanggal pengiriman, dan lakukan pembayaran untuk menyelesaikan pesanan.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Pilih Kue</CardTitle>
                <CardDescription>Pilih kue yang ingin Anda pesan dan tentukan jumlahnya</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {["Kue Kering", "Kue Basah", "Kue Loyang"].map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      onClick={() => openCategoryDialog(category as ProductCategory)}
                      className="h-auto py-4"
                    >
                      <div className="text-left">
                        <div className="font-medium">{category}</div>
                        <div className="text-sm text-muted-foreground">Lihat daftar {category.toLowerCase()}</div>
                      </div>
                    </Button>
                  ))}
                  <Button variant="outline" asChild className="h-auto py-4">
                    <Link href="/menu">
                      <div className="text-left">
                        <div className="font-medium">Lihat Menu Lengkap</div>
                        <div className="text-sm text-muted-foreground">Pilih dari semua menu kami</div>
                      </div>
                    </Link>
                  </Button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12 border rounded-md">
                    <p className="text-muted-foreground">Keranjang Anda kosong. Silakan pilih kue untuk melanjutkan.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-4 border rounded-md p-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">Rp {item.product.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            {item.product.category === "Kue Kering"
                              ? "pcs"
                              : item.product.category === "Kue Basah"
                                ? "pcs"
                                : "loyang"}
                          </span>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <div className="font-medium">Rp {(item.product.price * item.quantity).toLocaleString()}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.product.id)}
                            className="h-8 px-2 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" disabled>
                  Kembali
                </Button>
                <Button onClick={() => setStep(2)} disabled={cart.length === 0}>
                  Lanjutkan
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Pilih Tanggal Pengiriman</CardTitle>
                <CardDescription>Pilih tanggal pengiriman yang Anda inginkan (minimal H-2 pemesanan)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: id }) : "Pilih tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={disabledDays}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-sm text-muted-foreground">
                      Pemesanan harus dilakukan minimal 2 hari sebelum tanggal pengiriman.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Metode Pengambilan</label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={deliveryMethod === "pickup" ? "default" : "outline"}
                          onClick={() => setDeliveryMethod("pickup")}
                          className="flex-1"
                        >
                          Ambil di Tempat
                        </Button>
                        <Button
                          type="button"
                          variant={deliveryMethod === "delivery" ? "default" : "outline"}
                          onClick={() => setDeliveryMethod("delivery")}
                          className="flex-1"
                        >
                          Kirim
                        </Button>
                      </div>
                    </div>

                    {deliveryMethod === "delivery" && (
                      <>
                        <div className="grid gap-2">
                          <label htmlFor="address" className="text-sm font-medium">
                            Alamat Pengiriman
                          </label>
                          <Textarea
                            id="address"
                            placeholder="Masukkan alamat lengkap pengiriman"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>

                        <div className="grid gap-2">
                          <label htmlFor="shipping-method" className="text-sm font-medium">
                            Metode Pengiriman
                          </label>
                          <div className="space-y-2">
                            {getAvailableShippingMethods().map((method) => (
                              <div key={method.id} className="flex items-start gap-2 border rounded-md p-3">
                                <input
                                  type="radio"
                                  id={method.id}
                                  name="shipping-method"
                                  value={method.id}
                                  checked={shippingMethod === method.id}
                                  onChange={() => setShippingMethod(method.id)}
                                  className="mt-1"
                                />
                                <label htmlFor={method.id} className="flex-1 cursor-pointer">
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-muted-foreground">{method.description}</div>
                                  {method.restrictions && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Maksimal: {method.restrictions}
                                    </div>
                                  )}
                                </label>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            <strong>Catatan:</strong> Harga pengiriman tidak termasuk dalam total harga dan akan
                            diinformasikan melalui WhatsApp.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Catatan (Opsional)
                    </label>
                    <Textarea
                      id="notes"
                      placeholder="Tambahkan catatan untuk pesanan Anda"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Kembali
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!date || (deliveryMethod === "delivery" && (!address || !shippingMethod))}
                >
                  Lanjutkan
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Pembayaran</CardTitle>
                <CardDescription>Lakukan pembayaran dan upload bukti pembayaran</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="flex flex-col items-center gap-4 border rounded-md p-6">
                    <h3 className="font-medium text-lg">Scan QRIS untuk Pembayaran</h3>
                    <div className="relative w-64 h-64">
                      <Image
                        src={qrisSettings.image || "/placeholder.svg"}
                        alt="QRIS Code"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{qrisSettings.name}</p>
                      <p className="text-muted-foreground">{qrisSettings.number}</p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="payment-proof" className="text-sm font-medium">
                      Upload Bukti Pembayaran
                    </label>
                    <div className="grid gap-4">
                      <input
                        id="payment-proof"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="payment-proof"
                        className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer hover:border-primary"
                      >
                        {paymentProof ? (
                          <div className="relative w-full h-48">
                            <Image
                              src={paymentProof || "/placeholder.svg"}
                              alt="Payment Proof"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-muted-foreground mb-2">Klik untuk upload bukti pembayaran</p>
                            <p className="text-xs text-muted-foreground">Format: JPG, PNG, atau JPEG (Maks. 2MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Kembali
                </Button>
                <Button onClick={handleSubmitOrder} disabled={!paymentProof}>
                  Selesaikan Pesanan
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-muted-foreground">Keranjang Anda kosong.</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.product.name}</span>
                        <span className="text-muted-foreground"> x{item.quantity}</span>
                      </div>
                      <span>Rp {(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>Rp {calculateTotal().toLocaleString()}</span>
                  </div>

                  {date && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tanggal Pengiriman</span>
                          <span>{format(date, "dd MMMM yyyy", { locale: id })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Metode Pengambilan</span>
                          <span>{deliveryMethod === "pickup" ? "Ambil di Tempat" : "Kirim"}</span>
                        </div>
                        {deliveryMethod === "delivery" && shippingMethod && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Metode Pengiriman</span>
                            <span>{getAvailableShippingMethods().find((m) => m.id === shippingMethod)?.name}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Products Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pilih {selectedCategory}</DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Cari ${selectedCategory?.toLowerCase()}...`}
              className="w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredCategoryProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada produk yang ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredCategoryProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      <span className="font-medium text-primary">Rp {product.price.toLocaleString()}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                    <Button className="w-full" onClick={() => addToCart(product)}>
                      Tambahkan ke Keranjang
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
