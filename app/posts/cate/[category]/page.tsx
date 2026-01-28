import { Metadata } from 'next';

import { getPosts } from '@/database/posts';
import { Post } from '@/types/post';

import CategoryContent from './content';

type Props = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${category} - Zulfikar`,
    description: `Browse posts in the ${category} category`,
  };
}

async function getCategoryPosts(category: string): Promise<Post[]> {
  try {
    const allPosts = await getPosts();
    return allPosts.filter((post: Post) => post.categories?.includes(category));
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const posts = await getCategoryPosts(category);
  return <CategoryContent posts={posts} category={category} />;
}
