import { Suspense } from 'react';
import { Metadata } from 'next';

import { getProjects } from '@/lib/data';

import ProjectsContent, { ProjectsSkeleton } from './content';

export const metadata: Metadata = {
  title: 'Projects - Zulfikar',
  description: 'A collection of my projects, categorized by their status',
};

async function ProjectsList() {
  const projects = await getProjects();
  return <ProjectsContent projects={projects} />;
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsList />
    </Suspense>
  );
}
