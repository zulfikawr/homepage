'use client';

import PostContent from '@/components/PostContent';
import { useTitle } from '@/contexts/titleContext';
import { Post } from '@/types/post';
import { useEffect } from 'react';
import PageTitle from '@/components/PageTitle';

interface BlogPostContentProps {
  post: Post;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    if (post?.title) {
      setHeaderTitle(post.title);
    }
    return () => {
      setHeaderTitle('Posts - Zulfikar');
    };
  }, [setHeaderTitle, post?.title]);

  return (
    <div>
      <PageTitle
        title={`${post.title}`}
        subtitle={`${post.excerpt}`}
        badge={{
          color: 'blue',
          text: post.categories[0],
        }}
        route={`/post/${post.id}`}
        noBackButton
      />

      <PostContent content={post.content || ''} />
    </div>
  );
}
