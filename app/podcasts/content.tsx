'use client';

import { PodcastCard } from '@/components/Card/Podcast';
import { getPodcasts } from '@/functions/podcasts';
import { useFetchData } from '@/lib/fetchData';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import CardEmpty from '@/components/Card/Empty';

export default function PodcastContent() {
  const { data: podcasts, loading, error } = useFetchData(getPodcasts);

  if (error) return <div>Failed to load podcast</div>;

  return (
    <div>
      <PageTitle
        emoji='🎙️'
        title='Podcasts'
        subtitle='I have listened to a wide variety of audio podcasts over the years. Here are some of the ones that I really enjoyed.'
        route='/podcasts'
      />

      <section className='mb-10 mt-4'>
        <div
          className={`grid ${
            !loading && (!podcasts || podcasts.length === 0)
              ? 'grid-cols-1'
              : 'grid-cols-2 lg:grid-cols-3'
          } gap-4`}
        >
          {loading
            ? Array(6)
                .fill(0)
                .map((_, index) => <CardLoading key={index} type='podcast' />)
            : podcasts && podcasts.length > 0
            ? podcasts.map((podcast) => (
                <PodcastCard key={podcast.id} {...podcast} />
              ))
            : <CardEmpty message='No podcasts available' />
          }
        </div>
      </section>
    </div>
  );
}