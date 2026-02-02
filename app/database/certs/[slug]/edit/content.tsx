'use client';

import { useEffect } from 'react';

import CertificateForm from '@/components/Form/Certificate';
import PageTitle from '@/components/PageTitle';
import { useTitle } from '@/contexts/titleContext';
import { Certificate } from '@/types/certificate';

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
