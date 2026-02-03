import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FormSkeleton } from '@/components/form/loading';
import { getCertificateById } from '@/database/certificates';

import EditCertificatePage from './content';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function CertificateLoader({ params }: Props) {
  const { slug } = await params;
  const cert = await getCertificateById(slug);

  if (!cert) return notFound();

  return <EditCertificatePage certificate={cert} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cert = await getCertificateById(slug);

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
