'use client';

import PublicationCard from '@/components/Card/Publication';
import { mapRecordToPublication } from '@/lib/mappers';
import PageTitle from '@/components/PageTitle';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import { useCollection } from '@/hooks';
import { Publication } from '@/types/publication';
import { useLoadingToggle } from '@/contexts/loadingContext';

export default function PublicationsContent() {
  const {
    data: publications,
    loading: dataLoading,
    error,
  } = useCollection<Publication>('publications', mapRecordToPublication);

  const { forceLoading } = useLoadingToggle();
  const loading = dataLoading || forceLoading;

  if (error) return <CardEmpty message='Failed to load publications' />;

  return (
    <div>
      <PageTitle
        emoji='📚'
        title='Publications'
        subtitle='My academic and professional publications'
      />

      <div className='grid grid-cols-1 gap-4'>
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='publication' />)
        ) : publications.length > 0 ? (
          publications.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))
        ) : (
          <CardEmpty message='No publications available' />
        )}
      </div>
    </div>
  );
}
