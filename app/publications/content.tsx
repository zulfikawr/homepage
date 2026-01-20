'use client';

import PublicationCard from '@/components/Card/Publication';
import { mapRecordToPublication } from '@/lib/mappers';
import PageTitle from '@/components/PageTitle';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import { useCollection } from '@/hooks';
import { Publication } from '@/types/publication';

export default function PublicationsContent() {
  const {
    data: publications,
    loading,
    error,
  } = useCollection<Publication>('publications', mapRecordToPublication);

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
          Array(4)
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
