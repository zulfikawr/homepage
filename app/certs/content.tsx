'use client';

import { certificatesData } from '@/database/certificates.client';
import PageTitle from '@/components/PageTitle';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import CertificateCard from '@/components/Card/Certificate';
import { useRealtimeData } from '@/hooks';
import { Certificate } from '@/types/certificate';

interface CertificatesContentProps {
  initialData?: Certificate[];
}

export default function CertificatesContent({
  initialData,
}: CertificatesContentProps) {
  const {
    data: certificates,
    loading,
    error,
  } = useRealtimeData(certificatesData, initialData);

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
          Array(4)
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
