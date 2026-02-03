export interface GitHubContributionDay {
  date: string;
  count: number;
  intensity?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface GitHubContributionData {
  total_contributions: number;
  repository_count: number;
  daily_contributions: GitHubContributionDay[];
  weeks: GitHubContributionDay[][];
  year: number;
}
