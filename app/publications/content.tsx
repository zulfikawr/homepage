'use client';

import React from 'react';
import PublicationCard from '@/components/Card/Publication';
import { publicationsData } from '@/database/publications';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import CardEmpty from '@/components/Card/Empty';
import { useRealtimeData } from '@/hooks';

export default function PublicationsContent() {
  const {
    data: publications,
    loading,
    error,
  } = useRealtimeData(publicationsData);

  if (error) return <div>Failed to load publications</div>;

  return (
    <div>
      <PageTitle
        emoji='📚'
        title='Publications'
        subtitle='My academic and professional publications'
        route='/publications'
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
