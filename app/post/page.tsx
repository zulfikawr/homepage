import { Metadata } from 'next';
import PostsContent from './content';

export const metadata: Metadata = {
  title: 'All Posts - Zulfikar',
  description: 'Browse all posts on Zulfikar',
};

export default function PostsPage() {
  return <PostsContent />;
}
