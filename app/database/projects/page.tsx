import { Metadata } from 'next';
import ProjectDatabase from './content';

export const metadata: Metadata = {
  title: 'Projects - Zulfikar',
  description: 'A collection of my projects',
};

export default async function ProjectPage() {
  return <ProjectDatabase />;
}
