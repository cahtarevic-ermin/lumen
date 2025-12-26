'use client';

import { useState } from 'react';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  accept?: string;
  maxSize?: number;
}

export function UploadZone({
  onUpload,
  isUploading,
  accept = '.pdf,.txt',
  maxSize = 50,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File too large. Maximum size is ${maxSize}MB`;
    }

    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only PDF and TXT files are allowed';
    }

    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          isUploading && 'pointer-events-none opacity-50'
        )}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3">
              <File className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="font-medium">{selectedFile.name}</span>
                <span className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSelection}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isUploading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <Button onClick={handleUpload}>Upload Document</Button>
            )}
          </div>
        ) : (
          <>
            <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">
              Drag & drop your document here
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              or click to browse (PDF, TXT up to {maxSize}MB)
            </p>
            <label>
              <input
                type="file"
                accept={accept}
                onChange={handleFileInput}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
