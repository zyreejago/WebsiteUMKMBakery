import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for the browser
const supabaseUrl = `https://oyraicqogpelulrbambg.supabase.co`
const supabaseAnonKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cmFpY3FvZ3BlbHVscmJhbWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NjAyNDEsImV4cCI6MjA1ODQzNjI0MX0.9wChbupQOsUl4WID7X2b2LdxTc3ACTtKWr_xi7XKDnQ`

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

