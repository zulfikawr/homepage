'use client';

import { useRouter } from 'next/navigation';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Button, Card } from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import { CardLoading } from '@/components/ui/card/variants/loading';
import PublicationCard from '@/components/ui/card/variants/publication';
import { useCollection } from '@/hooks';
import { mapRecordToPublication } from '@/lib/mappers';
import { Publication } from '@/types/publication';

export default function PublicationsDatabase() {
  const router = useRouter();

  const {
    data: publications,
    loading,
    error,
  } = useCollection<Publication>('publications', mapRecordToPublication);

  if (error) return <CardEmpty message='Failed to load publications' />;

  const handleAddPublication = () => {
    router.push('/database/publications/new');
  };

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
        ) : (
          <>
            <ViewTransition>
              <Card isPreview>
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handleAddPublication}
                  className='my-8 mx-auto'
                >
                  {publications && publications.length > 0
                    ? 'Add more'
                    : 'Add publication'}
                </Button>
              </Card>
            </ViewTransition>

            {Array.isArray(publications) && publications.length > 0 ? (
              <StaggerContainer>
                {publications.map((publication) => (
                  <ViewTransition key={publication.id}>
                    <PublicationCard publication={publication} openForm />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            ) : (
              <CardEmpty message='No publications available' />
            )}
          </>
        )}
      </div>
    </div>
  );
}
