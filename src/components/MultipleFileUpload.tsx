import { useState, useRef } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { uploadFile, deleteFile, getPathFromUrl } from '@/lib/storage';

interface Attachment {
  name: string;
  url: string;
  type: string;
  storagePath?: string; // Path in Supabase Storage for deletion
}

interface MultipleFileUploadProps {
  label: string;
  accept: string;
  value: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  description?: string;
  maxSizeMB?: number;
  maxFiles?: number;
  storageFolder?: string; // Optional folder in storage bucket
}

export function MultipleFileUpload({
  label,
  accept,
  value,
  onChange,
  description,
  maxSizeMB = 10,
  maxFiles = 5,
  storageFolder = 'notices'
}: MultipleFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (value.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);

    try {
      const newAttachments: Attachment[] = [];
      let successCount = 0;

      for (const file of files) {
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          toast.error(`${file.name} exceeds ${maxSizeMB}MB limit`);
          continue;
        }

        try {
          // Upload to Supabase Storage
          const uploadResult = await uploadFile(file, storageFolder);
          
          newAttachments.push({
            name: uploadResult.name,
            url: uploadResult.url,
            type: uploadResult.type,
            storagePath: uploadResult.path
          });
          
          successCount++;
        } catch (uploadError: any) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }
      }

      if (newAttachments.length > 0) {
        onChange([...value, ...newAttachments]);
        toast.success(`${successCount} file(s) uploaded successfully`);
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to upload files');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    const attachment = value[index];
    
    // Try to delete from storage if it has a storage path
    if (attachment.storagePath) {
      try {
        await deleteFile(attachment.storagePath);
      } catch (error) {
        console.error('Failed to delete file from storage:', error);
        // Continue with removal from list even if storage deletion fails
      }
    } else if (attachment.url && !attachment.url.startsWith('data:')) {
      // Try to extract path from URL for legacy files
      const path = getPathFromUrl(attachment.url);
      if (path) {
        try {
          await deleteFile(path);
        } catch (error) {
          console.error('Failed to delete file from storage:', error);
        }
      }
    }
    
    const newAttachments = value.filter((_, i) => i !== index);
    onChange(newAttachments);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📎';
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {value.length > 0 && (
        <div className="space-y-2 mb-3">
          {value.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/50"
            >
              <span className="text-lg">{getFileIcon(attachment.type)}</span>
              <a 
                href={attachment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm flex-1 truncate hover:underline"
              >
                {attachment.name}
              </a>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {value.length < maxFiles && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            multiple
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
            {uploading ? 'Uploading...' : `Add Attachments (${value.length}/${maxFiles})`}
          </Button>
        </div>
      )}
    </div>
  );
}
