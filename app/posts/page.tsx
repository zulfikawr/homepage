import { Suspense } from 'react';
import { Metadata } from 'next';

import { getPosts } from '@/lib/data';

import PostsContent, { PostsSkeleton } from './content';

export const metadata: Metadata = {
  title: 'Posts - Zulfikar',
  description: 'Browse all posts on Zulfikar',
};

async function PostsList() {
  const posts = await getPosts();
  return <PostsContent posts={posts} />;
}

export default function PostsPage() {
  return (
    <Suspense fallback={<PostsSkeleton />}>
      <PostsList />
    </Suspense>
  );
}
