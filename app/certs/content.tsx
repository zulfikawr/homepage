'use client';

import CertificateCard from '@/components/Card/Certificate';
import { mapRecordToCertificate } from '@/lib/mappers';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import CardEmpty from '@/components/Card/Empty';
import { useCollection } from '@/hooks';
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
          certificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))
        ) : (
          <CardEmpty message='No certificates available' />
        )}
      </div>
    </div>
  );
}
