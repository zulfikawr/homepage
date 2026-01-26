'use client';

import { useEffect } from 'react';

import PostForm from '@/components/Form/Post';
import PageTitle from '@/components/PageTitle';
import { useTitle } from '@/contexts/titleContext';
import { Post } from '@/types/post';

interface EditPostPageProps {
  post: Post;
}

export default function EditPostPage({ post }: EditPostPageProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle(`Edit: ${post.title}`);
    return () => setHeaderTitle('Post');
  }, [post.title, setHeaderTitle]);

  return (
    <div>
      <PageTitle emoji='📰' title='Edit Post' subtitle={post.title} />
      <PostForm postToEdit={post} />
    </div>
  );
}
