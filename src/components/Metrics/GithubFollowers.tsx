import MetricCard from './Card';
import format from 'comma-number';
import useSWR from 'swr';
import fetcher from '~/lib/fetcher';

export default function GithubFollowerMetric() {
  const { data } = useSWR('api/github', fetcher);

  const followers = format(data?.followers);
  const link = 'https://github.com/zulfikawr';

  return (
    <MetricCard
      icon='github'
      value={followers}
      description='Github Followers'
      link={link}
      colorHex='#9CA3AF'
    />
  );
}
