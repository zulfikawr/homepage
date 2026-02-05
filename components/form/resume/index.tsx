'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from '@/components/ui';
import { Button, FileUpload, FormLabel } from '@/components/ui';
import { Separator } from '@/components/ui/separator';
import { Resume } from '@/types/resume';

interface ResumeFormProps {
  data?: Resume;
}

const initialResumeState: Resume = {
  file: '',
  file_url: '',
};

const ResumeForm: React.FC<ResumeFormProps> = ({ data }) => {
  const [resume, setResume] = useState<Resume>(data || initialResumeState);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        setResume(data);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    try {
      const response = await fetch('/api/collection/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (result.success) {
        toast.success('Resume successfully updated!');
        router.push('/database');
      } else {
        toast.error(result.error || 'Failed to update resume.');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error updating resume: ${error.message}`
          : 'An unknown error occurred while updating resume.',
      );
    }
  };

  return (
    <>
      <div className='space-y-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='resume' required>
              Resume PDF
            </FormLabel>
            <FileUpload
              collectionName='resume'
              recordId='1'
              fieldName='file_url'
              existingValue={resume.file_url}
              accept='application/pdf'
              onUploadSuccess={(url) => {
                setResume({
                  file_url: url,
                  file: url.startsWith('/') ? url : `/api/storage/${url}`,
                });
              }}
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      <div className='flex gap-3'>
        {resume.file_url && (
          <a
            href={resume.file || resume.file_url}
            download='resume.pdf'
            target='_blank'
            rel='noopener noreferrer'
            className='flex-1'
          >
            <Button variant='default' icon='filePdf' className='w-full'>
              Download
            </Button>
          </a>
        )}
        <Button
          variant='primary'
          icon='floppyDisk'
          onClick={handleSubmit}
          className='flex-1'
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default ResumeForm;
