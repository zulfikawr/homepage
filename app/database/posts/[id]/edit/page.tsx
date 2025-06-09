import { getPostById, getPosts } from '@/functions/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditPostPage from './content';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function PostLoader({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) return notFound();

  return <EditPostPage post={post} />;
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((post) => ({
      id: post.id,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);

  return {
    title: post ? `Edit ${post.title}` : 'Edit Post',
  };
}

export default function PostEditPage({ params }: Props) {
  return <PostLoader params={params} />;
}
