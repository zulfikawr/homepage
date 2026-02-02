import { Metadata } from 'next';

import PagesContent from './content';

export const metadata: Metadata = {
  title: 'Pages - Zulfikar',
};

export default async function DashboardPage() {
  return <PagesContent />;
}
