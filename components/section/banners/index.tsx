import { Suspense } from 'react';

import AIKnowledgeAssistantBanner from '@/components/banners/ai-knowledge-assistant';
import GitHubContributionsBanner from '@/components/banners/github-contributions';
import PagesAndLinksBanner from '@/components/banners/pages-and-links';
import SpotifyBanner from '@/components/banners/spotify';
import TopLanguagesBanner from '@/components/banners/top-languages';
import VisitorGeographyBanner from '@/components/banners/visitor-geography';
import WeatherBanner from '@/components/banners/weather';
import { StaggerContainer, ViewTransition } from '@/components/motion';
import {
  getAnalyticsEvents,
  getGitHubContributionsServer,
  getGitHubLanguagesServer,
  getResume,
} from '@/lib/data';

// Server-side data fetchers that return the component with data
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
  const events = await getAnalyticsEvents();
  return <VisitorGeographyBanner events={events} />;
}

const Banners = () => {
  return (
    <div className='space-y-6'>
      <StaggerContainer>
        <ViewTransition key='pages'>
          <Suspense
            fallback={<PagesAndLinksBanner resume={null} isLoading={true} />}
          >
            <PagesAndLinksData />
          </Suspense>
        </ViewTransition>

        <ViewTransition key='contributions'>
          <Suspense
            fallback={
              <GitHubContributionsBanner data={null} isLoading={true} />
            }
          >
            <GitHubContributionsData />
          </Suspense>
        </ViewTransition>

        <ViewTransition key='geography'>
          <Suspense
            fallback={<VisitorGeographyBanner events={[]} isLoading={true} />}
          >
            <VisitorGeographyData />
          </Suspense>
        </ViewTransition>

        <ViewTransition key='languages'>
          <Suspense
            fallback={<TopLanguagesBanner data={null} isLoading={true} />}
          >
            <TopLanguagesData />
          </Suspense>
        </ViewTransition>

        <div className='flex flex-col sm:grid sm:grid-cols-2 gap-6'>
          <StaggerContainer initialDelay={0.2}>
            <ViewTransition key='spotify' className='h-full'>
              <SpotifyBanner className='h-full' />
            </ViewTransition>
            <ViewTransition key='weather' className='h-full'>
              <WeatherBanner className='h-full' />
            </ViewTransition>
          </StaggerContainer>
        </div>

        <ViewTransition key='ai-assistant'>
          <AIKnowledgeAssistantBanner />
        </ViewTransition>
      </StaggerContainer>
    </div>
  );
};

export default Banners;
