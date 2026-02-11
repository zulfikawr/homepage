import { Metadata } from 'next';

import PublicationsContent from './content';

export const metadata: Metadata = {
  title: 'Publications',
  description: 'A collection of my publications',
};

export default async function PublicationPage() {
  return <PublicationsContent />;
}
