import { getCertificateById } from '@/database/certificates';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditCertificatePage from './content';
import { Suspense } from 'react';

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
    <Suspense fallback={<div>Loading...</div>}>
      <CertificateLoader params={params} />
    </Suspense>
  );
}
