import { Metadata } from 'next';

import { getPersonalInfo } from '@/database/personalInfo';
import { getSections } from '@/database/sections';

import Home from './home';

export const metadata: Metadata = {
  title: 'Home - Zulfikar',
  description: 'Personal website and portfolio of Zulfikar',
};

export default async function HomePage() {
  const [sections, personalInfo] = await Promise.all([
    getSections(),
    getPersonalInfo(),
  ]);
  return <Home initialData={sections} initialPersonalInfo={personalInfo} />;
}
