import { useState, useRef } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Attachment {
  name: string;
  url: string;
  type: string;
}

interface MultipleFileUploadProps {
  label: string;
  accept: string;
  value: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  description?: string;
  maxSizeMB?: number;
  maxFiles?: number;
}

export function MultipleFileUpload({
  label,
  accept,
  value,
  onChange,
  description,
  maxSizeMB = 5,
  maxFiles = 5
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

      for (const file of files) {
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          toast.error(`${file.name} exceeds ${maxSizeMB}MB limit`);
          continue;
        }

        const reader = new FileReader();
        const base64String = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newAttachments.push({
          name: file.name,
          url: base64String,
          type: file.type
        });
      }

      onChange([...value, ...newAttachments]);
      toast.success(`${newAttachments.length} file(s) uploaded`);
      
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

  const handleRemove = (index: number) => {
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
              <span className="text-sm flex-1 truncate">{attachment.name}</span>
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
