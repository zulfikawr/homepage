import { Metadata } from 'next';

import { getSections } from '@/database/sections';

import Home from './home';

export const metadata: Metadata = {
  title: 'Home - Zulfikar',
  description: 'Personal website and portfolio of Zulfikar',
};

export default async function HomePage() {
  const sections = await getSections();
  return <Home initialData={sections} />;
}
