'use client';

import React, { useState } from 'react';
import { Podcast } from 'types/podcast';
import { useAuth } from 'contexts/authContext';
import { drawer } from 'components/Drawer';
import { Button, FormLabel, Input, Textarea } from 'components/UI';
import { PodcastCard } from 'components/Card/Podcast';
import { addPodcast, updatePodcast, deletePodcast } from 'functions/podcasts';
import { toast } from 'components/Toast';
import { modal } from 'components/Modal';
import { generateId } from 'utilities/generateId';

const PodcastForm = ({ podcastToEdit }: { podcastToEdit?: Podcast }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState(podcastToEdit?.title || '');
  const [description, setDescription] = useState(
    podcastToEdit?.description || '',
  );
  const [imageURL, setImageURL] = useState(podcastToEdit?.imageURL || '');
  const [link, setLink] = useState(podcastToEdit?.link || '');

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
      const result = podcastToEdit
        ? await updatePodcast(podcastData)
        : await addPodcast(podcastData);

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
        <p className='mb-6 text-gray-800 dark:text-gray-300'>
          Are you sure you want to delete the following podcast? This action
          cannot be undone.
        </p>
        <div className='flex justify-center mb-6'>
          <PodcastCard
            id={podcastToEdit?.id || Date.now().toString()}
            title={title || 'Podcast Title'}
            description={description || 'Podcast Description'}
            imageURL={imageURL || '/images/placeholder.png'}
            link={link || '#'}
            isInDrawer
          />
        </div>
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
          <Button icon='close' onClick={() => drawer.close()} />
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          <div className='flex justify-center'>
            <PodcastCard
              id={podcastToEdit?.id || Date.now().toString()}
              title={title || 'Podcast Title'}
              description={description || 'Podcast Description'}
              imageURL={imageURL || '/images/placeholder.png'}
              link={link || '#'}
              isInDrawer
            />
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <FormLabel htmlFor='title' required>
                Title
              </FormLabel>
              <Input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='description' required>
                Description
              </FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='imageUrl' required>
                Image URL
              </FormLabel>
              <Input
                type='text'
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='link' required>
                Link
              </FormLabel>
              <Input
                type='text'
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </div>
            <div className='flex justify-end space-x-4 pt-4'>
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
