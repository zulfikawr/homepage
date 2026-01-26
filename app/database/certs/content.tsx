'use client';

import CertificateCard from '@/components/Card/Certificate';
import { mapRecordToCertificate } from '@/lib/mappers';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useCollection } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';
import { Certificate } from '@/types/certificate';

export default function CertificatesDatabase() {
  const router = useRouter();

  const {
    data: certificates,
    loading,
    error,
  } = useCollection<Certificate>('certificates', mapRecordToCertificate);

  if (error) return <CardEmpty message='Failed to load certificates' />;

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
          Array(8)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='certificate' />)
        ) : (
          <>
            <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-border dark:bg-card p-5'>
              <Button
                type='primary'
                icon='plus'
                onClick={handleAddCertificate}
                className='mx-auto'
              >
                {certificates && certificates.length > 0
                  ? 'Add more'
                  : 'Add certificate'}
              </Button>
            </div>

            {Array.isArray(certificates) && certificates.length > 0 ? (
              certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  openForm
                />
              ))
            ) : (
              <CardEmpty message='No certificates available' />
            )}
          </>
        )}
      </div>
    </div>
  );
}
