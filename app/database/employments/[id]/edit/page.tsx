import { getEmploymentById } from '@/database/employments';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditEmploymentPage from './content';
import { Suspense } from 'react';
import { FormSkeleton } from '@/components/Form/Loading';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const employment = await getEmploymentById(id);

  return {
    title: employment ? `Edit ${employment.organization}` : 'Edit Employment',
  };
}

export default function EmploymentEditPage({ params }: Props) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <EmploymentLoader params={params} />
    </Suspense>
  );
}
