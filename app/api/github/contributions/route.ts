import { apiError, apiSuccess, handleApiError } from '@/lib/api';

const GITHUB_USERNAME = 'zulfikawr';

interface GitHubGraphQLDay {
  date: string;
  contributionCount: number;
}

interface GitHubGraphQLWeek {
  contributionDays: GitHubGraphQLDay[];
}

interface GitHubGraphQLData {
  totalContributions: number;
  weeks: GitHubGraphQLWeek[];
}

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: GitHubGraphQLData;
        commitContributionsByRepository?: Array<{
          repository: {
            nameWithOwner: string;
          };
        }>;
      };
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      return apiError('GITHUB_TOKEN not found in environment variables', 500);
    }

    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
            commitContributionsByRepository(maxRepositories: 100) {
              repository {
                nameWithOwner
              }
            }
          }
        }
      }
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME },
      }),
      signal: controller.signal,
    }).catch((error) => {
      clearTimeout(timeoutId);
      throw error;
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return apiError(
        `GitHub API error: ${response.status}`,
        response.status,
        errorText,
      );
    }

    const result = (await response.json()) as GitHubGraphQLResponse;

    if (result.errors) {
      return apiError(
        'GitHub GraphQL errors',
        400,
        JSON.stringify(result.errors),
      );
    }

    const data =
      result.data?.user?.contributionsCollection?.contributionCalendar;
    const contributedRepos =
      result.data?.user?.contributionsCollection
        ?.commitContributionsByRepository || [];

    if (!data) {
      return apiError('No contribution data found', 404);
    }

    const contributionData = processContributionCalendar(
      data,
      contributedRepos.length,
    );

    return apiSuccess(contributionData);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return apiError(
          'Request timeout - GitHub API took too long to respond',
          504,
        );
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return apiError('Network error - Unable to reach GitHub API', 503);
      }
    }

    return handleApiError(error);
  }
}

function processContributionCalendar(
  data: GitHubGraphQLData,
  repository_count: number,
) {
  const weeks = data.weeks || [];
  const total_contributions = data.totalContributions || 0;

  const daily_contributions: {
    date: string;
    count: number;
  }[] = [];

  weeks.forEach((week: GitHubGraphQLWeek) => {
    week.contributionDays.forEach((day: GitHubGraphQLDay) => {
      daily_contributions.push({
        date: day.date,
        count: day.contributionCount,
      });
    });
  });

  const firstDate = daily_contributions[0]?.date;
  const year = firstDate
    ? new Date(firstDate).getFullYear()
    : new Date().getFullYear();

  return {
    total_contributions: total_contributions,
    repository_count: repository_count,
    daily_contributions: daily_contributions,
    weeks: weeks.map((week: GitHubGraphQLWeek) =>
      week.contributionDays.map((day: GitHubGraphQLDay) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    ),
    year,
  };
}
