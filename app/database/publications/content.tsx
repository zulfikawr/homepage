'use client';

import { useRouter } from 'next/navigation';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/UI';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import PublicationCard from '@/components/UI/Card/variants/Publication';
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
              <div className='w-full rounded-md border bg-white text-center shadow-sm  dark:bg-card p-5'>
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handleAddPublication}
                  className='mx-auto'
                >
                  {publications && publications.length > 0
                    ? 'Add more'
                    : 'Add publication'}
                </Button>
              </div>
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
