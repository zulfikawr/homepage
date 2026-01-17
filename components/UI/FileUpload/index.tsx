import React, { useRef, useState } from 'react';
import { Button } from '@/components/UI';
import pb from '@/lib/pocketbase';
import { toast } from '@/components/Toast';
import { RecordModel } from 'pocketbase';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  collectionName: string;
  recordId: string;
  fieldName: string;
  className?: string;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  collectionName,
  recordId,
  fieldName,
  className,
  accept = 'image/*',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        icon={isUploading ? undefined : 'plus'}
        className='h-9'
      >
        {isUploading ? '...' : 'Upload'}
      </Button>
    </div>
  );
};
