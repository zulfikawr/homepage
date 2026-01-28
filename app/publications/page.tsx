import { Metadata } from 'next';

import { getPublications } from '@/database/publications';

import PublicationsContent from './content';

export const metadata: Metadata = {
  title: 'Publications - Zulfikar',
  description: 'My academic and professional publications',
};

export default async function PublicationsPage() {
  const publications = await getPublications();
  return <PublicationsContent initialData={publications} />;
}
