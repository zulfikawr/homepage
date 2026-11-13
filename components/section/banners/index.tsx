import { Suspense } from 'react';

import GitHubContributionsBanner from '@/components/banners/github-contributions';
import PagesAndLinksBanner from '@/components/banners/pages-and-links';
import SpotifyBanner from '@/components/banners/spotify';
import TopLanguagesBanner from '@/components/banners/top-languages';
import VisitorGeographyBanner from '@/components/banners/visitor-geography';
import WeatherBanner from '@/components/banners/weather';
import {
  getAnalyticsSummary,
  getGitHubContributionsServer,
  getGitHubLanguagesServer,
  getResume,
} from '@/lib/data';
import { DEFAULT_BANNER_SETTINGS } from '@/lib/banner-config';

import BannerGrid from './grid';

async function GitHubContributionsData() {
  const data = await getGitHubContributionsServer();
  return <GitHubContributionsBanner data={data} />;
}

async function TopLanguagesData() {
  const data = await getGitHubLanguagesServer();
  return <TopLanguagesBanner data={data} />;
}

async function PagesAndLinksData() {
  const resumeList = await getResume();
  return <PagesAndLinksBanner resume={resumeList?.[0] || null} />;
}

async function VisitorGeographyData() {
  const stats = await getAnalyticsSummary();
  return <VisitorGeographyBanner data={stats.countries} />;
}

export const getBannerNodes = (): Record<string, React.ReactNode> => ({
  'pages-and-links': (
    <Suspense fallback={<PagesAndLinksBanner resume={null} isLoading={true} />}>
      <PagesAndLinksData />
    </Suspense>
  ),
  'github-contributions': (
    <Suspense
      fallback={<GitHubContributionsBanner data={null} isLoading={true} />}
    >
      <GitHubContributionsData />
    </Suspense>
  ),
  'visitor-geography': (
    <Suspense fallback={<VisitorGeographyBanner data={[]} isLoading={true} />}>
      <VisitorGeographyData />
    </Suspense>
  ),
  'top-languages': (
    <Suspense fallback={<TopLanguagesBanner data={null} isLoading={true} />}>
      <TopLanguagesData />
    </Suspense>
  ),
  spotify: <SpotifyBanner />,
  weather: <WeatherBanner />,
});

const Banners = () => (
  <BannerGrid settings={DEFAULT_BANNER_SETTINGS} nodes={getBannerNodes()} />
);

export default Banners;
