'use client';

import { Certificate } from '@/types/certificate';
import PageTitle from '@/components/PageTitle';
import CertificateForm from '@/components/Form/Certificate';
import { useTitle } from '@/contexts/titleContext';
import { useEffect } from 'react';

interface EditCertificatePageProps {
  certificate: Certificate;
}

export default function EditCertificatePage({
  certificate,
}: EditCertificatePageProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle(`Edit: ${certificate.title}`);
    return () => setHeaderTitle('Certificates');
  }, [certificate.title, setHeaderTitle]);

  return (
    <div>
      <PageTitle
        emoji='📜'
        title={`Edit Certificate`}
        subtitle={certificate.title}
      />

      <CertificateForm certificateToEdit={certificate} />
    </div>
  );
}
