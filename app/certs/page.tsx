import { Metadata } from 'next';

import { getCertificates } from '@/database/certificates';

import CertificatesContent from './content';

export const metadata: Metadata = {
  title: 'Certificates - Zulfikar',
  description: 'My certifications and achievements',
};

export default async function CertificatesPage() {
  const certificates = await getCertificates();
  return <CertificatesContent initialData={certificates} />;
}
