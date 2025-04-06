'use client';

import React from 'react';
import CertificateCard from '@/components/Card/Certificate';
import { certificatesData } from '@/functions/certificates';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';

export default function CertsContent() {
  const {
    data: certificates,
    loading,
    error,
  } = useRealtimeData(certificatesData);

  if (error) return <div>Failed to load certificates</div>;

  return (
    <div>
      <PageTitle
        emoji='🎓'
        title='Certificates'
        subtitle='My licenses and certifications'
        route='/certs'
      />

      <div className='grid grid-cols-1 gap-4'>
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => <CardLoading key={index} type='certificate' />)
          : certificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
      </div>
    </div>
  );
}
