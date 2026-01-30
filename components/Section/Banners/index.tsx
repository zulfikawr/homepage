'use client';

import AIKnowledgeAssistantBanner from '@/components/Banners/AIKnowledgeAssistant';
import GitHubContributionsBanner from '@/components/Banners/GitHubContributions';
import PagesAndLinksBanner from '@/components/Banners/PagesAndLinks';
import SpotifyBanner from '@/components/Banners/Spotify';
// import TerminalBanner from '@/components/Banners/Terminal';
import TopLanguagesBanner from '@/components/Banners/TopLanguages';
import VisitorGeographyBanner from '@/components/Banners/VisitorGeography';
import WeatherBanner from '@/components/Banners/Weather';
import { StaggerContainer, ViewTransition } from '@/components/Motion';

const Banners = () => {
  return (
    <div className='space-y-6'>
      <StaggerContainer>
        <ViewTransition key='pages'>
          <PagesAndLinksBanner />
        </ViewTransition>
        <ViewTransition key='contributions'>
          <GitHubContributionsBanner />
        </ViewTransition>
        <ViewTransition key='geography'>
          <VisitorGeographyBanner />
        </ViewTransition>
        <ViewTransition key='languages'>
          <TopLanguagesBanner />
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
        {/* <ViewTransition key='terminal'>
          <TerminalBanner />
        </ViewTransition> */}
        <ViewTransition key='ai-assistant'>
          <AIKnowledgeAssistantBanner />
        </ViewTransition>
      </StaggerContainer>
    </div>
  );
};

export default Banners;
