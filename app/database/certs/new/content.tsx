'use client';

import CertificateForm from '@/components/Form/Certificate';
import PageTitle from '@/components/PageTitle';

export default function NewCertificateContent() {
  return (
    <div>
      <PageTitle
        emoji='📜'
        title='Add Certificate'
        subtitle='Fill out the form below to add a new certificate'
      />

      <CertificateForm />
    </div>
  );
}
