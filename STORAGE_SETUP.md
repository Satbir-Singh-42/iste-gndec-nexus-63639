# Supabase Storage Setup for File Uploads

This document explains how to set up Supabase Storage for handling file uploads (notice attachments and poster images).

## Prerequisites

- Supabase project with database already set up
- Admin access to Supabase dashboard

## Setup Steps

### 1. Create Storage Buckets

You need to create two storage buckets:

#### Bucket 1: Notice Attachments
1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `notice-attachments`
   - **Public bucket**: ✅ Enabled (so files are publicly accessible)
   - Click **Create bucket**

#### Bucket 2: Images (Posters)
1. Click **New bucket** again
2. Configure the bucket:
   - **Name**: `images`
   - **Public bucket**: ✅ Enabled (so files are publicly accessible)
   - Click **Create bucket**

### 2. Configure Storage Policies (Optional but Recommended)

For better security, you can set up Row Level Security (RLS) policies:

#### Allow Public Read Access
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'notice-attachments');
```

#### Allow Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'notice-attachments');
```

#### Allow Authenticated Delete
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'notice-attachments');
```

### 3. Folder Structure

The application automatically organizes files into folders:

**notice-attachments bucket:**
- `notices/` - All notice attachments (PDFs, DOCs, etc.)

**images bucket:**
- `posters/` - Event and notice posters

You can customize the folder structure by modifying the `storageFolder` prop in the components.

## Usage in Code

### Multiple File Upload (Attachments)

The `MultipleFileUpload` component handles multiple file uploads:
- File size validation (default: 10MB max)
- File uploads to Supabase Storage
- Public URL generation
- Storage path tracking for deletion

```tsx
<MultipleFileUpload
  label="Attachments"
  accept=".pdf,.doc,.docx,.xls,.xlsx"
  value={formData.attachments}
  onChange={(attachments) => setFormData({ ...formData, attachments })}
  description="Upload relevant documents (Max 10MB each)"
  maxSizeMB={10}
  maxFiles={5}
  storageFolder="notices"
/>
```

### Single File Upload (Posters/Images)

The `FileUploadField` component handles single file uploads:
- File size validation (default: 10MB max)
- Image uploads to Supabase Storage 'images' bucket
- Preview support for images
- Storage path tracking for deletion

```tsx
<FileUploadField
  label="Event Poster"
  accept="image/jpeg,image/jpg,image/png,image/webp"
  value={formData.poster_url}
  onChange={(url) => setFormData({ ...formData, poster_url: url })}
  onClear={() => setFormData({ ...formData, poster_url: "" })}
  description="Upload event poster (Max 10MB)"
  maxSizeMB={10}
  preview={true}
  storageFolder="posters"
  storageBucket="images"
/>
```

### Storage Utilities

The `src/lib/storage.ts` file provides utility functions:

- `uploadFile(file, folder)` - Upload a file to storage
- `deleteFile(path)` - Delete a file from storage
- `deleteFiles(paths)` - Delete multiple files
- `getPathFromUrl(url)` - Extract storage path from public URL

## Database Schema

Attachments are stored in the `notices` table as JSONB:

```sql
attachments jsonb null default '[]'::jsonb
```

Each attachment object contains:
```json
{
  "name": "document.pdf",
  "url": "https://xxx.supabase.co/storage/v1/object/public/notice-attachments/notices/timestamp_random.pdf",
  "type": "application/pdf",
  "storagePath": "notices/timestamp_random.pdf"
}
```

## Migration from Base64

If you have existing data with base64-encoded files, they will still work. Both components handle:
- **Legacy base64 data URLs** (stored directly in database) - read-only, no deletion from storage
- **New Supabase Storage URLs** (stored in buckets) - full upload/delete support

All new uploads automatically use Supabase Storage for better performance and scalability.

## Troubleshooting

### Files not uploading
- Check that the bucket name is correct: `notice-attachments`
- Verify the bucket is set to **public**
- Check browser console for errors
- Ensure Supabase client is initialized correctly

### Files not accessible
- Verify the bucket is public
- Check storage policies allow public read access
- Ensure the public URL is being generated correctly

### Storage quotas
- Free tier: 1GB storage
- Pro tier: 100GB storage
- Check your usage in Supabase dashboard under Storage
