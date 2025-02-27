import { Button, Icon } from '~/components/UI';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';
import useSWR from 'swr';
import { PodcastCard } from '~/components/Card/Podcast';
import { pageLayout } from '~/components/Page';
import fetcher from '~/lib/fetcher';
import { NextPageWithLayout } from '~/pages/_app';
import { Podcast } from '~/types/podcast';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import PodcastForm from '~/components/Form/Podcast';

const Podcasts: NextPageWithLayout = () => {
  const { user } = useAuth();
  const { data, error } = useSWR('/api/podcast', fetcher);
  const [isAdding, _setIsAdding] = useState(false);

  const handleAddPodcastClick = () => {
    drawer.open(<PodcastForm />);
  };

  if (error) return <div>Failed to load podcast</div>;
  if (!data) return <div>Loading...</div>;

  const { podcasts }: { podcasts: Podcast[] } = data;

  return (
    <div>
      <Head>
        <title>Podcasts - Zulfikar</title>
        <meta
          name='description'
          content="Podcasts that Zulfikar's Listening to"
        />
      </Head>
      <section className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex flex-1 items-center'>
            <div className='mr-4.5 mt-1 flex -rotate-6 cursor-pointer items-center'>
              <span className='text-[35px] drop-shadow-lg hover:animate-spin'>
                🎙️
              </span>
            </div>
            <div>
              <h2 className='flex items-center gap-x-1.5 text-[28px] font-medium tracking-wide text-black dark:text-white'>
                Podcasts
              </h2>
              <p className='-mt-1 text-sm text-neutral-500 dark:text-gray-400'>
                I have listened to a wide variety of audio podcasts over the
                years. Here are some of the ones that I really enjoyed.
              </p>
            </div>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 pl-5 pr-3'>
              <p className='text-xl text-gray-500 dark:text-gray-400'>
                <Link href='/' className='flex items-center'>
                  <span className='mr-2 h-6 w-6'>
                    <Icon name='left' />
                  </span>
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className='my-5'>
        <hr className='dark:border-gray-600' />
      </div>
      {user && (
        <div className='mb-6 flex justify-end'>
          <Button
            type='primary'
            onClick={handleAddPodcastClick}
            disabled={isAdding}
          >
            {isAdding ? 'Adding...' : 'Add Book'}
          </Button>
        </div>
      )}
      <section className='mb-10 mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3'>
        {podcasts.map((podcast: Podcast) => (
          <PodcastCard
            id={podcast.id}
            title={podcast.title}
            description={podcast.description}
            imageURL={podcast.imageURL}
            link={podcast.link}
          />
        ))}
      </section>
    </div>
  );
};

Podcasts.layout = pageLayout;

export default Podcasts;
