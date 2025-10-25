import { useState, useRef } from 'react';
import { Upload, X, FileIcon, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { uploadFile, deleteFile, getPathFromUrl, IMAGES_BUCKET } from '@/lib/storage';

interface FileUploadFieldProps {
  label: string;
  accept: string;
  value?: string;
  onChange: (url: string) => void;
  onClear: () => void;
  description?: string;
  maxSizeMB?: number;
  preview?: boolean;
  storageFolder?: string;
  storageBucket?: string;
}

export function FileUploadField({
  label,
  accept,
  value,
  onChange,
  onClear,
  description,
  maxSizeMB = 10,
  preview = false,
  storageFolder = 'posters',
  storageBucket = IMAGES_BUCKET
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    
    try {
      // Upload to Supabase Storage
      const uploadResult = await uploadFile(file, storageFolder, storageBucket);
      setStoragePath(uploadResult.path);
      onChange(uploadResult.url);
      toast.success('File uploaded successfully');
    } catch (error: any) {
      toast.error(`Failed to upload file: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = async () => {
    // Try to delete from storage if we have the storage path
    if (storagePath) {
      try {
        await deleteFile(storagePath, storageBucket);
      } catch (error) {
        console.error('Failed to delete file from storage:', error);
        // Continue with clearing even if storage deletion fails
      }
    } else if (value && !value.startsWith('data:')) {
      // Try to extract path from URL for legacy files
      const path = getPathFromUrl(value);
      if (path) {
        try {
          await deleteFile(path, storageBucket);
        } catch (error) {
          console.error('Failed to delete file from storage:', error);
        }
      }
    }

    setStoragePath(null);
    onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = accept.includes('image');

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {value ? (
        <div className="space-y-2">
          {preview && isImage ? (
            <div className="relative w-full h-48 rounded-lg border border-border overflow-hidden bg-muted">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
            >
              {isImage ? <Image className="h-5 w-5" /> : <FileIcon className="h-5 w-5" />}
              <span className="text-sm flex-1 truncate">View uploaded file</span>
            </a>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Remove File
          </Button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>
        </div>
      )}
    </div>
  );
}
