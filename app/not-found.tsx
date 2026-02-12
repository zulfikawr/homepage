import { Metadata } from 'next';

import NotFound from '@/components/not-found';

export const metadata: Metadata = {
  title: '404 Not Found | Zulfikar',
  description: 'The page you are looking for could not be found.',
};

export default function NotFoundPage() {
  return <NotFound />;
}
