import { Icon } from '~/components/UI';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import PageCard from '~/components/Card/Page';
import { pageLayout } from '~/components/Page';
import { NextPageWithLayout } from '~/pages/_app';

const Pages: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Pages - Zulfikar</title>
        <meta name='description' content="Zulfikar's blog pages" />
      </Head>
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex-1 items-center'>
            <h1 className='text-1 font-medium tracking-wide text-black dark:text-white'>
              <span className='mr-3 inline-block'>📑</span>
              Pages
            </h1>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 px-5'>
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
      </div>
      <div className='glowing-area mt-5 grid grid-cols-2 gap-4'>
        <PageCard
          title='Dashboard'
          des='Track my metrics'
          icon='ppt'
          className='text-blue-500'
          href='/dashboard'
        />
        <PageCard
          title='Reading List'
          des='My book shelf'
          icon='bookmark'
          className='text-green-500'
          href='/reading-list'
        />
        <PageCard
          title='Podcasts'
          des='My recommendations'
          icon='mic'
          className='text-yellow-500'
          href='/podcasts'
        />
        <PageCard
          title='Guestbook'
          des='Leave your comments'
          icon='question'
          className='text-gray-400'
          href='/page/249'
        />
        <PageCard
          title='Links'
          des='Friends from the Internet'
          icon='people'
          className='text-gray-400'
          href='/friends'
        />
        <PageCard
          title='Analytics'
          des='Website statistics'
          icon='growth'
          className='text-gray-400'
          href='https://analytics.ouorz.com/share/E4O9QpCn/ouorz-next'
        />
        <PageCard
          title='Music Playlist'
          des='My music playlist'
          icon='microphone'
          className='text-gray-400'
          href='/playlist'
        />
      </div>
    </div>
  );
};

Pages.layout = pageLayout;

export default Pages;
