import { supabase } from "./supabase";

export async function uploadImageToSupabase(
  file: File,
  folder: string = "images"
): Promise<{ url: string | null; error: string | null }> {
  try {
    if (!supabase) {
      return { url: null, error: "Supabase not initialized" };
    }

    // Validate file
    if (!file.type.startsWith("image/")) {
      return { url: null, error: "File must be an image" };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: "Image must be less than 5MB" };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    return { url: publicUrl, error: null };
  } catch (error: any) {
    return { url: null, error: error.message || "Upload failed" };
  }
}

export async function uploadMultipleImages(
  files: File[],
  folder: string = "gallery"
): Promise<{ urls: string[]; errors: string[] }> {
  const urls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const { url, error } = await uploadImageToSupabase(file, folder);
    if (url) {
      urls.push(url);
    } else if (error) {
      errors.push(`${file.name}: ${error}`);
    }
  }

  return { urls, errors };
}

/**
 * Extract the file path from a Supabase Storage public URL
 * Example: https://abc.supabase.co/storage/v1/object/public/images/gallery/123.jpg
 * Returns: gallery/123.jpg
 */
export function extractStoragePath(url: string): string | null {
  try {
    if (!url) return null;
    
    // Handle base64 data URLs (not in storage)
    if (url.startsWith('data:')) {
      return null;
    }
    
    // Extract path after '/images/'
    const match = url.match(/\/images\/(.+)$/);
    if (match && match[1]) {
      return match[1];
    }
    
    // Alternative pattern for different URL formats
    const altMatch = url.match(/\/object\/public\/images\/(.+)$/);
    if (altMatch && altMatch[1]) {
      return altMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting storage path:", error);
    return null;
  }
}

/**
 * Delete a single image from Supabase Storage
 */
export async function deleteImageFromSupabase(
  imageUrl: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    if (!supabase) {
      console.error("❌ Supabase not initialized for delete operation");
      return { success: false, error: "Supabase not initialized" };
    }

    if (!imageUrl) {
      console.log("ℹ️ No image URL provided, skipping delete");
      return { success: true, error: null }; // Nothing to delete
    }

    console.log("🗑️ Attempting to delete image:", imageUrl);
    
    const filePath = extractStoragePath(imageUrl);
    
    if (!filePath) {
      // Image is not in storage (could be base64 or external URL)
      console.log("ℹ️ Image not in storage (base64 or external URL), skipping delete");
      return { success: true, error: null };
    }

    console.log("📂 Extracted file path:", filePath);
    console.log("🪣 Deleting from bucket: images");

    const { data, error } = await supabase.storage
      .from("images")
      .remove([filePath]);

    if (error) {
      console.error("❌ Error deleting image from storage:", error);
      console.error("Error details:", {
        message: error.message,
        statusCode: error.statusCode,
        error: error
      });
      return { success: false, error: error.message };
    }

    console.log("✅ Successfully deleted from storage:", filePath);
    console.log("Delete response:", data);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("❌ Exception in deleteImageFromSupabase:", error);
    return { success: false, error: error.message || "Delete failed" };
  }
}

/**
 * Delete multiple images from Supabase Storage
 */
export async function deleteMultipleImagesFromSupabase(
  imageUrls: string[]
): Promise<{ success: boolean; error: string | null; deletedCount: number }> {
  try {
    if (!supabase) {
      console.error("❌ Supabase not initialized for multiple delete");
      return { success: false, error: "Supabase not initialized", deletedCount: 0 };
    }

    if (!imageUrls || imageUrls.length === 0) {
      console.log("ℹ️ No images to delete");
      return { success: true, error: null, deletedCount: 0 };
    }

    console.log(`🗑️ Attempting to delete ${imageUrls.length} image(s)`);

    const filePaths = imageUrls
      .map(url => extractStoragePath(url))
      .filter((path): path is string => path !== null);

    if (filePaths.length === 0) {
      console.log("ℹ️ No images in storage to delete (all base64 or external)");
      return { success: true, error: null, deletedCount: 0 };
    }

    console.log("📂 File paths to delete:", filePaths);
    console.log("🪣 Deleting from bucket: images");

    const { data, error } = await supabase.storage
      .from("images")
      .remove(filePaths);

    if (error) {
      console.error("❌ Error deleting images from storage:", error);
      console.error("Error details:", {
        message: error.message,
        statusCode: error.statusCode,
        error: error
      });
      return { success: false, error: error.message, deletedCount: 0 };
    }

    console.log(`✅ Successfully deleted ${filePaths.length} image(s) from storage`);
    console.log("Delete response:", data);
    return { success: true, error: null, deletedCount: filePaths.length };
  } catch (error: any) {
    console.error("❌ Exception in deleteMultipleImagesFromSupabase:", error);
    return { success: false, error: error.message || "Delete failed", deletedCount: 0 };
  }
}
