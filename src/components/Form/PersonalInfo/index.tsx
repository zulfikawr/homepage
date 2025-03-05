import React, { useState, useEffect } from 'react';
import { PersonalInfo } from '~/types/personalInfo';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import { Button } from '~/components/UI';
import { updatePersonalInfo } from '~/functions/personalInfo';
import { toast } from '~/components/Toast';

const PersonalInfoForm = ({
  initialData,
  onUpdate,
}: {
  initialData?: PersonalInfo;
  onUpdate?: (data: PersonalInfo) => void;
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState(initialData?.name || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTitle(initialData.title);
      setAvatarUrl(initialData.avatarUrl);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) return;
    setIsSubmitting(true);

    const personalInfoData: PersonalInfo = {
      name,
      title,
      avatarUrl,
    };

    try {
      const result = await updatePersonalInfo(personalInfoData);

      if (result.success && result.data) {
        if (onUpdate) {
          onUpdate(result.data);
        }
        drawer.close();
        toast.show('Personal info succesfully updated!');
      } else {
        setError(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving personal info:', error);
      setError('An unexpected error occurred');
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
          <Button icon='close' onClick={() => drawer.close()}>
            <span className='hidden lg:block lg:ml-2'>Close</span>
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
              <div className='p-3 text-sm bg-red-50 text-red-600 rounded-md'>
                {error}
              </div>
            )}
            <div>
              <label className='block text-sm font-medium mb-2'>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Avatar URL
              </label>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div className='flex justify-end space-x-4'>
              <Button
                type='primary'
                icon='floppyDisk'
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <span className='ml-2'>
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
