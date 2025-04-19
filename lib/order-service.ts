import { supabase } from "./supabase"
import { uploadFile } from "./storage-utils"

export type OrderStatus = "pending" | "waiting_payment" | "processing" | "completed" | "cancelled"

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  created_at: string | null
  // Include product details when joined
  product?: {
    name: string
    image: string | null
  }
}

export interface Order {
  id: number
  user_id: number
  total: number
  status: OrderStatus
  delivery_date: string
  payment_proof: string | null
  address: string
  notes: string | null
  created_at: string
  delivery_method: "pickup" | "delivery"
  shipping_method: string | null
  // Include related data when joined
  items?: OrderItem[]
  user?: {
    name: string
    email: string
  }
}

export interface OrderInput {
  user_id: number
  items: {
    product_id: number
    quantity: number
    price: number
  }[]
  total: number
  delivery_date: string
  payment_proof: File | null
  payment_proof_url?: string | null
  address: string
  notes?: string | null
  status?: OrderStatus
  delivery_method: "pickup" | "delivery"
  shipping_method?: string | null
}

/**
 * Fetches all orders
 */
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, user:users(name, email)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return data as Order[]
}

/**
 * Fetches an order by ID with its items
 */
export async function getOrderById(id: number): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      user:users(name, email),
      items:order_items(
        id,
        product_id,
        quantity,
        price,
        created_at,
        product:products(name, image)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching order with ID ${id}:`, error)
    return null
  }

  return data as Order
}

/**
 * Fetches orders for a specific user
 */
export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        id,
        product_id,
        quantity,
        price,
        created_at,
        product:products(name, image)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching orders for user ${userId}:`, error)
    return []
  }

  return data as Order[]
}

/**
 * Creates a new order
 */
export async function createOrder(order: OrderInput): Promise<Order | null> {
  try {
    // Start a transaction
    const { data: client } = await supabase.rpc("begin_transaction")

    // Upload payment proof if provided
    let paymentProofUrl = order.payment_proof_url || null
    if (order.payment_proof) {
      paymentProofUrl = await uploadFile(order.payment_proof, "bakery", "payments")
    }

    // Insert order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: order.user_id,
        total: order.total,
        status: order.status || "pending",
        delivery_date: order.delivery_date,
        payment_proof: paymentProofUrl,
        address: order.address,
        notes: order.notes,
        delivery_method: order.delivery_method,
        shipping_method: order.shipping_method,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      await supabase.rpc("rollback_transaction")
      return null
    }

    // Insert order items
    const orderItems = order.items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      await supabase.rpc("rollback_transaction")
      return null
    }

    // Commit transaction
    await supabase.rpc("commit_transaction")

    return orderData as Order
  } catch (error) {
    console.error("Error in createOrder:", error)
    await supabase.rpc("rollback_transaction")
    return null
  }
}

/**
 * Updates an order's status
 */
export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order | null> {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating status for order ${id}:`, error)
    return null
  }

  return data as Order
}

/**
 * Updates an order's payment proof
 */
export async function updateOrderPaymentProof(id: number, paymentProof: File): Promise<Order | null> {
  try {
    // Upload payment proof
    const paymentProofUrl = await uploadFile(paymentProof, "bakery", "payments")

    if (!paymentProofUrl) {
      return null
    }

    // Update order
    const { data, error } = await supabase
      .from("orders")
      .update({
        payment_proof: paymentProofUrl,
        status: "waiting_payment",
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating payment proof for order ${id}:`, error)
      return null
    }

    return data as Order
  } catch (error) {
    console.error("Error in updateOrderPaymentProof:", error)
    return null
  }
}

/**
 * Deletes an order
 */
export async function deleteOrder(id: number): Promise<boolean> {
  try {
    // Delete order (cascade will delete order items)
    const { error } = await supabase.from("orders").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting order with ID ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteOrder:", error)
    return false
  }
}
