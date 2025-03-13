'use client';

import React, { useMemo, useState } from 'react';
import { Post } from '@/types/post';
import { addPost, updatePost, deletePost } from '@/functions/posts';
import { toast } from '@/components/Toast';
import { drawer } from '@/components/Drawer';
import { generateId } from '@/utilities/generateId';
import { Button, FormLabel, Input, Textarea } from '@/components/UI';
import { modal } from '@/components/Modal';
import PostCard from '@/components/Card/Post';
import { Editor } from '@/components/Editor';
import DatePicker from '@/components/DatePicker';

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

const PostForm: React.FC<PostFormProps> = ({ postToEdit, isInDrawer }) => {
  const [post, setPost] = useState<Post>(postToEdit || initialPostState);

  const selectedDate = useMemo(() => {
    return postToEdit?.dateString
      ? new Date(postToEdit.dateString)
      : new Date();
  }, [postToEdit]);

  const handleChange = (field: keyof Post, value: string | string[] | Date) => {
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (dates: { start: Date; end: Date }) => {
    const newDate = dates.start;
    handleChange(
      'dateString',
      newDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    );
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
    if (!selectedDate) {
      toast.show('Publication date is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formattedDate = selectedDate!.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newPost = {
      ...post,
      id: postToEdit?.id || generateId(post.title),
      dateString: formattedDate,
    };

    try {
      const result = postToEdit
        ? await updatePost(newPost)
        : await addPost(newPost);

      if (result.success) {
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

  return (
    <>
      {/* Header */}
      {isInDrawer && (
        <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-neutral-700'>
          <div className='flex flex-row justify-between items-center'>
            <h1 className='text-lg font-semibold'>
              {postToEdit ? 'Edit Post' : 'Add New Post'}
            </h1>
            <div className='flex items-center space-x-2'>
              <Button
                type='primary'
                icon='arrowSquareOut'
                onClick={() =>
                  (window.location.href = postToEdit
                    ? `/post/action/?action=edit&id=${postToEdit.id}`
                    : '/post/action/?action=create')
                }
              >
                <span className='hidden lg:block'>Open in full screen</span>
              </Button>
              <Button icon='close' onClick={() => drawer.close()} />
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
                  dateString: selectedDate
                    ? selectedDate.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Today',
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
              <DatePicker
                value={{ start: selectedDate, end: selectedDate }}
                onChange={handleDateChange}
                isRange={false}
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
            <div className='flex justify-end space-x-4 pt-4'>
              {postToEdit && (
                <Button type='destructive' icon='trash' onClick={confirmDelete}>
                  Delete
                </Button>
              )}
              <Button type='primary' icon='floppyDisk' onClick={handleSubmit}>
                {postToEdit ? 'Save Changes' : 'Add Post'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostForm;
