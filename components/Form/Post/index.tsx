'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DateSelect from '@/components/DateSelect';
import { Editor } from '@/components/Editor';
import { modal } from '@/components/UI';
import { toast } from '@/components/UI';
import {
  Button,
  FileUpload,
  FormLabel,
  Input,
  Textarea,
} from '@/components/UI';
import PostCard from '@/components/UI/Card/variants/Post';
import { Separator } from '@/components/UI/Separator';
import { addPost, deletePost, updatePost } from '@/database/posts';
import { Post } from '@/types/post';
import { formatDate } from '@/utilities/formatDate';
import { generateSlug } from '@/utilities/generateSlug';

interface PostFormProps {
  post_to_edit?: Post;
}

const initial_post_state: Post = {
  id: '',
  title: '',
  excerpt: '',
  categories: [],
  date_string: '',
  content: '',
  image: '',
  image_url: '',
  audio: '',
  audio_url: '',
};

const PostForm: React.FC<PostFormProps> = ({ post_to_edit }) => {
  const [post, set_post] = useState<Post>(post_to_edit || initial_post_state);

  const [image_file, set_image_file] = useState<File | null>(null);
  const [audio_file, set_audio_file] = useState<File | null>(null);

  const [selected_date, set_selected_date] = useState<Date>(() => {
    if (post_to_edit?.date_string) {
      return new Date(post_to_edit.date_string);
    }
    return new Date('2025-01-01');
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (post_to_edit?.date_string) {
        set_selected_date(new Date(post_to_edit.date_string));
      } else {
        set_selected_date(new Date());
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [post_to_edit]);

  const current_preview_post: Post = {
    id: post.id || 'preview',
    title: post.title || 'Post Title',
    excerpt: post.excerpt || 'This is a post excerpt.',
    content: post.content || '',
    image: post.image || post.image_url || '/images/placeholder.png',
    audio: post.audio || post.audio_url || '',
    categories:
      post.categories && post.categories.length
        ? post.categories
        : ['Post Categories'],
    date_string: post.date_string || formatDate(selected_date),
  };

  const handle_change = <K extends keyof Post>(field: K, value: Post[K]) => {
    set_post((prev) => ({ ...prev, [field]: value }));
  };

  const handle_date_change = (new_date: Date) => {
    set_selected_date(new_date);
    handle_change('date_string', formatDate(new_date));
  };

  const required_post_fields: {
    key: keyof Post;
    label: string;
    check?: (value: (typeof post)[keyof typeof post]) => boolean;
  }[] = [
    { key: 'title', label: 'Title' },
    { key: 'excerpt', label: 'Excerpt' },
    { key: 'content', label: 'Content' },
    {
      key: 'categories',
      label: 'Categories',
      check: (val) => Array.isArray(val) && val.length > 0,
    },
    { key: 'date_string', label: 'Publication date' },
  ];

  const validate_form = () => {
    for (const field of required_post_fields) {
      const value = post[field.key];
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

    const slug = generateSlug(post.title || '');
    const post_data = {
      ...post,
      slug,
      date_string: formatDate(selected_date),
    };
    delete (post_data as { id?: string }).id;

    try {
      let result;
      const record_id = post_to_edit?.id || '';

      if (image_file || audio_file) {
        const form_data = new FormData();
        if (record_id) form_data.append('id', record_id);

        // Append all post fields
        Object.entries(post_data).forEach(([key, value]) => {
          if (key === 'categories' && Array.isArray(value)) {
            form_data.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            form_data.append(key, value.toString());
          }
        });

        // Append files
        if (image_file) form_data.append('image', image_file);
        if (audio_file) form_data.append('audio', audio_file);

        result = post_to_edit
          ? await updatePost(record_id, form_data)
          : await addPost(form_data);
      } else {
        result = post_to_edit
          ? await updatePost(record_id, post_data)
          : await addPost(post_data);
      }

      if (result.success) {
        toast.success(
          post_to_edit
            ? 'Post updated successfully!'
            : 'Post added successfully!',
        );
        router.push('/database/posts');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error saving the post: ${error.message}`
          : 'An unknown error occurred while saving the post.',
      );
    }
  };

  const handle_delete = async () => {
    if (!post_to_edit) return;

    try {
      const result = await deletePost(post_to_edit.id);

      if (result.success) {
        toast.success('Post deleted successfully!');
        router.push('/database/posts');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error deleting the post: ${error.message}`
          : 'An unknown error occurred while deleting the post.',
      );
    }
  };

  const confirm_delete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>
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
        {/* Post Preview */}
        <div className='flex justify-center'>
          <PostCard post={current_preview_post} isPreview />
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
              value={post.title || ''}
              onChange={(e) => handle_change('title', e.target.value)}
              placeholder='Post title'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='excerpt' required>
              Excerpt
            </FormLabel>
            <Textarea
              value={post.excerpt || ''}
              onChange={(e) => handle_change('excerpt', e.target.value)}
              placeholder='Post excerpt'
              rows={4}
              required
            />
          </div>
          {/* Editor Section */}
          <div>
            <FormLabel htmlFor='content' required>
              Content
            </FormLabel>
            <Editor
              content={post.content || ''}
              onUpdate={(content) => handle_change('content', content)}
              className='h-[800px] md:h-[500px]'
            />
          </div>
          <div>
            <FormLabel htmlFor='categories' required>
              Categories (Comma-separated)
            </FormLabel>
            <Input
              type='text'
              value={post.categories?.join(', ') || ''}
              onChange={(e) =>
                handle_change(
                  'categories',
                  e.target.value.split(',').map((cat) => cat.trim()),
                )
              }
              placeholder='Category 1, Category 2'
            />
          </div>
          <div>
            <FormLabel htmlFor='publication_date' required>
              Publication Date
            </FormLabel>
            <DateSelect
              value={selected_date}
              onChange={handle_date_change}
              mode='day-month-year'
            />
          </div>
          <div>
            <FormLabel htmlFor='image_url'>Image URL</FormLabel>
            <div className='flex gap-2'>
              <Input
                type='text'
                value={post.image_url || ''}
                onChange={(e) => handle_change('image_url', e.target.value)}
                placeholder='https://image-url.com'
              />
              <FileUpload
                collectionName='posts'
                recordId={post_to_edit?.id}
                fieldName='image'
                existingValue={post.image_url}
                onUploadSuccess={(url) => handle_change('image_url', url)}
                onFileSelect={set_image_file}
              />
            </div>
          </div>
          <div>
            <FormLabel htmlFor='audio_url'>Audio URL</FormLabel>
            <div className='flex gap-2'>
              <Input
                type='text'
                value={post.audio_url || ''}
                onChange={(e) => handle_change('audio_url', e.target.value)}
                placeholder='https://audio-url.com'
              />
              <FileUpload
                collectionName='posts'
                recordId={post_to_edit?.id}
                fieldName='audio'
                existingValue={post.audio_url}
                accept='audio/*'
                onUploadSuccess={(url) => handle_change('audio_url', url)}
                onFileSelect={set_audio_file}
              />
            </div>
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {post_to_edit ? (
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

export default PostForm;
