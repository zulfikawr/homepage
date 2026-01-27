'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import ImageWithFallback from '@/components/ImageWithFallback';
import { toast } from '@/components/Toast';
import { Button, FileUpload, FormLabel, Input } from '@/components/UI';
import { Separator } from '@/components/UI/Separator';
import { Hover } from '@/components/Visual';
import { updatePersonalInfo } from '@/database/personalInfo';
import { PersonalInfo } from '@/types/personalInfo';

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        setPersonalInfo(data);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let result;

      if (avatarFile) {
        const formData = new FormData();
        formData.append('name', personalInfo.name);
        formData.append('title', personalInfo.title);
        formData.append('avatar', avatarFile);

        result = await updatePersonalInfo(formData);
      } else {
        result = await updatePersonalInfo(personalInfo);
      }

      if (result.success && result.data) {
        toast.success('Personal info successfully updated!');
        router.push('/database');
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
            <h1 className='text-4xl font-medium tracking-wide text-foreground'>
              <span className='mr-3 inline-block'>👋</span>
              {personalInfo.name}
            </h1>
            <div className='flex flex-col gap-y-1.5 break-words px-1 text-sm font-light leading-relaxed text-muted-foreground dark:text-muted-foreground lg:text-lg'>
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
              preload
              className='aspect-square object-cover rounded-xl bg-muted shadow-sm dark:border dark:border-border'
              type='square'
              sizes='105px'
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
                collectionName='profile'
                fieldName='avatar'
                onUploadSuccess={(url) => handleChange('avatarUrl', url)}
                onFileSelect={setAvatarFile}
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
