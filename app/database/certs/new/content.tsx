'use client';

import React from 'react';
import PageTitle from '@/components/PageTitle';
import CertificateForm from '@/components/Form/Certificate';

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
