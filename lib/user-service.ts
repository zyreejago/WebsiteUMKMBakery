import { supabase } from "./supabase"

export type UserRole = "admin" | "customer"

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
  address: string | null
  phone: string | null
  created_at: string | null
}

export interface UserInput {
  name: string
  email: string
  password: string
  role?: UserRole
  address?: string | null
  phone?: string | null
}

/**
 * Fetches all users
 */
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*").order("name")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data as User[]
}

/**
 * Fetches a user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    return null
  }

  return data as User
}

/**
 * Fetches a user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error(`Error fetching user with email ${email}:`, error)
    return null
  }

  return (data as User) || null
}

/**
 * Creates a new user
 */
export async function createUser(user: UserInput): Promise<User | null> {
  // Check if email already exists
  const existingUser = await getUserByEmail(user.email)
  if (existingUser) {
    console.error(`User with email ${user.email} already exists`)
    return null
  }

  // In a real app, you would hash the password here
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: user.name,
      email: user.email,
      password: user.password, // Should be hashed in production
      role: user.role || "customer",
      address: user.address,
      phone: user.phone,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating user:", error)
    return null
  }

  return data as User
}

/**
 * Updates an existing user
 */
export async function updateUser(id: number, user: Partial<UserInput>): Promise<User | null> {
  // If email is being updated, check if it already exists
  if (user.email) {
    const existingUser = await getUserByEmail(user.email)
    if (existingUser && existingUser.id !== id) {
      console.error(`User with email ${user.email} already exists`)
      return null
    }
  }

  const { data, error } = await supabase.from("users").update(user).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    return null
  }

  return data as User
}

/**
 * Deletes a user
 */
export async function deleteUser(id: number): Promise<boolean> {
  const { error } = await supabase.from("users").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting user with ID ${id}:`, error)
    return false
  }

  return true
}

/**
 * Authenticates a user
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // In a real app, you would verify the hashed password
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password) // Should compare with hashed password in production
    .single()

  if (error) {
    console.error("Error authenticating user:", error)
    return null
  }

  return data as User
}

