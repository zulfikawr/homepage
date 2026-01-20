import { Metadata } from 'next';
import CertificatesContent from './content';
import { getCertificates } from '@/database/certificates';

export const metadata: Metadata = {
  title: 'Certificates - Zulfikar',
  description: 'My certifications and achievements',
};

export default async function CertificatesPage() {
  const certs = await getCertificates();
  return <CertificatesContent initialData={certs} />;
}
