import { supabase } from "./supabase"
import { products as mockProducts, users as mockUsers, qrisData } from "./data"

export async function seedProducts() {
  // Convert the mock products to the format expected by Supabase
  const supabaseProducts = mockProducts.map((product) => ({
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category,
    daily_limit: product.dailyLimit,
  }))

  // Insert the products into the database
  const { data, error } = await supabase.from("products").insert(supabaseProducts).select()

  if (error) {
    console.error("Error seeding products:", error)
    return false
  }

  console.log("Products seeded successfully:", data)
  return true
}

export async function seedUsers() {
  // Convert the mock users to the format expected by Supabase
  const supabaseUsers = mockUsers.map((user) => ({
    name: user.name,
    email: user.email,
    password: user.password, // In a real app, you'd hash this password
    role: user.role,
    address: user.address,
    phone: user.phone,
  }))

  // Insert the users into the database
  const { data, error } = await supabase.from("users").insert(supabaseUsers).select()

  if (error) {
    console.error("Error seeding users:", error)
    return false
  }

  console.log("Users seeded successfully:", data)
  return true
}

export async function seedQrisSettings() {
  // Insert the QRIS settings into the database
  const { data, error } = await supabase
    .from("qris_settings")
    .insert({
      image: qrisData.image,
      name: qrisData.name,
      number: qrisData.number,
    })
    .select()

  if (error) {
    console.error("Error seeding QRIS settings:", error)
    return false
  }

  console.log("QRIS settings seeded successfully:", data)
  return true
}

export async function seedAllData() {
  await seedUsers()
  await seedProducts()
  await seedQrisSettings()
}

