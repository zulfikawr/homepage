import { Metadata } from 'next';

import CategoriesContent from './content';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all post categories',
};

export default async function CategoriesPage() {
  return <CategoriesContent />;
}
