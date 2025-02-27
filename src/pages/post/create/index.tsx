import { useState } from 'react';
import Head from 'next/head';
import { Icon, Button } from '~/components/UI';
import { pageLayout } from '~/components/Page';
import { NextPageWithLayout } from '../../_app';
import Link from 'next/link';
import { database, ref, set } from '~/lib/firebase';
import { Editor } from '~/components/Editor';
import { Post } from '~/constants/propTypes';
import Image from 'next/image';
import blurDataURL from '~/constants/blurDataURL';
import { Hover } from '~/components/Visual';

const CreatePost: NextPageWithLayout = () => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [categories, setCategories] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'image' | 'audio'>('text');

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const slug = generateSlug(title);
    const processedCategories = categories
      .split(',')
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);

    const newPost: Post = {
      type: postType,
      img: imageUrl,
      title: title,
      slug: slug,
      excerpt: excerpt,
      categories: processedCategories,
      date: new Date().toISOString(),
      content: content,
      audioUrl: postType === 'audio' ? audioUrl : undefined,
    };

    const postToSave = Object.fromEntries(
      Object.entries(newPost).filter(([_, value]) => value !== undefined),
    );

    const postRef = ref(database, `posts/${slug}`);
    await set(postRef, postToSave);

    console.log('New Post Added:', postToSave);

    // Reset form fields
    setTitle('');
    setExcerpt('');
    setImageUrl('');
    setAudioUrl('');
    setCategories('');
    setContent('');
    setPostType('text');
  };

  return (
    <>
      <Head>
        <title>Create Post - Blog</title>
        <meta name='description' content='Create a new blog post' />
      </Head>
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex-1 items-center'>
            <h1 className='text-1 font-medium tracking-wide text-black dark:text-white'>
              <span className='mr-3 inline-block'>📑</span>
              Create Post
            </h1>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1'>
              <p className='text-xl text-gray-500 dark:text-gray-400'>
                <Link
                  href='/'
                  className='flex items-center hover:bg-gray-300 p-2 rounded-md'
                >
                  <span className='mr-2 h-6 w-6'>
                    <Icon name='left' />
                  </span>
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className='w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Left Column: Image Preview and Input */}
            <div className='col-span-1'>
              <Hover
                perspective={1000}
                max={25}
                scale={1.01}
                className='relative h-48 w-full rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden'
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt='Preview'
                    fill
                    className='rounded-md object-cover'
                    placeholder='blur'
                    blurDataURL={blurDataURL}
                  />
                ) : (
                  <div className='flex items-center justify-center p-4 text-center'>
                    <input
                      type='text'
                      placeholder='Image URL'
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className='w-full bg-transparent focus:outline-none dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm text-center'
                    />
                  </div>
                )}
              </Hover>
            </div>

            {/* Right Column: Title, Excerpt, Categories */}
            <div className='col-span-2'>
              <input
                type='text'
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full text-3xl font-bold bg-transparent focus:outline-none dark:text-white'
              />

              <div className='mt-4'>
                <input
                  type='text'
                  placeholder='Short Excerpt'
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className='w-full text-md bg-transparent focus:outline-none dark:text-white'
                />
              </div>

              <div className='mt-4'>
                <input
                  type='text'
                  placeholder='Categories (comma-separated)'
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  className='w-full bg-transparent focus:outline-none dark:text-white'
                />
              </div>

              <div className='mt-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Post Type
                </label>
                <select
                  value={postType}
                  onChange={(e) =>
                    setPostType(e.target.value as 'text' | 'image' | 'audio')
                  }
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                >
                  <option value='text'>Text</option>
                  <option value='image'>Image</option>
                  <option value='audio'>Audio</option>
                </select>
              </div>

              {postType === 'audio' && (
                <div className='mt-4'>
                  <input
                    type='text'
                    placeholder='Audio URL'
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className='w-full bg-transparent focus:outline-none dark:text-white'
                  />
                </div>
              )}
            </div>
          </div>

          {/* Editor Section */}
          <div className='mt-6'>
            <Editor
              content={content}
              onUpdate={(newContent) => setContent(newContent)}
            />
          </div>

          {/* Publish Button */}
          <div className='flex justify-end mt-6'>
            <Button type='primary' onClick={handleSubmit} className='px-4 py-2'>
              Publish Post
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

CreatePost.layout = pageLayout;
export default CreatePost;
