import { useEffect, useState } from 'react';
import MetricCard from './Card';
import Fetcher from '~/lib/fetcher';
import { commaNumber } from '~/utilities/commaNumber';

export default function GithubStarMetric() {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    const fetchGithubStars = async () => {
      try {
        const data = await Fetcher('api/github');
        setStars(data.stars);
      } catch (error) {
        console.error('Error fetching github stars:', error);
        setStars(null);
      }
    };

    fetchGithubStars();
  }, []);

  const link = 'https://github.com/zulfikawr';

  return (
    <MetricCard
      icon='star'
      value={commaNumber(stars)}
      description='Github Stars'
      link={link}
      colorHex='#9CA3AF'
    />
  );
}
