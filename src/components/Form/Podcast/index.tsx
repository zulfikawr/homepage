import React, { useState } from 'react';
import { Podcast } from '~/types/podcast';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import { Button } from '~/components/UI';
import { PodcastCard } from '~/components/Card/Podcast';

const PodcastForm = ({ podcastToEdit }: { podcastToEdit?: Podcast }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(podcastToEdit?.title || '');
  const [description, setDescription] = useState(
    podcastToEdit?.description || '',
  );
  const [imageURL, setImageURL] = useState(podcastToEdit?.imageURL || '');
  const [link, setLink] = useState(podcastToEdit?.link || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const podcastData = {
      id: podcastToEdit?.id || Date.now().toString(),
      title,
      description,
      imageURL: imageURL || '/images/podcasts/default.jpg',
      link,
    };

    const method = podcastToEdit ? 'PUT' : 'POST';
    const url = '/api/podcast-list';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(podcastData),
      });

      if (!response.ok) {
        throw new Error('Failed to save podcast');
      }

      drawer.close();
    } catch (error) {
      console.error('Error saving podcast:', error);
    }
  };

  return (
    <>
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>
            {podcastToEdit ? 'Edit Podcast' : 'Add New Podcast'}
          </h1>
          <Button type='default' onClick={() => drawer.close()}>
            Close
          </Button>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          <div className='flex justify-center'>
            <PodcastCard
              id={podcastToEdit?.id || Date.now().toString()}
              title={title || 'Podcast Title'}
              description={description || 'Podcast Description'}
              imageURL={imageURL || '/images/podcasts/default.jpg'}
              link={link || '#'}
              isInDrawer
            />
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Title</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Image URL
              </label>
              <input
                type='text'
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Link</label>
              <input
                type='text'
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div className='flex justify-end space-x-4'>
              <Button onClick={() => drawer.close()}>Cancel</Button>
              <Button type='primary' onClick={handleSubmit}>
                {podcastToEdit ? 'Save Changes' : 'Add Podcast'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PodcastForm;
