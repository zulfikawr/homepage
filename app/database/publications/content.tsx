'use client';

import PublicationCard from '@/components/Card/Publication';
import { publicationsData } from '@/database/publications';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';

export default function PublicationDatabase() {
  const router = useRouter();

  const {
    data: publications,
    loading,
    error,
  } = useRealtimeData(publicationsData);

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
          Array(4)
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
