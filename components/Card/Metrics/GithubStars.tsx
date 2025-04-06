import MetricCard from './Card';
import { commaNumber } from '@/utilities/commaNumber';
import { useFetchData } from '@/hooks/useFetchData';

interface Repository {
  stargazers_count: number;
}

export default function GithubStarMetric() {
  const link = 'https://github.com/zulfikawr';
  const api = 'https://api.github.com/users/zulfikawr/repos';

  const fetchStars = async () => {
    const response = await fetch(api);
    const repos: Repository[] = await response.json();
    return repos.reduce(
      (acc: number, repo: Repository) => acc + repo.stargazers_count,
      0,
    );
  };

  const { data: stars } = useFetchData(fetchStars);

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
