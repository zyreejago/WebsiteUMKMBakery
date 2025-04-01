import ProductForm from "@/components/admin/product-form"
import AdminLayout from "@/components/admin/admin-layout"

export default function AddProductPage() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>
      </div>

      <ProductForm />
    </AdminLayout>
  )
}

