'use client';

import React, { useEffect } from 'react';
import PageCard from '@/components/Card/Page';
import { incrementPageViews } from '@/functions/analytics';
import PageTitle from '@/components/PageTitle';

export default function PagesContent() {
  useEffect(() => {
    incrementPageViews('/pages');
  }, []);

  return (
    <div>
      <PageTitle
        emoji='📑'
        title='Pages'
        subtitle='Explore all the pages on my site'
      />

      <div className='grid grid-cols-2 gap-4'>
        <PageCard
          title='Dashboard'
          des='Track my metrics'
          icon='presentationChart'
          className='text-blue-500'
          href='/dashboard'
        />
        <PageCard
          title='Reading List'
          des='My book shelf'
          icon='bookOpen'
          className='text-green-500'
          href='/reading-list'
        />
        <PageCard
          title='Projects'
          des='See all of my projects'
          icon='package'
          className='text-gray-400'
          href='/projects'
        />
        <PageCard
          title='Posts'
          des='See all of my posts'
          icon='note'
          className='text-gray-400'
          href='/post'
        />
        <PageCard
          title='Podcasts'
          des='My recommendations'
          icon='microphone'
          className='text-yellow-500'
          href='/podcasts'
        />
        <PageCard
          title='Feedback'
          des='Leave your feedback'
          icon='chatCenteredText'
          className='text-red-400'
          href='/feedback'
        />
        <PageCard
          title='UI'
          des='See all UI components'
          icon='layout'
          className='text-gray-400'
          href='/ui'
        />
        <PageCard
          title='Playlist'
          des='My music playlist'
          icon='musicNotes'
          className='text-gray-400'
          href='/playlist'
        />
      </div>
    </div>
  );
}
