import { Suspense } from 'react';
import type { Metadata } from 'next';

import GitHubContributionsBanner from '@/components/banners/github-contributions';
import SpotifyBanner from '@/components/banners/spotify';
import TopLanguagesBanner from '@/components/banners/top-languages';
import WeatherBanner from '@/components/banners/weather';
import PersonalInfoSection from '@/components/section/personal-info';
import {
  getGitHubContributionsServer,
  getGitHubLanguagesServer,
  getProfile,
} from '@/lib/data';

export const metadata: Metadata = {
  title: 'GitHub Profile Banners Export',
  robots: { index: false, follow: false },
};

async function PersonalInfoData() {
  const data = await getProfile();
  return <PersonalInfoSection data={data?.[0]} />;
}

async function GitHubContributionsData() {
  const data = await getGitHubContributionsServer();
  return <GitHubContributionsBanner data={data} />;
}

async function TopLanguagesData() {
  const data = await getGitHubLanguagesServer();
  return <TopLanguagesBanner data={data} showMoreButton={false} />;
}

export default function GitHubProfileExportPage() {
  return (
    <div
      id='github-profile-export'
      className='flex flex-col gap-6 p-6 max-w-3xl mx-auto w-full bg-background relative z-50'
    >
      {/* 
        This page is specifically for the automated Puppeteer/Playwright script 
        to screenshot and use on the GitHub profile README.
      */}

      <Suspense
        fallback={<div className='h-24 animate-pulse bg-muted rounded-xl' />}
      >
        <PersonalInfoData />
      </Suspense>

      <Suspense
        fallback={<GitHubContributionsBanner data={null} isLoading={true} />}
      >
        <GitHubContributionsData />
      </Suspense>

      <Suspense
        fallback={
          <TopLanguagesBanner
            data={null}
            isLoading={true}
            showMoreButton={false}
          />
        }
      >
        <TopLanguagesData />
      </Suspense>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        <div className='h-full'>
          <SpotifyBanner showMoreButton={false} />
        </div>
        <div className='h-full'>
          <WeatherBanner />
        </div>
      </div>
    </div>
  );
}
