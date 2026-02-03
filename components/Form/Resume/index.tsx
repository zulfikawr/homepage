'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from '@/components/UI';
import { Button, FileUpload, FormLabel } from '@/components/UI';
import { Separator } from '@/components/UI/Separator';
import { updateResume } from '@/database/resume';
import { Resume } from '@/types/resume';

interface ResumeFormProps {
  data?: Resume;
}

const initial_resume_state: Resume = {
  file: '',
  file_url: '',
};

const ResumeForm: React.FC<ResumeFormProps> = ({ data }) => {
  const [resume, set_resume] = useState<Resume>(data || initial_resume_state);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        set_resume(data);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const handle_submit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    try {
      const result = await updateResume(resume);

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
        <form onSubmit={handle_submit} className='space-y-4'>
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
                set_resume({
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
          onClick={handle_submit}
          className='flex-1'
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default ResumeForm;
