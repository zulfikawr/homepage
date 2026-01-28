import { Metadata } from 'next';

import { getResume } from '@/database/resume';

import PagesContent from './content';

export const metadata: Metadata = {
  title: 'Pages - Zulfikar',
};

export default async function DashboardPage() {
  const resume = await getResume();
  return <PagesContent initialResume={resume} />;
}
