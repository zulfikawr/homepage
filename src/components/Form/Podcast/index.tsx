import React, { useState } from 'react';
import { Podcast } from '~/types/podcast';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import { Button } from '~/components/UI';
import { PodcastCard } from '~/components/Card/Podcast';
import { addPodcast, updatePodcast, deletePodcast } from '~/functions/podcasts';
import { toast } from '~/components/Toast';
import { modal } from '~/components/Modal';

const PodcastForm = ({ podcastToEdit }: { podcastToEdit?: Podcast }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState(podcastToEdit?.title || '');
  const [description, setDescription] = useState(
    podcastToEdit?.description || '',
  );
  const [imageURL, setImageURL] = useState(podcastToEdit?.imageURL || '');
  const [link, setLink] = useState(podcastToEdit?.link || '');

  const generateId = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.show('Podcast title is required.');
      return false;
    }
    if (!description.trim()) {
      toast.show('Description is required.');
      return false;
    }
    if (!imageURL.trim()) {
      toast.show('Image URL is required.');
      return false;
    }
    if (!link.trim()) {
      toast.show('Link are required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !validateForm()) return;

    const podcastData = {
      id: podcastToEdit?.id || generateId(title),
      title,
      description,
      imageURL: imageURL || '/images/placeholder.png',
      link,
    };

    try {
      let result;
      if (podcastToEdit) {
        result = await updatePodcast(podcastData);
      } else {
        result = await addPodcast(podcastData);
      }

      if (result.success) {
        drawer.close();
        toast.show(
          podcastToEdit
            ? 'Podcast updated successfully!'
            : 'Podcast added successfully!',
        );
      } else {
        throw new Error(result.error || 'Failed to save podcast');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error saving podcast: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while saving the podcast.');
      }
    }
  };

  const handleDelete = async () => {
    if (!podcastToEdit || !user) return;

    try {
      const result = await deletePodcast(podcastToEdit.id);

      if (result.success) {
        drawer.close();
        toast.show('Podcast deleted successfully!');
      } else {
        throw new Error(result.error || 'Failed to delete podcast');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error deleting podcast: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while deleting the podcast.');
      }
    }
  };

  const confirmDelete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6'>
          Are you sure you want to delete this podcast? This action cannot be
          undone.
        </p>
        <div className='flex justify-end space-x-4'>
          <Button type='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            type='destructive'
            onClick={() => {
              handleDelete();
              modal.close();
            }}
          >
            Delete
          </Button>
        </div>
      </div>,
    );
  };

  return (
    <>
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>
            {podcastToEdit ? 'Edit Podcast' : 'Add New Podcast'}
          </h1>
          <Button icon='close' onClick={() => drawer.close()}>
            <span className='hidden md:block md:ml-2'>Close</span>
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
              {podcastToEdit && (
                <Button type='destructive' onClick={confirmDelete}>
                  Delete
                </Button>
              )}
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
