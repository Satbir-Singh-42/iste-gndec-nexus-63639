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
