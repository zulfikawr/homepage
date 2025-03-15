'use client';

import React from 'react';
import CertificateCard from '@/components/Card/Certificate';
import { useAuth } from '@/contexts/authContext';
import { drawer } from '@/components/Drawer';
import { Button } from '@/components/UI';
import { getCertificates } from '@/functions/certificates';
import { useFetchData } from '@/lib/fetchData';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import CertificateDrawer from '@/components/Drawer/Certificate';

export default function CertsContent() {
  const { user } = useAuth();
  const {
    data: certificates,
    loading,
    error,
    refetch,
  } = useFetchData(getCertificates);

  const handleOpenCertificateDrawer = () => {
    drawer.open(
      <CertificateDrawer certificates={certificates} onUpdate={refetch} />,
    );
  };

  if (error) return <div>Failed to load certificates</div>;

  return (
    <div>
      <PageTitle
        emoji='🎓'
        title='Certificates'
        subtitle='My licenses and certifications'
        route='/certs'
      />

      {user && (
        <div className='mb-6 flex justify-end'>
          <Button type='primary' onClick={handleOpenCertificateDrawer}>
            Manage
          </Button>
        </div>
      )}

      <div className='grid grid-cols-1 gap-4'>
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => <CardLoading key={index} type='certificate' />)
          : certificates.map((cert) => (
              <CertificateCard key={cert.id} {...cert} />
            ))}
      </div>
    </div>
  );
}
