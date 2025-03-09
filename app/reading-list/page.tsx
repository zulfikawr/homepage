import { Metadata } from 'next';
import ReadingListContent from './content';

export const metadata: Metadata = {
  title: 'Reading List - Zulfikar',
  description:
    "I'm reading or re-reading (on average) one book every month in 2024",
};

export default async function ReadingListPage() {
  return <ReadingListContent />;
}
