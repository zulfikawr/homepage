'use client';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import CertificateCard from '@/components/ui/card/variants/certificate';
import CardEmpty from '@/components/ui/card/variants/empty';
import { CERTIFICATE_TEMPLATE } from '@/components/ui/card/variants/loading';
import { Shimmer } from '@/components/ui/shimmer';
import { Certificate } from '@/types/certificate';

const CERTIFICATE_TEMPLATES: Certificate[] = Array.from(
  { length: 4 },
  (_, index) => ({
    ...CERTIFICATE_TEMPLATE,
    id: `loading-certificate-${index}`,
    slug: `loading-certificate-${index}`,
  }),
);

export function CertificatesSkeleton() {
  return (
    <Shimmer loading>
      <CertificatesContent certificates={CERTIFICATE_TEMPLATES} />
    </Shimmer>
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
            {certificates.map((certificate, index) => (
              <ViewTransition key={certificate.id}>
                <CertificateCard
                  certificate={certificate}
                  priority={index === 0}
                />
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
