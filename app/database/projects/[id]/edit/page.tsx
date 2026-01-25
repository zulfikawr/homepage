import { getProjectById } from '@/database/projects';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditProjectPage from './content';
import { Suspense } from 'react';
import { FormSkeleton } from '@/components/Form/Loading';

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
