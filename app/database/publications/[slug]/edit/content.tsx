'use client';

import { useEffect } from 'react';

import PublicationForm from '@/components/Form/Publication';
import PageTitle from '@/components/PageTitle';
import { useTitle } from '@/contexts/titleContext';
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
      <PublicationForm publication_to_edit={publication} />
    </div>
  );
}
