'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import CurrentlyListening from '../../Banners/CurrentlyListening';
import GitHubHeatmap from '../../Banners/GitHubHeatmap';
import LocationAndTime from '../../Banners/LocationAndTime';
import PagesAndLinks from '../../Banners/PagesAndLinks';

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
            <ViewTransition key='listening'>
              <CurrentlyListening />
            </ViewTransition>
            <ViewTransition key='location'>
              <LocationAndTime />
            </ViewTransition>
          </StaggerContainer>
        </div>
      </StaggerContainer>
    </div>
  );
};

export default Banners;
