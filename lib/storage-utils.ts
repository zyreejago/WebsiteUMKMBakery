// lib/storage-utils.ts
import { supabase } from "./supabase"
import { v4 as uuidv4 } from "uuid"

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "bakery"  // ← ambil dari .env
const PUBLIC_URL_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}`

export async function uploadFile(
  file: File,
  bucket = "bakery",            // ← sekarang argumen ke-2 adalah bucket
  folder = "products" 
): Promise<string | null> {
  try {
    const ext = file.name.split(".").pop()
    const filename = `${uuidv4()}.${ext}`
    const path = `${folder}/${filename}`

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      })

    if (error) {
      console.error("Error uploading file:", error.message)
      return null
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return urlData.publicUrl
  } catch (err: any) {
    console.error("Error in uploadFile:", err.message || err)
    return null
  }
}

export async function deleteFile(
  publicUrl: string
): Promise<boolean> {
  try {
    const url = new URL(publicUrl)
    const prefix = `/storage/v1/object/public/${BUCKET}/`
    if (!url.pathname.startsWith(prefix)) {
      console.warn("deleteFile: URL tidak dikenali:", publicUrl)
      return false
    }
    const filePath = url.pathname.slice(prefix.length)
    const { error } = await supabase.storage.from(BUCKET).remove([filePath])
    if (error) console.error("Error deleting file:", error.message)
    return !error
  } catch (err: any) {
    console.error("Error in deleteFile:", err.message || err)
    return false
  }
}
