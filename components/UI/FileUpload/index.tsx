'use client';

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { toast } from '@/components/Toast';
import { Button, Icon } from '@/components/UI';
import { uploadFile } from '@/database/files';

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
      const result = await uploadFile(
        collectionName,
        recordId,
        fieldName,
        formData,
      );

      if (result.success && result.url) {
        onUploadSuccess(result.url);
        setSelectedFile(file);
        toast.success('File uploaded successfully');
      } else {
        toast.error(result.error || 'Failed to upload file');
      }
    } catch (error: unknown) {
      console.error('Upload error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload file',
      );
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
            className='absolute inset-0 bg-card/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'
            title='Remove file'
          >
            <Icon name='trash' className='size-5 text-primary' />
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
