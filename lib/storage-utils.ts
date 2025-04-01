import { supabase } from "./supabase"
import { v4 as uuidv4 } from "uuid"

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param folder The folder path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File, bucket = "bakery", folder = "products"): Promise<string | null> {
  try {
    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return null
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error("Error in uploadFile:", error)
    return null
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param url The public URL of the file to delete
 * @param bucket The storage bucket name
 * @returns Whether the deletion was successful
 */
export async function deleteFile(url: string, bucket = "bakery"): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url)
    const pathWithBucket = urlObj.pathname
    const path = pathWithBucket.replace(`/storage/v1/object/public/${bucket}/`, "")

    // Delete the file
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("Error deleting file:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteFile:", error)
    return false
  }
}

