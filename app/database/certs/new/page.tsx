import { Metadata } from 'next';
import NewCertificateContent from './content';
import { Suspense } from 'react';
import { FormSkeleton } from '@/components/Form/Loading';

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
