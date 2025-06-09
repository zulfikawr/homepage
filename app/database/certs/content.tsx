'use client';

import React from 'react';
import CertificateCard from '@/components/Card/Certificate';
import { certificatesData } from '@/functions/certificates';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';

export default function CertsContent() {
  const router = useRouter();

  const {
    data: certificates,
    loading,
    error,
  } = useRealtimeData(certificatesData);

  if (error) return <div>Failed to load certificates</div>;

  const handleAddCertificate = () => {
    router.push('/database/certs/new');
  };

  return (
    <div>
      <PageTitle
        emoji='📜'
        title='Certificates'
        subtitle='My licenses and certifications'
      />

      <div className='grid grid-cols-1 gap-4'>
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='certificate' />)
        ) : Array.isArray(certificates) && certificates.length > 0 ? (
          <>
            <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800 p-5'>
              <Button
                type='primary'
                icon='plus'
                onClick={handleAddCertificate}
                className='mx-auto'
              >
                Add more
              </Button>
            </div>

            {certificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                openForm
              />
            ))}
          </>
        ) : (
          <CardEmpty message='No certificates available' />
        )}
      </div>
    </div>
  );
}
