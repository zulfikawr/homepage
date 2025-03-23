'use client';

import React, { useMemo, useState } from 'react';
import { Post } from '@/types/post';
import { addPost, updatePost, deletePost } from '@/functions/posts';
import { toast } from '@/components/Toast';
import { drawer } from '@/components/Drawer';
import { generateId } from '@/utilities/generateId';
import { Button, Dropdown, FormLabel, Input, Textarea } from '@/components/UI';
import { modal } from '@/components/Modal';
import PostCard from '@/components/Card/Post';
import { Editor } from '@/components/Editor';

interface PostFormProps {
  postToEdit?: Post;
  onUpdate?: () => Promise<void>;
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

const PostForm: React.FC<PostFormProps> = ({
  postToEdit,
  onUpdate,
  isInDrawer,
}) => {
  const [post, setPost] = useState<Post>(postToEdit || initialPostState);

  const initialDate = useMemo(() => {
    const date = postToEdit?.dateString
      ? new Date(postToEdit.dateString)
      : new Date();
    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  }, [postToEdit]);

  const [selectedDay, setSelectedDay] = useState(initialDate.day);
  const [selectedMonth, setSelectedMonth] = useState(initialDate.month);
  const [selectedYear, setSelectedYear] = useState(initialDate.year);

  const handleChange = (field: keyof Post, value: string | string[] | Date) => {
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!post.title.trim()) {
      toast.show('Title is required.');
      return false;
    }
    if (!post.content.trim()) {
      toast.show('Content is required.');
      return false;
    }
    if (!post.dateString) {
      toast.show('Publication date is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newPost = {
      ...post,
      id: postToEdit?.id || generateId(post.title),
      dateString:
        postToEdit?.dateString ||
        new Date(selectedYear, selectedMonth, selectedDay).toLocaleDateString(
          'en-GB',
          {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
        ),
    };

    try {
      const result = postToEdit
        ? await updatePost(newPost)
        : await addPost(newPost);

      if (result.success) {
        await onUpdate?.();
        drawer.close();
        toast.show(
          postToEdit
            ? 'Post updated successfully!'
            : 'Post added successfully!',
        );
      } else {
        throw new Error(result.error || 'Failed to save post');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error saving post: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while saving the post.');
      }
    }
  };

  const handleDelete = async () => {
    if (!postToEdit) return;

    try {
      const result = await deletePost(postToEdit.id);

      if (result.success) {
        await onUpdate?.();
        drawer.close();
        toast.show('Post deleted successfully!');
      } else {
        throw new Error(result.error || 'Failed to delete post');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error deleting post: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while deleting the post.');
      }
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

  const renderDateSelect = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const years = Array.from(
      { length: 50 },
      (_, i) => new Date().getFullYear() - i,
    );

    return (
      <div className='flex gap-2 w-full'>
        {/* Day Select */}
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(Number(e.target.value))}
          className='w-20 rounded-md border border-neutral-300 bg-neutral-50 p-2 shadow-sm focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white'
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        {/* Month Select */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className='w-32 rounded-md border border-neutral-300 bg-neutral-50 p-2 shadow-sm focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white'
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>

        {/* Year Select */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className='w-24 rounded-md border border-neutral-300 bg-neutral-50 p-2 shadow-sm focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white'
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <>
      {/* Header */}
      {isInDrawer && (
        <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-neutral-700'>
          <div className='flex flex-row justify-between items-center'>
            <h1 className='text-lg font-semibold'>
              {postToEdit ? `${post.title}` : 'Add New Post'}
            </h1>
            <div className='hidden md:flex space-x-4'>
              {postToEdit && (
                <Button type='destructive' icon='trash' onClick={confirmDelete}>
                  Delete
                </Button>
              )}
              <Button type='primary' icon='floppyDisk' onClick={handleSubmit}>
                {postToEdit ? 'Save' : 'Add'}
              </Button>
              <Button
                icon='arrowSquareOut'
                onClick={() =>
                  (window.location.href = postToEdit
                    ? `/post/action/edit/${postToEdit.id}`
                    : '/post/action/create/new')
                }
              >
                <span className='hidden lg:block'>Open in full screen</span>
              </Button>
              <Button icon='close' onClick={() => drawer.close()} />
            </div>

            <div className='block md:hidden'>
              <Dropdown trigger={<Button icon='dotsThree' />} position='left'>
                <div className='flex flex-col p-2 space-y-2'>
                  <Button
                    icon='arrowSquareOut'
                    onClick={() =>
                      (window.location.href = postToEdit
                        ? `/post/action/edit/${postToEdit.id}`
                        : '/post/action/create/new')
                    }
                  >
                    <span>Open in full screen</span>
                  </Button>

                  {postToEdit && (
                    <Button
                      type='destructive'
                      icon='trash'
                      onClick={confirmDelete}
                      className='w-full'
                    >
                      <span>Delete</span>
                    </Button>
                  )}

                  {postToEdit ? (
                    <Button
                      type='primary'
                      icon='floppyDisk'
                      onClick={handleSubmit}
                      className='w-full'
                    >
                      <span>Save</span>
                    </Button>
                  ) : (
                    <Button
                      type='primary'
                      icon='plus'
                      onClick={handleSubmit}
                      className='w-full'
                    >
                      <span>Add</span>
                    </Button>
                  )}
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-6'>
          {/* Post Preview */}
          <div className='flex justify-center'>
            <PostCard
              posts={[
                {
                  ...post,
                  id: generateId(post.title || ''),
                  title: post.title || 'Untitled Post',
                  excerpt: post.excerpt || 'This is a post excerpt.',
                  categories: post.categories || ['Post category'],
                  dateString:
                    post.dateString ||
                    new Date(
                      selectedYear,
                      selectedMonth,
                      selectedDay,
                    ).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }),
                },
              ]}
              isInForm
            />
          </div>

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
              {renderDateSelect()}
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
      </div>
    </>
  );
};

export default PostForm;
