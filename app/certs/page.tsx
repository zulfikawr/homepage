import { Suspense } from 'react';
import { Metadata } from 'next';

import { getCertificates } from '@/lib/data';

import CertificatesContent, { CertificatesSkeleton } from './content';

export const metadata: Metadata = {
  title: 'Certificates',
  description: 'My certifications and achievements',
};

async function CertificatesList() {
  const certificates = await getCertificates();
  return <CertificatesContent certificates={certificates} />;
}

export default function CertificatesPage() {
  return (
    <Suspense fallback={<CertificatesSkeleton />}>
      <CertificatesList />
    </Suspense>
  );
}
