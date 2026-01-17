import { getPublicationById, getPublications } from '@/database/publications';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditPublicationPage from './content';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function PublicationLoader({ params }: Props) {
  const { id } = await params;
  const publication = await getPublicationById(id);

  if (!publication) return notFound();

  return <EditPublicationPage publication={publication} />;
}

export async function generateStaticParams() {
  try {
    const publications = await getPublications();
    return publications.map((publication) => ({
      id: publication.id,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const publication = await getPublicationById(id);

  return {
    title: publication ? `Edit ${publication.title}` : 'Edit Publication',
  };
}

export default function PublicationEditPage({ params }: Props) {
  return <PublicationLoader params={params} />;
}
