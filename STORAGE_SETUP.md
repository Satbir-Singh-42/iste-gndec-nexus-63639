# Supabase Storage Setup for Notice Attachments

This document explains how to set up Supabase Storage for handling notice attachments.

## Prerequisites

- Supabase project with database already set up
- Admin access to Supabase dashboard

## Setup Steps

### 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `notice-attachments`
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
- `notices/` - All notice attachments

You can customize the folder structure by modifying the `storageFolder` prop in the `MultipleFileUpload` component.

## Usage in Code

### Uploading Files

The `MultipleFileUpload` component automatically handles:
- File size validation (default: 5MB max)
- File uploads to Supabase Storage
- Public URL generation
- Storage path tracking for deletion

```tsx
<MultipleFileUpload
  label="Attachments"
  accept=".pdf,.doc,.docx,.xls,.xlsx"
  value={formData.attachments}
  onChange={(attachments) => setFormData({ ...formData, attachments })}
  description="Upload relevant documents (Max 5MB each)"
  maxSizeMB={5}
  maxFiles={5}
  storageFolder="notices"
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

If you have existing notices with base64-encoded attachments, they will still work. The component handles both:
- Legacy base64 data URLs (stored in database)
- New Supabase Storage URLs (stored in bucket)

New uploads will automatically use Supabase Storage.

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
