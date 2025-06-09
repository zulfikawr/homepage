import { getProjectById, getProjects } from '@/functions/projects';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
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

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({
      id: project.id,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  return {
    title: project ? `Edit ${project.name}` : 'Edit Project',
  };
}

export default function ProjectEditPage({ params }: Props) {
  return <ProjectLoader params={params} />;
}
