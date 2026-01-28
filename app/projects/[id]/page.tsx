import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getProjectById } from '@/database/projects';

import ProjectContent from './content';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function ProjectLoader({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return notFound();
  }

  return <ProjectContent project={project} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return notFound();
  }

  return {
    title: `${project.name} - Zulfikar`,
    description: project.description,
  };
}

export default function ProjectPage({ params }: Props) {
  return (
    <Suspense fallback={<ProjectContent isLoading={true} />}>
      <ProjectLoader params={params} />
    </Suspense>
  );
}
