import { Metadata } from 'next';

import CategoryContent from './content';

type Props = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${category} - Zulfikar`,
    description: `Browse posts in the ${category} category`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  return <CategoryContent category={category} />;
}
