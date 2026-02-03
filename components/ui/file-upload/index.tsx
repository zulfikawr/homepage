'use client';

import React, { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { toast } from '@/components/ui';
import { Button } from '@/components/ui';
import { FileBrowser } from '@/components/ui/file-browser';
import { modal } from '@/components/ui/modal';
import { uploadFile } from '@/database/files';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  onFileSelect?: (file: File | null) => void;
  collectionName: string;
  recordId?: string;
  fieldName: string;
  className?: string;
  accept?: string;
  existingValue?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onFileSelect,
  collectionName,
  recordId,
  fieldName,
  className,
  accept = 'image/*',
  existingValue,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const hasValue = !!selectedFile || !!existingValue;

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
    // Also notify success with empty string to clear the value in parent
    onUploadSuccess('');
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

  const handleBrowserSelect = (key: string) => {
    // Update the form with the selected file key
    onUploadSuccess(`/api/storage/${key}`);
    toast.success('File selected from R2');
  };

  const openFileBrowser = () => {
    modal.open(
      <FileBrowser
        onSelect={handleBrowserSelect}
        onClose={() => modal.close()}
      />,
    );
  };

  return (
    <div className={twMerge('flex items-center gap-2', className)}>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
        accept={accept}
      />

      <Button
        variant='default'
        onClick={handleButtonClick}
        disabled={isUploading}
        icon={
          isUploading ? 'circleNotch' : hasValue ? 'pencilSimpleLine' : 'plus'
        }
        className={twMerge('h-9', isUploading && 'opacity-70')}
        iconClassName={twMerge(isUploading && 'animate-spin')}
      >
        <span className='hidden sm:inline'>
          {hasValue ? 'Replace' : 'Upload'}
        </span>
      </Button>

      <Button
        variant='default'
        onClick={openFileBrowser}
        disabled={isUploading}
        icon='folder'
        className='h-9'
      >
        <span className='hidden sm:inline'>Select</span>
      </Button>

      {hasValue && (
        <Button
          variant='destructive'
          onClick={handleRemove}
          disabled={isUploading}
          icon='trashSimple'
          className='h-9'
          title='Remove file'
        >
          <span className='hidden sm:inline'>Remove</span>
        </Button>
      )}
    </div>
  );
};
