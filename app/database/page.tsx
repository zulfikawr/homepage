import { Metadata } from 'next';

import DatabaseContent from './content';

export const metadata: Metadata = {
  title: 'Database - Zulfikar',
  description: 'Manage all database-related content on the website.',
};

export default async function DatabasePage() {
  return <DatabaseContent />;
}
