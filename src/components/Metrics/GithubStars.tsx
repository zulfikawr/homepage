import MetricCard from './Card';
import format from 'comma-number';
import useSWR from 'swr';
import fetcher from '~/lib/fetcher';

export default function GithubStarMetric() {
  const { data } = useSWR('api/github', fetcher);

  const stars = format(data?.stars);
  const link = 'https://github.com/zulfikawr';

  return (
    <MetricCard
      icon='star'
      value={stars}
      description='Github Stars'
      link={link}
      colorHex='#9CA3AF'
    />
  );
}
