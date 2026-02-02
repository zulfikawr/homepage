import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FormSkeleton } from '@/components/Form/Loading';
import { getPostById } from '@/database/posts';

import EditPostPage from './content';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function PostLoader({ params }: Props) {
  const { slug } = await params;
  const post = await getPostById(slug);

  if (!post) return notFound();

  return <EditPostPage post={post} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostById(slug);

  return {
    title: post ? `Edit ${post.title}` : 'Edit Post',
  };
}

export default function PostEditPage({ params }: Props) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <PostLoader params={params} />
    </Suspense>
  );
}
