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
  publication_to_edit?: Publication;
}

const initial_publication_state: Publication = {
  id: '',
  slug: '',
  title: '',
  authors: [],
  publisher: '',
  excerpt: '',
  keywords: [],
  open_access: false,
  link: '',
};

const PublicationForm: React.FC<PublicationFormProps> = ({
  publication_to_edit,
}) => {
  const [publication, set_publication] = useState<Publication>(
    publication_to_edit || initial_publication_state,
  );

  const [new_author, set_new_author] = useState('');
  const [new_keyword, set_new_keyword] = useState('');

  const current_preview_publication: Publication = {
    id: publication.id || 'preview',
    slug: publication.slug || 'preview',
    title: publication.title || 'Publication Title',
    authors: publication.authors.length ? publication.authors : ['Author Name'],
    publisher: publication.publisher || 'Publisher Name',
    excerpt: publication.excerpt || 'Publication excerpt',
    keywords: publication.keywords.length ? publication.keywords : ['Keyword'],
    open_access: publication.open_access,
    link: publication.link || '#',
  };

  const handle_change = (
    field: keyof Publication,
    value: string | string[] | boolean,
  ) => {
    set_publication((prev) => ({ ...prev, [field]: value }));
  };

  const handle_add_author = () => {
    const trimmed = new_author.trim();
    if (trimmed && !publication.authors.includes(trimmed)) {
      handle_change('authors', [...publication.authors, trimmed]);
      set_new_author('');
    }
  };

  const handle_remove_author = (index: number) => {
    const updated = publication.authors.filter((_, i) => i !== index);
    handle_change('authors', updated);
  };

  const handle_author_change = (index: number, value: string) => {
    const updated = [...publication.authors];
    updated[index] = value;
    handle_change('authors', updated);
  };

  const handle_add_keyword = () => {
    const trimmed = new_keyword.trim();
    if (trimmed && !publication.keywords.includes(trimmed)) {
      handle_change('keywords', [...publication.keywords, trimmed]);
      set_new_keyword('');
    }
  };

  const handle_remove_keyword = (index: number) => {
    const updated = publication.keywords.filter((_, i) => i !== index);
    handle_change('keywords', updated);
  };

  const handle_keyword_change = (index: number, value: string) => {
    const updated = [...publication.keywords];
    updated[index] = value;
    handle_change('keywords', updated);
  };

  const required_publication_fields: {
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

  const validate_form = () => {
    for (const field of required_publication_fields) {
      const value = publication[field.key];
      const is_empty = field.check
        ? !field.check(value)
        : typeof value === 'string'
          ? !value.trim()
          : !value;

      if (is_empty) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const router = useRouter();

  const handle_submit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!validate_form()) return;

    const new_publication = {
      ...publication,
      id: publication_to_edit?.id || generateSlug(publication.title),
    };

    try {
      const result = publication_to_edit
        ? await updatePublication(new_publication)
        : await addPublication(new_publication);

      if (result.success) {
        toast.success(
          publication_to_edit
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

  const handle_delete = async () => {
    if (!publication_to_edit) return;

    try {
      const result = await deletePublication(publication_to_edit.id);

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

  const confirm_delete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete the following publication? This action
          cannot be undone.
        </p>
        <div className='flex justify-center mb-6'>
          <PublicationCard
            publication={current_preview_publication}
            isPreview
          />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              handle_delete();
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
          <PublicationCard
            publication={current_preview_publication}
            isPreview
          />
        </div>

        <Separator margin='5' />

        {/* Form */}
        <form onSubmit={handle_submit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='title' required>
              Title
            </FormLabel>
            <Input
              type='text'
              value={publication.title || ''}
              onChange={(e) => handle_change('title', e.target.value)}
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
                    value={author || ''}
                    onChange={(e) =>
                      handle_author_change(index, e.target.value)
                    }
                    required
                  />
                  <Button
                    variant='destructive'
                    icon='trashSimple'
                    onClick={() => handle_remove_author(index)}
                  />
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <Input
                  type='text'
                  value={new_author || ''}
                  onChange={(e) => set_new_author(e.target.value)}
                  placeholder='Add an author'
                />
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handle_add_author}
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
              value={publication.publisher || ''}
              onChange={(e) => handle_change('publisher', e.target.value)}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='excerpt' required>
              Excerpt
            </FormLabel>
            <Input
              type='text'
              value={publication.excerpt || ''}
              onChange={(e) => handle_change('excerpt', e.target.value)}
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
                    value={keyword || ''}
                    onChange={(e) =>
                      handle_keyword_change(index, e.target.value)
                    }
                  />
                  <Button
                    variant='destructive'
                    icon='trashSimple'
                    onClick={() => handle_remove_keyword(index)}
                  />
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <Input
                  type='text'
                  value={new_keyword || ''}
                  onChange={(e) => set_new_keyword(e.target.value)}
                  placeholder='Add a keyword'
                />
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handle_add_keyword}
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
              value={publication.link || ''}
              onChange={(e) => handle_change('link', e.target.value)}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='open_access'>Open Access?</FormLabel>
            <Checkbox
              id='open_access'
              label='Yes, this paper is open access'
              checked={publication.open_access}
              onChange={(checked) => handle_change('open_access', checked)}
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {publication_to_edit ? (
        <div className='flex space-x-4'>
          <Button
            variant='destructive'
            icon='trash'
            onClick={confirm_delete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            variant='primary'
            icon='floppyDisk'
            onClick={handle_submit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant='primary'
          icon='plus'
          onClick={handle_submit}
          className='w-full'
        >
          Add
        </Button>
      )}
    </>
  );
};

export default PublicationForm;
