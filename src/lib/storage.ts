import { supabase } from './supabase';

export const STORAGE_BUCKET = 'notice-attachments';
export const IMAGES_BUCKET = 'images';

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param folder - Optional folder path (e.g., 'notices/2024')
 * @param bucket - Storage bucket name (default: 'notice-attachments')
 * @returns Object containing the file path and public URL
 */
export async function uploadFile(file: File, folder?: string, bucket: string = STORAGE_BUCKET) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  // Generate unique filename to prevent collisions
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}_${randomString}.${fileExt}`;
  
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  // Upload file to storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    url: publicUrl,
    name: file.name,
    type: file.type
  };
}

/**
 * Delete a file from Supabase Storage
 * @param filePath - The path of the file in storage
 * @param bucket - Storage bucket name (default: 'notice-attachments')
 */
export async function deleteFile(filePath: string, bucket: string = STORAGE_BUCKET) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error('Storage delete error:', error);
    throw error;
  }

  return true;
}

/**
 * Delete multiple files from Supabase Storage
 * @param filePaths - Array of file paths to delete
 * @param bucket - Storage bucket name (default: 'notice-attachments')
 */
export async function deleteFiles(filePaths: string[], bucket: string = STORAGE_BUCKET) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove(filePaths);

  if (error) {
    console.error('Storage batch delete error:', error);
    throw error;
  }

  return true;
}

/**
 * Extract storage path from a public URL
 * @param url - The public URL from Supabase Storage
 * @returns The file path in storage
 */
export function getPathFromUrl(url: string): string | null {
  try {
    // URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
    const match = url.match(/\/object\/public\/[^/]+\/(.+)$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    return null;
  }
}
