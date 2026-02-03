'use client';

import { useEffect } from 'react';

import CommentSection from '@/components/CommentSection';
import { ViewTransition } from '@/components/Motion';
import PostContent from '@/components/PostContent';
import { Separator } from '@/components/UI';
import PostCard from '@/components/UI/Card/variants/Post';
import { useTitle } from '@/contexts/titleContext';
import { Post } from '@/types/post';

interface BlogPostContentProps {
  post?: Post;
  isLoading?: boolean;
}

export default function BlogPostContent({
  post,
  isLoading = false,
}: BlogPostContentProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    if (post?.title) {
      setHeaderTitle(post.title);
    }
  }, [post?.title, setHeaderTitle]);

  if (isLoading || !post) {
    return (
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0 min-h-screen'>
        <div className='animate-pulse space-y-8 px-4 max-w-4xl mx-auto'>
          <div className='h-[200px] bg-muted rounded-lg'></div>
          <div className='space-y-3'>
            <div className='h-4 bg-muted rounded w-3/4'></div>
            <div className='h-4 bg-muted rounded w-1/2'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
      <ViewTransition>
        <PostCard post={post} isPreview />
      </ViewTransition>

      <Separator margin='6' />

      <ViewTransition>
        <PostContent content={post?.content || ''} isLoading={isLoading} />
      </ViewTransition>

      <Separator margin='6' />

      <ViewTransition>
        <CommentSection post_id={post?.id || ''} isLoading={isLoading} />
      </ViewTransition>
    </div>
  );
}
