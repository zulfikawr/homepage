'use client';

import { Post } from '@/types/post';
import PageTitle from '@/components/PageTitle';
import PostForm from '@/components/Form/Post';
import { useTitle } from '@/contexts/titleContext';
import { useEffect } from 'react';

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
