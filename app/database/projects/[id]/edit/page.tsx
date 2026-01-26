import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FormSkeleton } from '@/components/Form/Loading';
import { getProjectById } from '@/database/projects';

import EditProjectPage from './content';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function ProjectLoader({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) return notFound();

  return <EditProjectPage project={project} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

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
