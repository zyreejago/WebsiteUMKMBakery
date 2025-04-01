import { supabase } from "./supabase"
import { uploadFile, deleteFile } from "./storage-utils"
import type { ProductCategory } from "./data"

export interface Product {
  id: number
  name: string
  price: number
  description: string | null
  image: string | null
  category: ProductCategory
  daily_limit: number | null
  created_at: string | null
}

export interface ProductInput {
  name: string
  price: number
  description: string
  image: File | null
  currentImageUrl?: string | null
  category: ProductCategory
  daily_limit: number
}

/**
 * Fetches all products from the database
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("name")

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data as Product[]
}

/**
 * Fetches a product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    return null
  }

  return data as Product
}

/**
 * Creates a new product
 */
export async function createProduct(product: ProductInput): Promise<Product | null> {
  try {
    // Upload image if provided
    let imageUrl = null
    if (product.image) {
      imageUrl = await uploadFile(product.image, "bakery", "products")
    }

    // Insert product into database
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: product.name,
        price: product.price,
        description: product.description,
        image: imageUrl,
        category: product.category,
        daily_limit: product.daily_limit,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating product:", error)
      return null
    }

    return data as Product
  } catch (error) {
    console.error("Error in createProduct:", error)
    return null
  }
}

/**
 * Updates an existing product
 */
export async function updateProduct(id: number, product: ProductInput): Promise<Product | null> {
  try {
    // Handle image upload/replacement
    let imageUrl = product.currentImageUrl

    // If a new image is provided, upload it and delete the old one
    if (product.image) {
      imageUrl = await uploadFile(product.image, "bakery", "products")

      // Delete old image if it exists
      if (product.currentImageUrl) {
        await deleteFile(product.currentImageUrl, "bakery")
      }
    }

    // Update product in database
    const { data, error } = await supabase
      .from("products")
      .update({
        name: product.name,
        price: product.price,
        description: product.description,
        image: imageUrl,
        category: product.category,
        daily_limit: product.daily_limit,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating product with ID ${id}:`, error)
      return null
    }

    return data as Product
  } catch (error) {
    console.error("Error in updateProduct:", error)
    return null
  }
}

/**
 * Deletes a product
 */
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    // Get the product to delete its image
    const product = await getProductById(id)

    // Delete the product from the database
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting product with ID ${id}:`, error)
      return false
    }

    // Delete the product image if it exists
    if (product && product.image) {
      await deleteFile(product.image, "bakery")
    }

    return true
  } catch (error) {
    console.error("Error in deleteProduct:", error)
    return false
  }
}

/**
 * Fetches products by category
 */
export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").eq("category", category).order("name")

  if (error) {
    console.error(`Error fetching products with category ${category}:`, error)
    return []
  }

  return data as Product[]
}

/**
 * Searches products by name or description
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("name")

  if (error) {
    console.error(`Error searching products with query "${query}":`, error)
    return []
  }

  return data as Product[]
}

