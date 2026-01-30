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
  postToEdit?: Post;
}

const initialPostState: Post = {
  id: '',
  title: '',
  excerpt: '',
  categories: [],
  dateString: '',
  content: '',
  image: '',
  image_url: '',
  audio: '',
  audio_url: '',
};

const PostForm: React.FC<PostFormProps> = ({ postToEdit }) => {
  const [post, setPost] = useState<Post>(postToEdit || initialPostState);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (postToEdit?.dateString) {
      return new Date(postToEdit.dateString);
    }
    return new Date('2025-01-01');
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (postToEdit?.dateString) {
        setSelectedDate(new Date(postToEdit.dateString));
      } else {
        setSelectedDate(new Date());
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [postToEdit]);

  const currentPreviewPost: Post = {
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
    dateString: post.dateString || formatDate(selectedDate),
  };

  const handleChange = <K extends keyof Post>(field: K, value: Post[K]) => {
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    handleChange('dateString', formatDate(newDate));
  };

  const requiredPostFields: {
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
    { key: 'dateString', label: 'Publication date' },
  ];

  const validateForm = () => {
    for (const field of requiredPostFields) {
      const value = post[field.key];
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

    const slug = generateSlug(post.title || '');
    const postData = {
      ...post,
      slug,
      dateString: formatDate(selectedDate),
    };

    try {
      let result;
      const recordId = postToEdit?.id || '';

      if (imageFile || audioFile) {
        const formData = new FormData();
        if (recordId) formData.append('id', recordId);

        // Append all post fields
        Object.entries(postData).forEach(([key, value]) => {
          if (key === 'categories' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        // Append files
        if (imageFile) formData.append('image', imageFile);
        if (audioFile) formData.append('audio', audioFile);

        result = postToEdit
          ? await updatePost(recordId, formData)
          : await addPost(formData);
      } else {
        result = postToEdit
          ? await updatePost(recordId, postData)
          : await addPost(postData);
      }

      if (result.success) {
        toast.success(
          postToEdit
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

  const handleDelete = async () => {
    if (!postToEdit) return;

    try {
      const result = await deletePost(postToEdit.id);

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

  const confirmDelete = () => {
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
        {/* Post Preview */}
        <div className='flex justify-center'>
          <PostCard post={currentPreviewPost} isPreview />
        </div>

        <Separator margin='5' />

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='title' required>
              Title
            </FormLabel>
            <Input
              type='text'
              value={post.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder='Post title'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='excerpt' required>
              Excerpt
            </FormLabel>
            <Textarea
              value={post.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
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
              content={post.content}
              onUpdate={(content) => handleChange('content', content)}
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
                handleChange(
                  'categories',
                  e.target.value.split(',').map((cat) => cat.trim()),
                )
              }
              placeholder='Category 1, Category 2'
            />
          </div>
          <div>
            <FormLabel htmlFor='publicationDate' required>
              Publication Date
            </FormLabel>
            <DateSelect
              value={selectedDate}
              onChange={handleDateChange}
              mode='day-month-year'
            />
          </div>
          <div>
            <FormLabel htmlFor='image_url'>Image URL</FormLabel>
            <div className='flex gap-2'>
              <Input
                type='text'
                value={post.image_url || ''}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder='https://image-url.com'
              />
              <FileUpload
                collectionName='posts'
                recordId={postToEdit?.id}
                fieldName='image'
                onUploadSuccess={(url) => handleChange('image', url)}
                onFileSelect={setImageFile}
              />
            </div>
          </div>
          <div>
            <FormLabel htmlFor='audio_url'>Audio URL</FormLabel>
            <div className='flex gap-2'>
              <Input
                type='text'
                value={post.audio_url || ''}
                onChange={(e) => handleChange('audio_url', e.target.value)}
                placeholder='https://audio-url.com'
              />
              <FileUpload
                collectionName='posts'
                recordId={postToEdit?.id}
                fieldName='audio'
                accept='audio/*'
                onUploadSuccess={(url) => handleChange('audio', url)}
                onFileSelect={setAudioFile}
              />
            </div>
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {postToEdit ? (
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

export default PostForm;
