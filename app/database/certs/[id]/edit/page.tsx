import { getCertificateById, getCertificates } from '@/functions/certificates';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
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

export async function generateStaticParams() {
  try {
    const certs = await getCertificates();
    return certs.map((cert) => ({
      id: cert.id,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cert = await getCertificateById(id);

  return {
    title: cert ? `Edit ${cert.title}` : 'Edit Certificate',
  };
}

export default function CertificateEditPage({ params }: Props) {
  return <CertificateLoader params={params} />;
}
