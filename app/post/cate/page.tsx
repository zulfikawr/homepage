import { getPosts } from '@/functions/posts';
import { Post } from '@/types/post';
import { Metadata } from 'next';
import CategoriesContent from './content';

export const metadata: Metadata = {
  title: 'Categories - Zulfikar',
  description: 'Browse all post categories',
};

async function getCategories() {
  try {
    const posts = await getPosts();
    const categoryMap = new Map<string, number>();

    posts.forEach((post: Post) => {
      if (post.categories && Array.isArray(post.categories)) {
        post.categories.forEach((category: string) => {
          const currentCount = categoryMap.get(category) || 0;
          categoryMap.set(category, currentCount + 1);
        });
      }
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  return <CategoriesContent categories={categories} />;
}
