import { useState, useRef } from 'react';
import { Upload, X, FileIcon, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploadFieldProps {
  label: string;
  accept: string;
  value?: string;
  onChange: (url: string) => void;
  onClear: () => void;
  description?: string;
  maxSizeMB?: number;
  preview?: boolean;
}

export function FileUploadField({
  label,
  accept,
  value,
  onChange,
  onClear,
  description,
  maxSizeMB = 5,
  preview = false
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
        toast.success('File uploaded successfully');
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
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
            <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/50">
              {isImage ? <Image className="h-5 w-5" /> : <FileIcon className="h-5 w-5" />}
              <span className="text-sm flex-1 truncate">File uploaded</span>
            </div>
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
