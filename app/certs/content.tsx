'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import CertificateCard from '@/components/UI/Card/variants/Certificate';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import { Certificate } from '@/types/certificate';

export function CertificatesSkeleton() {
  return (
    <div>
      <PageTitle
        emoji='🎓'
        title='Certificates'
        subtitle='My licenses and certifications'
      />
      <div className='grid grid-cols-1 gap-4'>
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <CardLoading key={index} variant='certificate' />
          ))}
      </div>
    </div>
  );
}

export default function CertificatesContent({
  certificates,
}: {
  certificates: Certificate[];
}) {
  return (
    <div>
      <PageTitle
        emoji='🎓'
        title='Certificates'
        subtitle='My licenses and certifications'
      />

      <div className='grid grid-cols-1 gap-4'>
        {certificates.length > 0 ? (
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
