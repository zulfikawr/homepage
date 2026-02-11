import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPostById } from '@/database/posts';

import BlogPostContent from './content';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function PostLoader({ params }: Props) {
  const { slug } = await params;
  const post = await getPostById(slug);

  if (!post) {
    return notFound();
  }

  return <BlogPostContent post={post} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostById(slug);

  if (!post) {
    return notFound();
  }

  return {
    title: `${post.title}`,
    description: post.excerpt || post.title,
  };
}

export default function PostPage({ params }: Props) {
  return (
    <Suspense fallback={<BlogPostContent isLoading={true} />}>
      <PostLoader params={params} />
    </Suspense>
  );
}
