import MetricCard from './Card';
import { commaNumber } from '@/utilities/commaNumber';
import { useFetchData } from '@/hooks/useFetchData';

interface GithubUser {
  followers: number;
}

export default function GithubFollowerMetric() {
  const link = 'https://github.com/zulfikawr';
  const api = 'https://api.github.com/users/zulfikawr';

  const fetchFollowers = async () => {
    const response = await fetch(api);
    const data: GithubUser = await response.json();
    return data.followers;
  };

  const { data: followers } = useFetchData(fetchFollowers);

  return (
    <MetricCard
      icon='github'
      value={commaNumber(followers)}
      description='Github Followers'
      link={link}
      colorHex='#9CA3AF'
    />
  );
}
