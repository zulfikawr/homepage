'use client';

import React, { useState } from 'react';
import { Button } from '@/components/UI';
import { PodcastCard } from '@/components/Card/Podcast';
import { useAuth } from '@/contexts/authContext';
import { drawer } from '@/components/Drawer';
import PodcastForm from '@/components/Form/Podcast';
import { getPodcasts } from '@/functions/podcasts';
import { useFetchData } from '@/lib/fetchData';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';

export default function PodcastContent() {
  const { user } = useAuth();
  const [isAdding] = useState(false);

  const { data: podcasts, loading, error } = useFetchData(getPodcasts);

  const handleAddPodcastClick = () => {
    drawer.open(<PodcastForm />);
  };

  if (error) return <div>Failed to load podcast</div>;

  return (
    <div>
      <PageTitle
        emoji='🎙️'
        title='Podcasts'
        subtitle='I have listened to a wide variety of audio podcasts over the years. Here are some of the ones that I really enjoyed.'
      />

      {user && (
        <div className='mb-6 flex justify-end'>
          <Button
            type='primary'
            onClick={handleAddPodcastClick}
            disabled={isAdding}
          >
            {isAdding ? 'Adding...' : 'Add Podcast'}
          </Button>
        </div>
      )}

      <section className='mb-10 mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3'>
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => <CardLoading key={index} type='podcast' />)
          : podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} {...podcast} />
            ))}
      </section>
    </div>
  );
}
