'use client';

import CertificateCard from '@/components/Card/Certificate';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
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
            .map((_, index) => <CardLoading key={index} type='certificate' />)
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
