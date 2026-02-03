'use client';

import { useEffect } from 'react';

import PublicationForm from '@/components/form/publication';
import PageTitle from '@/components/page-title';
import { useTitle } from '@/contexts/title-context';
import { Publication } from '@/types/publication';

interface EditPublicationPageProps {
  publication: Publication;
}

export default function EditPublicationPage({
  publication,
}: EditPublicationPageProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle(`Edit: ${publication.title}`);
    return () => setHeaderTitle('Publication');
  }, [publication.title, setHeaderTitle]);

  return (
    <div>
      <PageTitle
        emoji='📚'
        title='Edit Publication'
        subtitle={publication.title}
      />
      <PublicationForm publicationToEdit={publication} />
    </div>
  );
}
