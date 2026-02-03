'use client';

import { useRouter } from 'next/navigation';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Button, Card } from '@/components/ui';
import CertificateCard from '@/components/ui/card/variants/certificate';
import CardEmpty from '@/components/ui/card/variants/empty';
import { CardLoading } from '@/components/ui/card/variants/loading';
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
