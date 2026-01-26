'use client';

import { useRouter } from 'next/navigation';

import CertificateCard from '@/components/Card/Certificate';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/UI';
import { useCollection } from '@/hooks';
import { mapRecordToCertificate } from '@/lib/mappers';
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
            <ViewTransition>
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
            </ViewTransition>

            {Array.isArray(certificates) && certificates.length > 0 ? (
              <StaggerContainer>
                {certificates.map((certificate) => (
                  <ViewTransition key={certificate.id}>
                    <CertificateCard certificate={certificate} openForm />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            ) : (
              <CardEmpty message='No certificates available' />
            )}
          </>
        )}
      </div>
    </div>
  );
}
