import { supabase } from "./supabase"
import { uploadFile, deleteFile } from "./storage-utils"

export interface QrisSettings {
  id: number
  image: string | null
  name: string
  number: string
  created_at: string | null
}

export interface QrisSettingsInput {
  image: File | null
  currentImageUrl?: string | null
  name: string
  number: string
}

/**
 * Fetches the QRIS settings
 */
export async function getQrisSettings(): Promise<QrisSettings | null> {
  const { data, error } = await supabase
    .from("qris_settings")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error("Error fetching QRIS settings:", error)
    return null
  }

  return (data as QrisSettings) || null
}

/**
 * Updates the QRIS settings
 */
export async function updateQrisSettings(settings: QrisSettingsInput): Promise<QrisSettings | null> {
  try {
    // Get current settings
    const currentSettings = await getQrisSettings()

    // Handle image upload/replacement
    let imageUrl = settings.currentImageUrl

    // If a new image is provided, upload it and delete the old one
    if (settings.image) {
      imageUrl = await uploadFile(settings.image, "bakery", "qris")

      // Delete old image if it exists
      if (settings.currentImageUrl) {
        await deleteFile(settings.currentImageUrl, "bakery")
      }
    }

    // Update or insert settings
    let result
    if (currentSettings) {
      // Update existing settings
      result = await supabase
        .from("qris_settings")
        .update({
          image: imageUrl,
          name: settings.name,
          number: settings.number,
        })
        .eq("id", currentSettings.id)
        .select()
        .single()
    } else {
      // Insert new settings
      result = await supabase
        .from("qris_settings")
        .insert({
          image: imageUrl,
          name: settings.name,
          number: settings.number,
        })
        .select()
        .single()
    }

    if (result.error) {
      console.error("Error updating QRIS settings:", result.error)
      return null
    }

    return result.data as QrisSettings
  } catch (error) {
    console.error("Error in updateQrisSettings:", error)
    return null
  }
}

