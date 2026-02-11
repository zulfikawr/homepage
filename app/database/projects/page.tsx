import { Metadata } from 'next';

import ProjectsContent from './content';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A collection of my projects',
};

export default async function ProjectPage() {
  return <ProjectsContent />;
}
