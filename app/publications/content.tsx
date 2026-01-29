'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import PublicationCard from '@/components/UI/Card/variants/Publication';
import { useCollection } from '@/hooks';
import { mapRecordToPublication } from '@/lib/mappers';
import { Publication } from '@/types/publication';

interface PublicationsContentProps {
  initialData?: Publication[];
}

export default function PublicationsContent({
  initialData,
}: PublicationsContentProps) {
  const {
    data: publications,
    loading,
    error,
  } = useCollection<Publication>(
    'publications',
    mapRecordToPublication,
    {},
    initialData,
  );

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
            .map((_, index) => (
              <CardLoading key={index} variant='publication' />
            ))
        ) : publications.length > 0 ? (
          <StaggerContainer>
            {publications.map((publication) => (
              <ViewTransition key={publication.id}>
                <PublicationCard publication={publication} />
              </ViewTransition>
            ))}
          </StaggerContainer>
        ) : (
          <CardEmpty message='No publications available' />
        )}
      </div>
    </div>
  );
}
