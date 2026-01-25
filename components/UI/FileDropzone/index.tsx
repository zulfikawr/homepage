'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Icon, Input, Button } from '@/components/UI';
import { twMerge } from 'tailwind-merge';
import { useRadius } from '@/contexts/radiusContext';

interface FileDropzoneProps {
  value: string; // The URL
  onUrlChange: (url: string) => void;
  onFileSelect: (file: File | null) => void;
  placeholder?: string;
  className?: string;
  accept?: string;
  fileTypeLabel?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  value,
  onUrlChange,
  onFileSelect,
  placeholder = 'Paste file URL here...',
  className,
  accept = 'application/pdf',
  fileTypeLabel = 'PDF (max 10MB)',
}) => {
  const { radius } = useRadius();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    onFileSelect(file);
    const objectUrl = URL.createObjectURL(file);
    onUrlChange(objectUrl);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileName(null);
    onFileSelect(null);
    onUrlChange('');
    setInputValue('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    onUrlChange(val);
  };

  return (
    <div className={twMerge('group/dropzone space-y-3', className)}>
      <div
        className={twMerge(
          'relative w-full flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden border border-border bg-muted/50 p-6 shadow-sm focus:outline-none dark:border-border dark:bg-muted min-h-[200px]',
          isDragging
            ? 'border-primary ring-4 ring-primary/10'
            : 'hover:bg-muted/50 dark:hover:bg-white/20',
          fileName || value ? 'border-solid' : 'border-dashed',
        )}
        style={{ borderRadius: `${radius * 1.5}px` }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          className='hidden'
          accept={accept}
        />

        {fileName || value ? (
          <div className='flex flex-col items-center gap-4 text-center'>
            <div className='size-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary'>
              <Icon name='filePdf' className='size-10' />
            </div>
            <div>
              <p className='text-sm font-semibold text-foreground break-all max-w-xs'>
                {fileName ||
                  (value.includes('/')
                    ? value.split('/').pop()
                    : 'Current File')}
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                Click or drag to replace
              </p>
            </div>
            <Button
              type='destructive'
              icon='trash'
              onClick={handleRemove}
              className='h-9 px-4'
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-3 text-muted-foreground dark:text-muted-foreground'>
            <div className='size-14 rounded-full bg-muted dark:bg-card flex items-center justify-center border border-border dark:border-border'>
              <Icon name='plus' className='size-7' />
            </div>
            <div className='text-center px-4'>
              <p className='text-sm font-semibold text-muted-foreground'>
                Click to upload or drag and drop
              </p>
              <p className='text-xs mt-1'>Supports {fileTypeLabel}</p>
            </div>
          </div>
        )}
      </div>

      <div className='relative group/input'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
          <Icon name='link' className='size-4' />
        </div>
        <Input
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className='bg-card border-border pl-9 h-11'
        />
      </div>
    </div>
  );
};
