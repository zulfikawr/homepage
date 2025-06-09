'use client';

import { Publication } from '@/types/publication';
import PageTitle from '@/components/PageTitle';
import PublicationForm from '@/components/Form/Publication';
import { useTitle } from '@/contexts/titleContext';
import { useEffect } from 'react';

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
