import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FormSkeleton } from '@/components/Form/Loading';
import { getCertificateById } from '@/database/certificates';

import EditCertificatePage from './content';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function CertificateLoader({ params }: Props) {
  const { id } = await params;
  const cert = await getCertificateById(id);

  if (!cert) return notFound();

  return <EditCertificatePage certificate={cert} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cert = await getCertificateById(id);

  return {
    title: cert ? `Edit ${cert.title}` : 'Edit Certificate',
  };
}

export default function CertificateEditPage({ params }: Props) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <CertificateLoader params={params} />
    </Suspense>
  );
}
