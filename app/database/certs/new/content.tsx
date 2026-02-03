'use client';

import CertificateForm from '@/components/form/certificate';
import PageTitle from '@/components/page-title';

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
