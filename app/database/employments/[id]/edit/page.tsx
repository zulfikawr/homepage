import { getEmploymentById, getEmployments } from '@/functions/employments';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditEmploymentPage from './content';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function EmploymentLoader({ params }: Props) {
  const { id } = await params;
  const employment = await getEmploymentById(id);

  if (!employment) return notFound();

  return <EditEmploymentPage employment={employment} />;
}

export async function generateStaticParams() {
  try {
    const employments = await getEmployments();
    return employments.map((employment) => ({
      id: employment.id,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const employment = await getEmploymentById(id);

  return {
    title: employment ? `Edit ${employment.organization}` : 'Edit Employment',
  };
}

export default function EmploymentEditPage({ params }: Props) {
  return <EmploymentLoader params={params} />;
}
