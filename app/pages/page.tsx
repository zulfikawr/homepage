import { Metadata } from 'next';

import PagesContent from './content';

export const metadata: Metadata = {
  title: 'Pages - Zulfikar',
};

export default function DashboardPage() {
  return <PagesContent />;
}
