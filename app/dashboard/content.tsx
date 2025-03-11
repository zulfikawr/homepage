'use client';

import GithubFollowerMetric from '@/components/Card/Metrics/GithubFollowers';
import GithubStarMetric from '@/components/Card/Metrics/GithubStars';
import PageViewsMetric from '@/components/Card/Metrics/PageViews';
import PostsMetric from '@/components/Card/Metrics/Posts';
import PageTitle from '@/components/PageTitle';

export default function DashboardContent() {
  return (
    <div>
      <PageTitle
        emoji='📊'
        title='Dashboard'
        subtitle='Personal dashboard tracking various metrics of this website.'
        route='/dashboard'
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
