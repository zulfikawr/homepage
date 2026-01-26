import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/Form/Loading';

import NewCertificateContent from './content';

export const metadata: Metadata = {
  title: 'Add Certificate - Zulfikar',
  description: 'Add a new license or certification',
};

export default function NewCertificatePage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <NewCertificateContent />
    </Suspense>
  );
}
