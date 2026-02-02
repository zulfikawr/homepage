'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import CertificateCard from '@/components/UI/Card/variants/Certificate';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import { useCollection } from '@/hooks';
import { mapRecordToCertificate } from '@/lib/mappers';
import { Certificate } from '@/types/certificate';

export default function CertificatesContent() {
  const {
    data: certificates,
    loading,
    error,
  } = useCollection<Certificate>('certificates', mapRecordToCertificate);

  if (error) return <CardEmpty message='Failed to load certificates' />;

  return (
    <div>
      <PageTitle
        emoji='🎓'
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
        ) : certificates.length > 0 ? (
          <StaggerContainer>
            {certificates.map((certificate) => (
              <ViewTransition key={certificate.id}>
                <CertificateCard certificate={certificate} />
              </ViewTransition>
            ))}
          </StaggerContainer>
        ) : (
          <CardEmpty message='No certificates available' />
        )}
      </div>
    </div>
  );
}
