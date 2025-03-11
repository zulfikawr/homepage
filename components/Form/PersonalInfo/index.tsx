'use client';

import React, { useState, useEffect } from 'react';
import { PersonalInfo } from '@/types/personalInfo';
import { drawer } from '@/components/Drawer';
import { Button, FormLabel, Input } from '@/components/UI';
import { updatePersonalInfo } from '@/functions/personalInfo';
import { toast } from '@/components/Toast';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit Personal Info</h1>
          <Button icon='close' onClick={() => drawer.close()} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
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
            <div className='flex justify-end space-x-4 pt-4'>
              <Button
                type='primary'
                icon='floppyDisk'
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <span className='hidden lg:block'>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PersonalInfoForm;
