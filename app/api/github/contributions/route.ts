import { NextResponse } from 'next/server';

export const runtime = 'edge';

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
      return NextResponse.json(
        { error: 'GITHUB_TOKEN not found in environment variables' },
        { status: 500 },
      );
    }

    // GitHub GraphQL query to get contribution calendar
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
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

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
      return NextResponse.json(
        { error: `GitHub API error: ${response.status}`, details: errorText },
        { status: response.status },
      );
    }

    const result = (await response.json()) as GitHubGraphQLResponse;

    if (result.errors) {
      return NextResponse.json(
        { error: 'GitHub GraphQL errors', details: result.errors },
        { status: 400 },
      );
    }

    const data =
      result.data?.user?.contributionsCollection?.contributionCalendar;
    const contributedRepos =
      result.data?.user?.contributionsCollection
        ?.commitContributionsByRepository || [];

    if (!data) {
      return NextResponse.json(
        { error: 'No contribution data found' },
        { status: 404 },
      );
    }

    // Process the contribution calendar data
    const contributionData = processContributionCalendar(
      data,
      contributedRepos.length,
    );

    return NextResponse.json(contributionData, {
      headers: {
        'Cache-Control':
          'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - GitHub API took too long to respond' },
          { status: 504 },
        );
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Network error - Unable to reach GitHub API' },
          { status: 503 },
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

function processContributionCalendar(
  data: GitHubGraphQLData,
  repositoryCount: number,
) {
  const weeks = data.weeks || [];
  const totalContributions = data.totalContributions || 0;

  // Flatten the weeks into daily contributions
  const dailyContributions: {
    date: string;
    count: number;
  }[] = [];

  weeks.forEach((week: GitHubGraphQLWeek) => {
    week.contributionDays.forEach((day: GitHubGraphQLDay) => {
      dailyContributions.push({
        date: day.date,
        count: day.contributionCount,
      });
    });
  });

  // Get the year from the first date
  const firstDate = dailyContributions[0]?.date;
  const year = firstDate
    ? new Date(firstDate).getFullYear()
    : new Date().getFullYear();

  return {
    totalContributions,
    repositoryCount,
    dailyContributions,
    weeks: weeks.map((week: GitHubGraphQLWeek) =>
      week.contributionDays.map((day: GitHubGraphQLDay) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    ),
    year,
  };
}
