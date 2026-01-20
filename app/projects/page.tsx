import { Metadata } from 'next';
import ProjectsContent from './content';
import { getProjects } from '@/database/projects';

export const metadata: Metadata = {
  title: 'Projects - Zulfikar',
  description: 'A collection of my projects, categorized by their status',
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsContent initialData={projects} />;
}
