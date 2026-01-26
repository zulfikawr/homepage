import { Metadata } from 'next';

import ReadingListDatabase from './content';

export const metadata: Metadata = {
  title: 'Reading List - Zulfikar',
  description: 'A collection of my books',
};

export default async function ReadingListPage() {
  return <ReadingListDatabase />;
}
