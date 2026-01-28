import { Metadata } from 'next';

import { getPosts } from '@/database/posts';

import CategoriesContent from './content';

export const metadata: Metadata = {
  title: 'Categories - Zulfikar',
  description: 'Browse all post categories',
};

export default async function CategoriesPage() {
  const posts = await getPosts();
  return <CategoriesContent initialPosts={posts} />;
}
