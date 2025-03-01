import { useEffect, useState } from 'react';
import MetricCard from './Card';
import Fetcher from '~/lib/fetcher';
import { commaNumber } from '~/utilities/commaNumber';

export default function GithubFollowerMetric() {
  const [followers, setFollowers] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Fetcher('api/github');
        setFollowers(data.followers);
      } catch (error) {
        console.error('Error fetching github followers:', error);
        setFollowers(null);
      }
    };

    fetchData();
  }, []);

  const link = 'https://github.com/zulfikawr';

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
