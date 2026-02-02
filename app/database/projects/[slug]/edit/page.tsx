import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FormSkeleton } from '@/components/Form/Loading';
import { getProjectById } from '@/database/projects';

import ProjectEditContent from './content';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function ProjectLoader({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectById(slug);

  if (!project) return notFound();

  return <ProjectEditContent project={project} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectById(slug);

  return {
    title: project ? `Edit ${project.name}` : 'Edit Project',
  };
}

export default function ProjectEditPage({ params }: Props) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ProjectLoader params={params} />
    </Suspense>
  );
}
