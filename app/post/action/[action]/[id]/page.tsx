import { getPostById, getPosts } from '@/functions/posts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ManagePostContent from '../../content';

type Props = {
  params: Promise<{
    action: string;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { action, id } = await params;
  const isEdit = action === 'edit';

  if (isEdit && id !== 'new') {
    const post = await getPostById(id);
    return {
      title: post ? `Edit: ${post.title}` : 'Edit Post',
    };
  }

  return {
    title: 'Create Post',
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts();

    const editPaths = posts.map((post) => ({
      action: 'edit',
      id: post.id,
    }));

    const createPath = {
      action: 'create',
      id: 'new',
    };

    return [...editPaths, createPath];
  } catch (error) {
    console.error('Error generating params:', error);
    return [];
  }
}

export default async function ManagePostPage({ params }: Props) {
  const { action, id } = await params;

  if (!['create', 'edit'].includes(action)) {
    notFound();
  }

  let post = null;
  if (action === 'edit' && id !== 'new') {
    post = await getPostById(id);
    if (!post) {
      notFound();
    }
  }

  return <ManagePostContent post={post} action={action} />;
}
