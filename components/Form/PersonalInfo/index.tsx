'use client';

import React, { useState, useEffect } from 'react';
import { PersonalInfo } from '@/types/personalInfo';
import { drawer } from '@/components/Drawer';
import { Button, FormLabel, Icon, Input } from '@/components/UI';
import { updatePersonalInfo } from '@/functions/personalInfo';
import { toast } from '@/components/Toast';
import PersonalInfoSection from '@/components/Section/PersonalInfo';

interface PersonalInfoFormProps {
  data?: PersonalInfo;
  onUpdate?: (data: PersonalInfo) => void;
}

const initialPersonalInfoState: PersonalInfo = {
  name: '',
  title: '',
  avatarUrl: '',
};

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  onUpdate,
}) => {
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
        if (onUpdate) {
          onUpdate(result.data);
        }
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
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-neutral-700'>
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

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-6'>
          <PersonalInfoSection />
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
