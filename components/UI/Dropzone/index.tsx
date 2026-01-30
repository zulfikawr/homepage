'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { Button, Icon, Input } from '@/components/UI';
import { useRadius } from '@/contexts/radiusContext';

interface DropzoneProps {
  value: string; // The URL
  onUrlChange: (url: string) => void;
  onFileSelect: (file: File | null) => void;
  placeholder?: string;
  className?: string;
  aspectRatio?: 'video' | 'square';
}

export const Dropzone: React.FC<DropzoneProps> = ({
  value,
  onUrlChange,
  onFileSelect,
  placeholder = 'Paste image URL here...',
  className,
  aspectRatio = 'video',
}) => {
  const { radius } = useRadius();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(value);

  // Sync internal preview with external value
  useEffect(() => {
    const timer = setTimeout(() => {
      setInputValue(value);
      if (value) {
        setPreviewUrl(value);
      } else {
        setPreviewUrl(null);
      }
    }, 0);
    return () => clearTimeout(timer);
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
    if (file && file.type.startsWith('image/')) {
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
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onFileSelect(file);
    onUrlChange(objectUrl);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewUrl(null);
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
          'relative w-full flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden border-2 border-border bg-muted/50 p-2 shadow-brutalist focus:outline-none dark:bg-muted',
          aspectRatio === 'video'
            ? 'aspect-video'
            : 'aspect-square max-w-[200px] mx-auto',
          isDragging
            ? 'border-primary shadow-brutalist-lg -translate-y-1 -translate-x-1'
            : 'hover:bg-muted/50 dark:hover:bg-primary/10 hover:shadow-brutalist-hover',
          previewUrl ? 'border-solid' : 'border-dashed',
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
          accept='image/*'
        />

        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt='Preview'
              fill
              className='object-cover transition-transform group-hover/dropzone:scale-105'
              sizes='100vw'
              unoptimized={
                previewUrl.startsWith('blob:') || previewUrl.startsWith('http')
              }
            />
            <div className='absolute inset-0 bg-card/60 opacity-0 group-hover/dropzone:opacity-100 transition-opacity flex items-center justify-center gap-3'>
              <Button
                variant='destructive'
                icon='trash'
                onClick={handleRemove}
                className='h-10 px-4'
              >
                Remove
              </Button>
              <div className='bg-card/30 backdrop-blur-md text-foreground px-4 h-10 flex items-center rounded-md border border-primary/10 text-sm font-medium'>
                Click to replace
              </div>
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center gap-3 text-muted-foreground dark:text-muted-foreground'>
            <div className='size-14 rounded-full bg-muted dark:bg-card flex items-center justify-center border border'>
              <Icon name='plus' className='size-7' />
            </div>
            <div className='text-center px-4'>
              <p className='text-sm font-semibold text-muted-foreground'>
                Click to upload or drag and drop
              </p>
              <p className='text-xs mt-1'>Supports PNG, JPG, WEBP (max 10MB)</p>
            </div>
          </div>
        )}
      </div>

      <div className='relative group/input z-10'>
        <Input
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className='pl-[2.2rem]'
        />
        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10'>
          <Icon name='link' size={18} />
        </div>
      </div>
    </div>
  );
};
