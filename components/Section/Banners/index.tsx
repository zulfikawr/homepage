'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';

import CurrentlyListening from '../../Banners/CurrentlyListening';
import GitHubHeatmap from '../../Banners/GitHubHeatmap';
import PagesAndLinks from '../../Banners/PagesAndLinks';
import Weather from '../../Banners/Weather';

const Banners = () => {
  return (
    <div className='space-y-6'>
      <StaggerContainer>
        <ViewTransition key='pages'>
          <PagesAndLinks />
        </ViewTransition>
        <ViewTransition key='heatmap'>
          <GitHubHeatmap />
        </ViewTransition>
        <div className='flex flex-col sm:grid sm:grid-cols-2 gap-6'>
          <StaggerContainer initialDelay={0.2}>
            <ViewTransition key='listening' className='h-full'>
              <CurrentlyListening className='h-full' />
            </ViewTransition>
            <ViewTransition key='location' className='h-full'>
              <Weather className='h-full' />
            </ViewTransition>
          </StaggerContainer>
        </div>
      </StaggerContainer>
    </div>
  );
};

export default Banners;
