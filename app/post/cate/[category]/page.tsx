import { getPosts } from '@/functions/posts';
import { Post } from '@/types/post';
import { Metadata } from 'next';
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

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    const categories = [
      ...new Set(posts.flatMap((post: Post) => post.categories || [])),
    ];

    return categories.map((category) => ({
      category: category.toString(),
    }));
  } catch (error) {
    console.error('Error generating category paths:', error);
    return [];
  }
}

async function getCategoryPosts(category: string): Promise<Post[]> {
  try {
    const allPosts = await getPosts();
    return allPosts.filter((post: Post) => post.categories?.includes(category));
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const posts = await getCategoryPosts(category);
  return <CategoryContent posts={posts} category={category} />;
}
