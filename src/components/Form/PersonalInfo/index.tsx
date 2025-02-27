import React, { useState, useEffect } from 'react';
import { PersonalInfo } from '~/types/personalInfo';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import { Button } from '~/components/UI';

const PersonalInfoForm = ({ initialData }: { initialData?: PersonalInfo }) => {
  const { user } = useAuth();
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

    if (!user) return;

    const PersonalInfoData = {
      name,
      title,
      avatarUrl,
    };

    const method = 'PUT';
    const url = '/api/personalInfo';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(PersonalInfoData),
      });

      if (!response.ok) {
        throw new Error('Failed to save personal info');
      }

      drawer.close();
    } catch (error) {
      console.error('Error saving personal info:', error);
    }
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit Personal Info</h1>
          <Button type='default' onClick={() => drawer.close()}>
            Close
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
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
                onChange={(e) => setName(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                avatarUrl
              </label>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div className='flex justify-end space-x-4'>
              <Button type='primary' onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PersonalInfoForm;
