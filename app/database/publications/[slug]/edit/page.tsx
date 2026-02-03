import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FormSkeleton } from '@/components/form/loading';
import { getPublicationById } from '@/database/publications';

import EditPublicationPage from './content';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function PublicationLoader({ params }: Props) {
  const { slug } = await params;
  const publication = await getPublicationById(slug);

  if (!publication) return notFound();

  return <EditPublicationPage publication={publication} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const publication = await getPublicationById(slug);

  return {
    title: publication ? `Edit ${publication.title}` : 'Edit Publication',
  };
}

export default function PublicationEditPage({ params }: Props) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <PublicationLoader params={params} />
    </Suspense>
  );
}
