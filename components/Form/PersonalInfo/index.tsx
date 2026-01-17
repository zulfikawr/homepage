'use client';

import React, { useState, useEffect } from 'react';
import { PersonalInfo } from '@/types/personalInfo';
import { Button, FormLabel, Input, FileUpload } from '@/components/UI';
import {
  updatePersonalInfo,
  COLLECTION,
  RECORD_ID,
} from '@/database/personalInfo';
import { toast } from '@/components/Toast';
import { Hover } from '@/components/Visual';
import ImageWithFallback from '@/components/ImageWithFallback';
import Separator from '@/components/UI/Separator';
import pb from '@/lib/pocketbase';

interface PersonalInfoFormProps {
  data?: PersonalInfo;
}

const initialPersonalInfoState: PersonalInfo = {
  name: '',
  title: '',
  avatarUrl: '',
};

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data }) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(
    data || initialPersonalInfoState,
  );

  useEffect(() => {
    if (data) {
      setPersonalInfo(data);
    }
  }, [data]);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updatePersonalInfo(personalInfo);

      if (result.success && result.data) {
        toast.success('Personal info successfully updated!');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error updating personal info: ${error.message}`
          : 'An unknown error occurred while updating personal info.',
      );
    }
  };

  return (
    <>
      <div className='space-y-6'>
        <section className='flex items-center justify-between gap-x-10 gap-y-8'>
          <div className='flex flex-col gap-y-1'>
            <h1 className='text-1 font-medium tracking-wide text-black dark:text-white'>
              <span className='mr-3 inline-block'>👋</span>
              {personalInfo.name}
            </h1>
            <div className='flex flex-col gap-y-1.5 break-words px-1 text-4 font-light leading-relaxed text-neutral-500 dark:text-neutral-300 lg:text-2'>
              <p>{personalInfo.title}</p>
            </div>
          </div>
          <Hover
            perspective={1000}
            max={25}
            scale={1.01}
            className='block flex-shrink-0 pt-1'
          >
            <ImageWithFallback
              src={personalInfo.avatarUrl}
              height={105}
              width={105}
              alt={personalInfo.name}
              priority
              className='aspect-square object-cover rounded-xl bg-neutral-200 shadow-sm dark:border dark:border-neutral-600'
              type='square'
            />
          </Hover>
        </section>
        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='name' required>
              Name
            </FormLabel>
            <Input
              value={personalInfo.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='title' required>
              Title
            </FormLabel>
            <Input
              value={personalInfo.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='avatarUrl' required>
              Avatar URL
            </FormLabel>
            <div className='flex gap-2'>
              <Input
                value={personalInfo.avatarUrl}
                onChange={(e) => handleChange('avatarUrl', e.target.value)}
                required
              />
              <FileUpload
                collectionName={COLLECTION}
                recordId={RECORD_ID}
                fieldName='avatar'
                onUploadSuccess={(url) => handleChange('avatarUrl', url)}
              />
            </div>
          </div>
        </form>
      </div>

      <Separator margin='5' />

      <Button
        type='primary'
        icon='floppyDisk'
        onClick={handleSubmit}
        className='w-full'
      >
        Save
      </Button>
    </>
  );
};

export default PersonalInfoForm;
