import { getPostById, getPosts } from '@/functions/posts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ManagePostContent from './content';

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
      title: post ? `Edit: ${post.title} - Zulfikar` : 'Edit Post - Zulfikar',
    };
  }

  return {
    title: 'Create Post - Zulfikar',
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts();

    // Generate paths for edit routes
    const editPaths = posts.map((post) => ({
      action: 'edit',
      id: post.id,
    }));

    // Add create route
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
