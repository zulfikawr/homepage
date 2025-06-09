'use client';

import React from 'react';
import PublicationCard from '@/components/Card/Publication';
import { publicationsData } from '@/functions/publications';
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

  if (error) return <div>Failed to load publications</div>;

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
        ) : Array.isArray(publications) && publications.length > 0 ? (
          <>
            <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800 p-5'>
              <Button
                type='primary'
                icon='plus'
                onClick={handleAddPublication}
                className='mx-auto'
              >
                Add more
              </Button>
            </div>

            {publications.map((publication) => (
              <PublicationCard
                key={publication.id}
                publication={publication}
                openForm
              />
            ))}
          </>
        ) : (
          <CardEmpty message='No publications available' />
        )}
      </div>
    </div>
  );
}
