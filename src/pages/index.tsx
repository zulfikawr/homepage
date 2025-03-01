import Head from 'next/head';
import React, { useEffect } from 'react';
import PagesAndLinks from '~/components/Banners/PagesAndLinks';
import EmploymentSection from '~/components/Section/Employment';
import ProjectSection from '~/components/Section/Project';
import InterestsAndObjectivesSection from '~/components/Section/InterestsAndObjectives';
import PersonalInfoSection from '~/components/Section/PersonalInfo';
import PostSection from '~/components/Section/Post';
import { pageLayout } from '~/components/Page';
import { NextPageWithLayout } from '~/pages/_app';
import { incrementPageViews } from '~/functions/analytics';

const Home: NextPageWithLayout = () => {
  useEffect(() => {
    incrementPageViews('/');
  }, []);

  return (
    <>
      <Head>
        <title>Home - Zulfikar</title>
      </Head>

      <section className='mt-0 pt-24 lg:pt-12 space-y-14'>
        <div className='space-y-6'>
          <PersonalInfoSection />
          <PagesAndLinks />
        </div>

        <InterestsAndObjectivesSection />

        <ProjectSection />

        <EmploymentSection />

        <PostSection />
      </section>
    </>
  );
};

Home.layout = pageLayout;

export default Home;
