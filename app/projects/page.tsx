import { Metadata } from 'next';
import ProjectsContent from './content';

export const metadata: Metadata = {
  title: 'Projects - Zulfikar',
  description: 'A collection of my projects, categorized by their status',
};

export default async function ProjectsPage() {
  return <ProjectsContent />;
}
