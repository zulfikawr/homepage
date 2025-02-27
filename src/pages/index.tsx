import { Icon } from '~/components/UI';
import Head from 'next/head';
import React, { useState } from 'react';
import PagesAndLinks from '~/components/Banners/PagesAndLinks';
import List from '~/components/List';
import { pageLayout } from '~/components/Page';
import { NextPageWithLayout } from '~/pages/_app';
import EmploymentSection from '~/components/Section/Employment';
import ProjectSection from '~/components/Section/Project';
import InterestsAndObjectivesSection from '~/components/Section/InterestsAndObjectives';
import PersonalInfoSection from '~/components/Section/PersonalInfo';

const Home: NextPageWithLayout = () => {
  const [showPosts, setShowPosts] = useState(true);

  return (
    <>
      <Head>
        <title>Home - Zulfikar</title>
      </Head>

      <section className='mt-0 pt-24 lg:pt-12'>
        <PersonalInfoSection />
      </section>

      <section className='mt-6'>
        <PagesAndLinks />
      </section>

      <InterestsAndObjectivesSection />

      <ProjectSection />

      <EmploymentSection />

      <section className='mb-24 mt-14'>
        <label className='inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-[4px] font-medium tracking-wider shadow-sm dark:border-gray-600 dark:bg-gray-700'>
          <span className='mr-1.5 flex h-5 w-5'>
            <Icon name='edit' />
          </span>
          <span className='uppercase'>Blog Posts</span>
        </label>
        <div className='mt-5 animate-appear'>
          <List type='index' />
        </div>
      </section>
    </>
  );
};

Home.layout = pageLayout;

export default Home;
