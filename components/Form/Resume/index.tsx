'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from '@/components/UI';
import { Button, FileDropzone, FormLabel } from '@/components/UI';
import { Separator } from '@/components/UI/Separator';
import { updateResume } from '@/database/resume';
import { Resume } from '@/types/resume';

interface ResumeFormProps {
  data?: Resume;
}

const initialResumeState: Resume = {
  fileUrl: '',
};

const ResumeForm: React.FC<ResumeFormProps> = ({ data }) => {
  const [resume, setResume] = useState<Resume>(data || initialResumeState);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
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
      let result;

      if (resumeFile) {
        const formData = new FormData();
        formData.append('file', resumeFile);
        result = await updateResume(formData);
      } else {
        result = await updateResume(resume);
      }

      if (result.success && result.data) {
        toast.success('Resume successfully updated!');
        router.push('/database');
      } else if (result.error) {
        toast.error(`Error updating resume: ${result.error}`);
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
            <FileDropzone
              value={resume.fileUrl}
              onUrlChange={(url) => setResume({ fileUrl: url })}
              onFileSelect={setResumeFile}
              accept='application/pdf'
              fileTypeLabel='PDF (max 10MB)'
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      <div className='flex gap-3'>
        {resume.fileUrl && (
          <a
            href={resume.fileUrl}
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
