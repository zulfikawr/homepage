import { Metadata } from 'next';

import PublicationsContent from './content';

export const metadata: Metadata = {
  title: 'Publications - Zulfikar',
  description: 'My academic and professional publications',
};

export default async function PublicationsPage() {
  return <PublicationsContent />;
}
