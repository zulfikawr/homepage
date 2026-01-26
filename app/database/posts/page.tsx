import { Metadata } from 'next';

import PostDatabase from './content';

export const metadata: Metadata = {
  title: 'Post - Zulfikar',
  description: 'Browse all posts on Zulfikar',
};

export default async function PostPage() {
  return <PostDatabase />;
}
