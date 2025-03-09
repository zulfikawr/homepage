'use client';

import React, { useEffect } from 'react';
import GithubFollowerMetric from '@/components/Metrics/GithubFollowers';
import GithubStarMetric from '@/components/Metrics/GithubStars';
import PageViewsMetric from '@/components/Metrics/PageViews';
import PostsMetric from '@/components/Metrics/Posts';
import PageTitle from '@/components/PageTitle';
import { useTitle } from '@/contexts/titleContext';

export default function DashboardContent() {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle('Dashboard');
  });

  return (
    <div>
      <PageTitle
        emoji='📊'
        title='Dashboard'
        subtitle='Personal dashboard tracking various metrics of this website.'
      />
      <div className='glowing-area mb-10 mt-5 grid gap-4 lg:grid-cols-2'>
        <GithubStarMetric />
        <GithubFollowerMetric />
        <PostsMetric />
        <PageViewsMetric />
      </div>
    </div>
  );
}
