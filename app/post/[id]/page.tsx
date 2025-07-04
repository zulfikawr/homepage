import { getPostById, getPosts } from '@/functions/posts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostContent from './content';
import { Suspense } from 'react';
import LoadingSkeleton from './loading';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function PostLoader({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return notFound();
  }

  return <BlogPostContent post={post} />;
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((post) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error('Error generating params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return {
      title: 'Post Not Found - Zulfikar',
    };
  }

  return {
    title: `${post.title} - Zulfikar`,
    description: post.excerpt || post.title,
  };
}

export default function PostPage({ params }: Props) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PostLoader params={params} />
    </Suspense>
  );
}
