import { NextResponse } from 'next/server';

const GITHUB_USERNAME = 'zulfikawr';

interface LanguageNode {
  name: string;
  color: string;
}

interface LanguageEdge {
  size: number;
  node: LanguageNode;
}

interface GitHubLanguagesResponse {
  data?: {
    user?: {
      repositories?: {
        nodes: Array<{
          name: string;
          languages: {
            edges: LanguageEdge[];
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

    // GitHub GraphQL query to get user's top languages from repositories
    const query = `
      query($username: String!) {
        user(login: $username) {
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {
            nodes {
              name
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
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
      return NextResponse.json(
        { error: `GitHub API error: ${response.status}`, details: errorText },
        { status: response.status },
      );
    }

    const result = (await response.json()) as GitHubLanguagesResponse;

    if (result.errors) {
      return NextResponse.json(
        { error: 'GitHub GraphQL errors', details: result.errors },
        { status: 400 },
      );
    }

    const repositories = result.data?.user?.repositories?.nodes;

    if (!repositories) {
      return NextResponse.json(
        { error: 'No repository data found' },
        { status: 404 },
      );
    }

    // Aggregate language usage across all repositories
    const languageStats: Record<
      string,
      { bytes: number; color: string; name: string }
    > = {};

    repositories.forEach((repo: { languages: { edges: LanguageEdge[] } }) => {
      repo.languages.edges.forEach((edge: LanguageEdge) => {
        const { name, color } = edge.node;
        const { size } = edge;

        // Filter out HTML and Jupyter Notebook
        if (name === 'HTML' || name === 'Jupyter Notebook') {
          return;
        }

        if (languageStats[name]) {
          languageStats[name].bytes += size;
        } else {
          languageStats[name] = {
            bytes: size,
            color: color || '#858585',
            name,
          };
        }
      });
    });

    // Convert to array and sort by bytes
    const sortedLanguages = Object.values(languageStats)
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 10); // Top 10 languages

    // Calculate total bytes
    const totalBytes = sortedLanguages.reduce(
      (sum, lang) => sum + lang.bytes,
      0,
    );

    // Add percentage to each language
    const languagesWithPercentage = sortedLanguages.map((lang) => {
      // Estimate lines of code (average ~40 bytes per line)
      const estimatedLines = Math.round(lang.bytes / 40);

      return {
        ...lang,
        percentage: ((lang.bytes / totalBytes) * 100).toFixed(1),
        lines: estimatedLines,
      };
    });

    return NextResponse.json(
      {
        languages: languagesWithPercentage,
        total_bytes: totalBytes,
      },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching GitHub languages:', error);

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
