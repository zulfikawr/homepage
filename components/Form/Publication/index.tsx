'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { modal } from '@/components/UI';
import { toast } from '@/components/UI';
import { Button, Checkbox, FormLabel, Input } from '@/components/UI';
import PublicationCard from '@/components/UI/Card/variants/Publication';
import { Separator } from '@/components/UI/Separator';
import {
  addPublication,
  deletePublication,
  updatePublication,
} from '@/database/publications';
import { Publication } from '@/types/publication';
import { generateSlug } from '@/utilities/generateSlug';

interface PublicationFormProps {
  publicationToEdit?: Publication;
}

const initialPublicationState: Publication = {
  id: '',
  slug: '',
  title: '',
  authors: [],
  publisher: '',
  excerpt: '',
  keywords: [],
  openAccess: false,
  link: '',
};

const PublicationForm: React.FC<PublicationFormProps> = ({
  publicationToEdit,
}) => {
  const [publication, setPublication] = useState<Publication>(
    publicationToEdit || initialPublicationState,
  );

  const [newAuthor, setNewAuthor] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const currentPreviewPublication: Publication = {
    id: publication.id || 'preview',
    slug: publication.slug || 'preview',
    title: publication.title || 'Publication Title',
    authors: publication.authors.length ? publication.authors : ['Author Name'],
    publisher: publication.publisher || 'Publisher Name',
    excerpt: publication.excerpt || 'Publication excerpt',
    keywords: publication.keywords.length ? publication.keywords : ['Keyword'],
    openAccess: publication.openAccess,
    link: publication.link || '#',
  };

  const handleChange = (
    field: keyof Publication,
    value: string | string[] | boolean,
  ) => {
    setPublication((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAuthor = () => {
    const trimmed = newAuthor.trim();
    if (trimmed && !publication.authors.includes(trimmed)) {
      handleChange('authors', [...publication.authors, trimmed]);
      setNewAuthor('');
    }
  };

  const handleRemoveAuthor = (index: number) => {
    const updated = publication.authors.filter((_, i) => i !== index);
    handleChange('authors', updated);
  };

  const handleAuthorChange = (index: number, value: string) => {
    const updated = [...publication.authors];
    updated[index] = value;
    handleChange('authors', updated);
  };

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (trimmed && !publication.keywords.includes(trimmed)) {
      handleChange('keywords', [...publication.keywords, trimmed]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const updated = publication.keywords.filter((_, i) => i !== index);
    handleChange('keywords', updated);
  };

  const handleKeywordChange = (index: number, value: string) => {
    const updated = [...publication.keywords];
    updated[index] = value;
    handleChange('keywords', updated);
  };

  const requiredPublicationFields: {
    key: keyof typeof publication;
    label: string;
    check?: (value: (typeof publication)[keyof typeof publication]) => boolean;
  }[] = [
    { key: 'title', label: 'Title' },
    {
      key: 'authors',
      label: 'At least one author',
      check: (val) => Array.isArray(val) && val.length > 0,
    },
    { key: 'publisher', label: 'Publisher' },
    { key: 'excerpt', label: 'Excerpt' },
    { key: 'link', label: 'Link' },
  ];

  const validateForm = () => {
    for (const field of requiredPublicationFields) {
      const value = publication[field.key];
      const isEmpty = field.check
        ? !field.check(value)
        : typeof value === 'string'
          ? !value.trim()
          : !value;

      if (isEmpty) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newPublication = {
      ...publication,
      id: publicationToEdit?.id || generateSlug(publication.title),
    };

    try {
      const result = publicationToEdit
        ? await updatePublication(newPublication)
        : await addPublication(newPublication);

      if (result.success) {
        toast.success(
          publicationToEdit
            ? 'Publication updated successfully!'
            : 'Publication added successfully!',
        );
        router.push('/database/publications');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error saving publication: ${error.message}`
          : 'An unknown error occurred while saving the publication.',
      );
    }
  };

  const handleDelete = async () => {
    if (!publicationToEdit) return;

    try {
      const result = await deletePublication(publicationToEdit.id);

      if (result.success) {
        toast.success('Publication deleted successfully!');
        router.push('/database/publications');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error deleting publication: ${error.message}`
          : 'An unknown error occurred while deleting the publication.',
      );
    }
  };

  const confirmDelete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete the following publication? This action
          cannot be undone.
        </p>
        <div className='flex justify-center mb-6'>
          <PublicationCard publication={currentPreviewPublication} isInForm />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='destructive'
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
      <div className='space-y-6'>
        <div className='flex justify-center'>
          <PublicationCard publication={currentPreviewPublication} isInForm />
        </div>

        <Separator margin='5' />

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='title' required>
              Title
            </FormLabel>
            <Input
              type='text'
              value={publication.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='authors' required>
              Authors
            </FormLabel>
            <div className='space-y-2'>
              {publication.authors.map((author, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    type='text'
                    value={author}
                    onChange={(e) => handleAuthorChange(index, e.target.value)}
                    required
                  />
                  <Button
                    variant='destructive'
                    icon='trashSimple'
                    onClick={() => handleRemoveAuthor(index)}
                  />
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <Input
                  type='text'
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder='Add an author'
                />
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handleAddAuthor}
                />
              </div>
            </div>
          </div>
          <div>
            <FormLabel htmlFor='publisher' required>
              Publisher
            </FormLabel>
            <Input
              type='text'
              value={publication.publisher}
              onChange={(e) => handleChange('publisher', e.target.value)}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='excerpt' required>
              Excerpt
            </FormLabel>
            <Input
              type='text'
              value={publication.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='keywords'>Keywords</FormLabel>
            <div className='space-y-2'>
              {publication.keywords.map((keyword, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    type='text'
                    value={keyword}
                    onChange={(e) => handleKeywordChange(index, e.target.value)}
                  />
                  <Button
                    variant='destructive'
                    icon='trashSimple'
                    onClick={() => handleRemoveKeyword(index)}
                  />
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <Input
                  type='text'
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder='Add a keyword'
                />
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handleAddKeyword}
                />
              </div>
            </div>
          </div>
          <div>
            <FormLabel htmlFor='link' required>
              Publication Link
            </FormLabel>
            <Input
              type='text'
              value={publication.link}
              onChange={(e) => handleChange('link', e.target.value)}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='openAccess'>Open Access?</FormLabel>
            <Checkbox
              id='openAccess'
              label='Yes, this paper is open access'
              checked={publication.openAccess}
              onChange={(checked) => handleChange('openAccess', checked)}
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {publicationToEdit ? (
        <div className='flex space-x-4'>
          <Button
            variant='destructive'
            icon='trash'
            onClick={confirmDelete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            variant='primary'
            icon='floppyDisk'
            onClick={handleSubmit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant='primary'
          icon='plus'
          onClick={handleSubmit}
          className='w-full'
        >
          Add
        </Button>
      )}
    </>
  );
};

export default PublicationForm;
