import React, { useState } from 'react';
import { Post } from '~/types/post';
import { addPost, updatePost, deletePost } from '~/functions/posts';
import { toast } from '~/components/Toast';
import { drawer } from '~/components/Drawer';
import { generateSlug } from '~/utilities/generateSlug';
import { Button } from '~/components/UI';
import { modal } from '~/components/Modal';
import PostCard from '~/components/Card/Post';
import { Editor } from '~/components/Editor';
import DatePicker from '~/components/DatePicker';

interface PostFormProps {
  postToEdit?: Post;
  isInDrawer?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({
  postToEdit,
  isInDrawer,
}: PostFormProps) => {
  const [post, setPost] = useState<Post>(
    postToEdit || {
      id: '',
      slug: '',
      title: '',
      excerpt: '',
      categories: [],
      date: new Date().toISOString().split('T')[0],
      content: '',
      img: '',
      audioUrl: '',
    },
  );

  const handleContentUpdate = (content: string) => {
    setPost({ ...post, content });
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
    if (!post.date.trim()) {
      toast.show('Date is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newPost = {
      ...post,
      slug: generateSlug(post.title || ''),
    };

    try {
      let result;
      if (postToEdit) {
        result = await updatePost(newPost);
      } else {
        result = await addPost(newPost);
      }

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
        <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
          <div className='flex flex-row justify-between items-center'>
            <h1 className='text-lg font-semibold'>
              {postToEdit ? 'Edit Post' : 'Add New Post'}
            </h1>
            <div className='flex items-center space-x-2'>
              <Button
                icon='arrowSquareOut'
                onClick={() =>
                  (window.location.href = postToEdit
                    ? `/post/action/?action=edit&id=${postToEdit.id}`
                    : '/post/action/?action=create')
                }
              >
                <span className='hidden lg:block lg:ml-2'>
                  Open in full screen
                </span>
              </Button>
              <Button icon='close' onClick={() => drawer.close()}>
                <span className='hidden lg:block lg:ml-2'>Close</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {/* Post Preview */}
          <div className='flex justify-center'>
            <PostCard
              posts={[
                {
                  ...post,
                  slug: generateSlug(post.title || ''),
                },
              ]}
              isInForm
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Title <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                placeholder='Post title'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            {/* Editor Section */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Content <span className='text-red-500'>*</span>
              </label>
              <Editor content={post.content} onUpdate={handleContentUpdate} />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Excerpt</label>
              <textarea
                value={post.excerpt}
                onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                placeholder='Post excerpt'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Categories (Comma-separated)
              </label>
              <input
                type='text'
                value={post.categories?.join(', ') || ''}
                onChange={(e) =>
                  setPost({
                    ...post,
                    categories: e.target.value
                      .split(',')
                      .map((cat) => cat.trim()),
                  })
                }
                placeholder='Category 1, Category 2'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Date <span className='text-red-500'>*</span>
              </label>
              <DatePicker
                value={post.date ? new Date(post.date) : undefined}
                onChange={(date) =>
                  setPost({ ...post, date: date.toISOString().split('T')[0] })
                }
                minDate={new Date()}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Image URL
              </label>
              <input
                type='text'
                value={post.img || ''}
                onChange={(e) => setPost({ ...post, img: e.target.value })}
                placeholder='https://image-url.com'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Audio URL
              </label>
              <input
                type='text'
                value={post.audioUrl || ''}
                onChange={(e) => setPost({ ...post, audioUrl: e.target.value })}
                placeholder='https://audio-url.com'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
            <div className='flex justify-end space-x-4'>
              {postToEdit && (
                <Button type='destructive' icon='trash' onClick={confirmDelete}>
                  <span className='ml-2'>Delete</span>
                </Button>
              )}
              <Button type='primary' icon='floppyDisk' onClick={handleSubmit}>
                <span className='ml-2'>
                  {postToEdit ? 'Save Changes' : 'Add Post'}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostForm;
