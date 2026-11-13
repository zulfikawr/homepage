'use client';

import { useEffect } from 'react';

import { ViewTransition } from '@/components/motion';
import { Shimmer } from '@/components/ui/shimmer';
import PostContent from '@/components/post-content';
import { Separator } from '@/components/ui';
import PostCard from '@/components/ui/card/variants/post';
import { useTitle } from '@/contexts/title-context';
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

  const renderPost: Post = post || {
    id: 'loading-post',
    title: 'Post Title',
    excerpt:
      'A short excerpt describing the post and what the reader can expect from it.',
    content:
      '## Introduction\n\nThis is a placeholder paragraph used to measure the real post layout while the content is loading.\n\n## Section heading\n\nAnother paragraph of placeholder content that mirrors the real article structure.\n\n- A list item\n- Another list item\n\n> A short quote to keep the layout honest.',
    categories: ['Category'],
    date_string: 'January 1, 2025',
    image: '/images/placeholder-portrait.png',
  };

  return (
    <Shimmer loading={isLoading || !post}>
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <ViewTransition>
          <PostCard post={renderPost} isPreview />
        </ViewTransition>

        <Separator margin='6' />

        <ViewTransition>
          <PostContent content={renderPost.content || ''} />
        </ViewTransition>
      </div>
    </Shimmer>
  );
}
