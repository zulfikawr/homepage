'use client';

import PublicationCard from '@/components/Card/Publication';
import { mapRecordToPublication } from '@/lib/mappers';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useCollection } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';
import { Publication } from '@/types/publication';
import { useLoadingToggle } from '@/contexts/loadingContext';

export default function PublicationsDatabase() {
  const router = useRouter();

  const {
    data: publications,
    loading: dataLoading,
    error,
  } = useCollection<Publication>('publications', mapRecordToPublication);

  const { forceLoading } = useLoadingToggle();
  const loading = dataLoading || forceLoading;

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
            .map((_, index) => <CardLoading key={index} type='publication' />)
        ) : (
          <>
            <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-border dark:bg-card p-5'>
              <Button
                type='primary'
                icon='plus'
                onClick={handleAddPublication}
                className='mx-auto'
              >
                {publications && publications.length > 0
                  ? 'Add more'
                  : 'Add publication'}
              </Button>
            </div>

            {Array.isArray(publications) && publications.length > 0 ? (
              publications.map((publication) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  openForm
                />
              ))
            ) : (
              <CardEmpty message='No publications available' />
            )}
          </>
        )}
      </div>
    </div>
  );
}
