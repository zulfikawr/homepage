'use client';

import React, { useState } from 'react';
import { Podcast } from '@/types/podcast';
import { drawer } from '@/components/Drawer';
import { Button, FormLabel, Input, Textarea } from '@/components/UI';
import PodcastCard from '@/components/Card/Podcast';
import { addPodcast, updatePodcast, deletePodcast } from '@/database/podcasts';
import { toast } from '@/components/Toast';
import { modal } from '@/components/Modal';
import { generateId } from '@/utilities/generateId';
import Separator from '@/components/UI/Separator';

interface PodcastFormProps {
  podcastToEdit?: Podcast;
}

const initialPodcastState: Podcast = {
  id: '',
  title: '',
  description: '',
  imageURL: '',
  link: '',
};

const PodcastForm: React.FC<PodcastFormProps> = ({ podcastToEdit }) => {
  const [podcast, setPodcast] = useState<Podcast>(
    podcastToEdit || initialPodcastState,
  );

  const currentPreviewPodcast: Podcast = {
    id: podcast.id || 'preview',
    title: podcast.title || 'Podcast Title',
    description: podcast.description || 'Podcast Description',
    imageURL: podcast.imageURL,
    link: podcast.link || '#',
  };

  const validateForm = () => {
    if (!podcast.title.trim()) {
      toast.show('Podcast title is required.');
      return false;
    }
    if (!podcast.description.trim()) {
      toast.show('Description is required.');
      return false;
    }
    if (!podcast.imageURL.trim()) {
      toast.show('Image URL is required.');
      return false;
    }
    if (!podcast.link.trim()) {
      toast.show('Link are required.');
      return false;
    }
    return true;
  };

  const handleChange = (
    field: keyof Podcast,
    value: string | string[] | Date,
  ) => {
    setPodcast((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const podcastData = {
      ...podcast,
      id: podcastToEdit?.id || generateId(podcast.title),
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
    if (!podcastToEdit) return;

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
        <p className='mb-6 text-neutral-800 dark:text-neutral-300'>
          Are you sure you want to delete the following podcast? This action
          cannot be undone.
        </p>
        <div className='flex justify-center mb-6'>
          <PodcastCard podcast={currentPreviewPodcast} isInForm />
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
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-xl md:text-2xl font-medium whitespace-nowrap overflow-hidden text-ellipsis'>
            {podcastToEdit ? `${podcastToEdit.title}` : 'Add New Podcast'}
          </h1>
          <div className='flex space-x-4'>
            {podcastToEdit ? (
              <div className='flex space-x-4'>
                <Button type='destructive' icon='trash' onClick={confirmDelete}>
                  Delete
                </Button>
                <Button type='primary' icon='floppyDisk' onClick={handleSubmit}>
                  Save
                </Button>
              </div>
            ) : (
              <Button type='primary' icon='plus' onClick={handleSubmit}>
                Add
              </Button>
            )}
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-6'>
          <div className='flex justify-center'>
            <PodcastCard podcast={currentPreviewPodcast} isInForm />
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <FormLabel htmlFor='title' required>
                Title
              </FormLabel>
              <Input
                type='text'
                value={podcast.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='description' required>
                Description
              </FormLabel>
              <Textarea
                value={podcast.description}
                onChange={(e) => handleChange('description', e.target.value)}
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
                value={podcast.imageURL}
                onChange={(e) => handleChange('imageURL', e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='link' required>
                Link
              </FormLabel>
              <Input
                type='text'
                value={podcast.link}
                onChange={(e) => handleChange('link', e.target.value)}
                required
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PodcastForm;
