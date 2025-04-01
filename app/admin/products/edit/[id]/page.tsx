import ProductForm from "@/components/admin/product-form"
import AdminLayout from "@/components/admin/admin-layout"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const productId = Number.parseInt(params.id)

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Produk</h1>
      </div>

      <ProductForm productId={productId} />
    </AdminLayout>
  )
}

