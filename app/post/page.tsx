import { Metadata } from 'next';
import PostsContent from './content';
import { getPosts } from '@/database/posts';

export const metadata: Metadata = {
  title: 'Posts - Zulfikar',
  description: 'Browse all posts on Zulfikar',
};

export default async function PostsPage() {
  const posts = await getPosts();
  return <PostsContent initialData={posts} />;
}
