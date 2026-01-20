import { Metadata } from 'next';
import NewCertificateContent from './content';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Add Certificate - Zulfikar',
  description: 'Add a new license or certification',
};

export default function NewCertificatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewCertificateContent />
    </Suspense>
  );
}
