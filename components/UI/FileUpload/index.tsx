import React, { useRef, useState } from 'react';
import { Button } from '@/components/UI';
import pb from '@/lib/pocketbase';
import { toast } from '@/components/Toast';
import { RecordModel } from 'pocketbase';
import { twMerge } from 'tailwind-merge';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  onFileSelect?: (file: File) => void;
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
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // If no recordId, we are in 'selection mode' (likely a new record)
    if (!recordId) {
      if (onFileSelect) {
        onFileSelect(file);
        setSelectedFileName(file.name);
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
        .update(recordId, formData);

      const fileName = record[fieldName] as string;

      if (!fileName) {
        if (record.avatar) {
          const url = pb.files.getUrl(
            { collectionName, id: recordId } as unknown as RecordModel,
            record.avatar as string,
          );
          onUploadSuccess(url);
          toast.success('File uploaded successfully');
          return;
        }
        toast.error('Upload succeeded but no filename returned');
        return;
      }

      // Force using collectionName instead of the internal ID for a "pretty" URL
      const fullUrl = pb.files.getUrl(
        { collectionName, id: recordId } as unknown as RecordModel,
        fileName,
      );

      onUploadSuccess(fullUrl);
      toast.success('File uploaded successfully');
    } catch (error) {
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
    <div className={className}>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
        accept={accept}
      />
      <Button
        type='default'
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          handleButtonClick(e)
        }
        disabled={isUploading}
        icon={
          isUploading ? undefined : selectedFileName ? 'checkCircle' : 'plus'
        }
        className={twMerge('h-9', isUploading && 'opacity-70')}
      >
        {isUploading ? '...' : selectedFileName ? 'Selected' : 'Upload'}
      </Button>
    </div>
  );
};
