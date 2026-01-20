'use client';

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button, Icon } from '@/components/UI';
import pb from '@/lib/pocketbase';
import { toast } from '@/components/Toast';
import { RecordModel, ClientResponseError } from 'pocketbase';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  onFileSelect?: (file: File | null) => void;
  collectionName: string;
  recordId?: string;
  fieldName: string;
  className?: string;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onFileSelect,
  collectionName,
  recordId,
  fieldName,
  className,
  accept = 'image/*',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    if (onFileSelect) {
      onFileSelect(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // If no recordId, we are in 'selection mode' (likely a new record)
    if (!recordId) {
      if (onFileSelect) {
        setSelectedFile(file);
        onFileSelect(file);
        toast.success(`Selected: ${file.name}`);
      } else {
        toast.error(
          'Record must be saved first or form must handle file selection',
        );
      }
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const record = await pb
        .collection(collectionName)
        .update<RecordModel>(recordId, formData);

      const fileName = record[fieldName] as string;

      if (!fileName) {
        toast.error('Upload succeeded but no filename returned');
        return;
      }

      const fullUrl = pb.files.getURL(record, fileName);

      onUploadSuccess(fullUrl);
      setSelectedFile(file);
      toast.success('File uploaded successfully');
    } catch (error: unknown) {
      console.error('Upload error:', error);
      let message = 'Failed to upload file';

      if (error instanceof ClientResponseError) {
        message = error.message;
        const details = error.response.data;
        if (details && typeof details === 'object') {
          const errors = Object.entries(details)
            .map(([key, val]) => {
              const err = val as { message?: string };
              return `${key}: ${err.message || 'invalid'}`;
            })
            .join(', ');
          if (errors) message += ` (${errors})`;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={twMerge('flex items-center gap-3', className)}>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
        accept={accept}
      />

      {previewUrl && (
        <div className='relative group size-12 rounded-md overflow-hidden border border-border flex-shrink-0'>
          <Image src={previewUrl} alt='Preview' fill className='object-cover' />
          <button
            onClick={handleRemove}
            className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'
            title='Remove file'
          >
            <Icon name='trash' className='size-5 text-white' />
          </button>
        </div>
      )}

      <Button
        type='default'
        onClick={handleButtonClick}
        disabled={isUploading}
        icon={
          isUploading ? undefined : previewUrl ? 'pencilSimpleLine' : 'plus'
        }
        className={twMerge('h-9', isUploading && 'opacity-70')}
      >
        {isUploading ? '...' : previewUrl ? 'Replace' : 'Upload'}
      </Button>
    </div>
  );
};
