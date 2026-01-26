export interface GitHubContributionDay {
  date: string;
  count: number;
  intensity?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface GitHubContributionData {
  totalContributions: number;
  dailyContributions: GitHubContributionDay[];
  weeks: GitHubContributionDay[][];
  year: number;
}
