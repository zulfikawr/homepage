'use client';

import CertificateCard from '@/components/Card/Certificate';
import { certificatesData } from '@/database/certificates';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';

export default function CertsContent() {
  const {
    data: certificates,
    loading,
    error,
  } = useRealtimeData(certificatesData);

  if (error) return <CardEmpty message='Failed to load certificates' />;

  return (
    <div>
      <PageTitle
        emoji='🎓'
        title='Certificates'
        subtitle='My licenses and certifications'
        route='/certs'
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
