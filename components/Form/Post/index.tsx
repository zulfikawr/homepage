'use client';

import React, { useMemo, useState } from 'react';
import { Post } from '@/types/post';
import { addPost, updatePost, deletePost } from '@/database/posts';
import { toast } from '@/components/Toast';
import { generateId } from '@/utilities/generateId';
import { Button, FormLabel, Input, Textarea } from '@/components/UI';
import { modal } from '@/components/Modal';
import PostCard from '@/components/Card/Post';
import { Editor } from '@/components/Editor';
import { formatDate } from '@/utilities/formatDate';
import DateSelect from '@/components/DateSelect';
import Separator from '@/components/UI/Separator';
import { useRouter } from 'next/navigation';

interface PostFormProps {
  postToEdit?: Post;
  isInDrawer?: boolean;
}

const initialPostState: Post = {
  id: '',
  title: '',
  excerpt: '',
  categories: [],
  dateString: '',
  content: '<p></p>',
  img: '',
  audioUrl: '',
};

const PostForm: React.FC<PostFormProps> = ({ postToEdit }) => {
  const [post, setPost] = useState<Post>(postToEdit || initialPostState);

  const initialDate = useMemo(() => {
    const date = postToEdit?.dateString
      ? new Date(postToEdit.dateString)
      : new Date();
    return date;
  }, [postToEdit]);

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const currentPreviewPost: Post = {
    id: post.id || 'preview',
    title: post.title || 'Post Title',
    excerpt: post.excerpt || 'This is a post excerpt.',
    content: post.content || '',
    img: post.img,
    categories: post.categories.length ? post.categories : ['Post Categories'],
    dateString: post.dateString || formatDate(selectedDate),
  };

  const handleChange = (field: keyof Post, value: string | string[] | Date) => {
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

    const postData = {
      ...post,
      id: postToEdit?.id || generateId(post.title),
      dateString: formatDate(selectedDate),
    };

    try {
      const result = postToEdit
        ? await updatePost(postData)
        : await addPost(postData);

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
        <p className='mb-6'>
          Are you sure you want to delete this post? This action cannot be
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
      <div className='space-y-6'>
        {/* Post Preview */}
        <div className='flex justify-center'>
          <PostCard post={currentPreviewPost} isInForm />
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
            <FormLabel htmlFor='imgUrl'>Image URL</FormLabel>
            <Input
              type='text'
              value={post.img || ''}
              onChange={(e) => handleChange('img', e.target.value)}
              placeholder='https://image-url.com'
            />
          </div>
          <div>
            <FormLabel htmlFor='audioUrl'>Audio URL</FormLabel>
            <Input
              type='text'
              value={post.audioUrl || ''}
              onChange={(e) => handleChange('audioUrl', e.target.value)}
              placeholder='https://audio-url.com'
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {postToEdit ? (
        <div className='flex space-x-4'>
          <Button
            type='destructive'
            icon='trash'
            onClick={confirmDelete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            type='primary'
            icon='floppyDisk'
            onClick={handleSubmit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          type='primary'
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
