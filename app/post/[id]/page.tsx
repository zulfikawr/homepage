import { getPostById, getPosts } from '@/database/posts';
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return notFound();
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
