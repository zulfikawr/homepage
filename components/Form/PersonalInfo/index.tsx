'use client';

import React, { useState, useEffect } from 'react';
import { PersonalInfo } from '@/types/personalInfo';
import { drawer } from '@/components/Drawer';
import { Button, FormLabel, Icon, Input } from '@/components/UI';
import { updatePersonalInfo } from '@/functions/personalInfo';
import { toast } from '@/components/Toast';
import Separator from '@/components/UI/Separator';
import { Hover } from '@/components/Visual';
import ImageWithFallback from '@/components/ImageWithFallback';

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
        drawer.close();
        toast.show('Personal info successfully updated!');
      } else {
        throw new Error(result.error || 'Failed to update personal info');
      }
    } catch (error) {
      console.error('Error saving personal info:', error);
      toast.show('An unexpected error occurred');
    }
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Icon name='userCircle' className='size-[28px] md:size-[32px]' />
            <h1 className='text-xl md:text-2xl font-semibold'>Personal Info</h1>
          </div>
          <div className='flex justify-end space-x-4'>
            <Button type='primary' icon='floppyDisk' onClick={handleSubmit}>
              <span className='hidden lg:block'>Save</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-6'>
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
              <Input
                value={personalInfo.avatarUrl}
                onChange={(e) => handleChange('avatarUrl', e.target.value)}
                required
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PersonalInfoForm;
