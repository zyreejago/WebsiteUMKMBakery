export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          price: number
          description: string | null
          image: string | null
          category: string
          daily_limit: number | null
          created_at: string | null
        }
        Insert: {
          id?: number
          name: string
          price: number
          description?: string | null
          image?: string | null
          category: string
          daily_limit?: number | null
          created_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          price?: number
          description?: string | null
          image?: string | null
          category?: string
          daily_limit?: number | null
          created_at?: string | null
        }
      }
      users: {
        Row: {
          id: number
          name: string
          email: string
          password: string
          role: string | null
          address: string | null
          phone: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          name: string
          email: string
          password: string
          role?: string | null
          address?: string | null
          phone?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          email?: string
          password?: string
          role?: string | null
          address?: string | null
          phone?: string | null
          created_at?: string | null
        }
      }
      orders: {
        Row: {
          id: number
          user_id: number | null
          total: number
          status: string | null
          delivery_date: string
          payment_proof: string | null
          address: string
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id?: number | null
          total: number
          status?: string | null
          delivery_date: string
          payment_proof?: string | null
          address: string
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: number | null
          total?: number
          status?: string | null
          delivery_date?: string
          payment_proof?: string | null
          address?: string
          notes?: string | null
          created_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number | null
          product_id: number | null
          quantity: number
          price: number
          created_at: string | null
        }
        Insert: {
          id?: number
          order_id?: number | null
          product_id?: number | null
          quantity: number
          price: number
          created_at?: string | null
        }
        Update: {
          id?: number
          order_id?: number | null
          product_id?: number | null
          quantity?: number
          price?: number
          created_at?: string | null
        }
      }
      qris_settings: {
        Row: {
          id: number
          image: string | null
          name: string
          number: string
          created_at: string | null
        }
        Insert: {
          id?: number
          image?: string | null
          name: string
          number: string
          created_at?: string | null
        }
        Update: {
          id?: number
          image?: string | null
          name?: string
          number?: string
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

