'use client';

import { useRouter } from 'next/navigation';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Button, Card } from '@/components/UI';
import CertificateCard from '@/components/UI/Card/variants/Certificate';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
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
            .map((_, index) => (
              <CardLoading key={index} variant='certificate' />
            ))
        ) : (
          <>
            <ViewTransition>
              <Card isPreview>
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handleAddCertificate}
                  className='my-8 mx-auto'
                >
                  {certificates && certificates.length > 0
                    ? 'Add more'
                    : 'Add certificate'}
                </Button>
              </Card>
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
