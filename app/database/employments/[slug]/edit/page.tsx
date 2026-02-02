import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FormSkeleton } from '@/components/Form/Loading';
import { getEmploymentById } from '@/database/employments';

import EditEmploymentPage from './content';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function EmploymentLoader({ params }: Props) {
  const { slug } = await params;
  const employment = await getEmploymentById(slug);

  if (!employment) return notFound();

  return <EditEmploymentPage employment={employment} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const employment = await getEmploymentById(slug);

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
