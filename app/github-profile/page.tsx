import { Suspense } from 'react';
import type { Metadata } from 'next';

import PagesAndLinksBanner from '@/components/banners/pages-and-links';
import TopLanguagesBanner from '@/components/banners/top-languages';
import SpotifyBanner from '@/components/banners/spotify';
import { getGitHubLanguagesServer, getResume } from '@/lib/data';

export const metadata: Metadata = {
  title: 'GitHub Profile Banners Export',
  robots: { index: false, follow: false },
};

async function TopLanguagesData() {
  const data = await getGitHubLanguagesServer();
  return <TopLanguagesBanner data={data} showMoreButton={false} />;
}

async function PagesAndLinksData() {
  const resumeList = await getResume();
  return <PagesAndLinksBanner resume={resumeList?.[0] || null} showMoreButton={false} />;
}

export default function GitHubProfileExportPage() {
  return (
    <div id="github-profile-export" className="flex flex-col gap-6 p-6 max-w-3xl mx-auto w-full bg-background relative z-50">
      {/* 
        This div is specifically for the automated Puppeteer/Playwright script 
        to screenshot and use on the GitHub profile README.
      */}
      <Suspense fallback={<PagesAndLinksBanner resume={null} isLoading={true} showMoreButton={false} />}>
        <PagesAndLinksData />
      </Suspense>

      <Suspense fallback={<TopLanguagesBanner data={null} isLoading={true} showMoreButton={false} />}>
        <TopLanguagesData />
      </Suspense>

      <div className="h-full">
        <SpotifyBanner showMoreButton={false} />
      </div>
    </div>
  );
}
