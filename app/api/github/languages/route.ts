import { apiError, apiSuccess, handleApiError } from '@/lib/api';

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
      return apiError('GITHUB_TOKEN not found in environment variables', 500);
    }

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
      return apiError(
        `GitHub API error: ${response.status}`,
        response.status,
        errorText,
      );
    }

    const result = (await response.json()) as GitHubLanguagesResponse;

    if (result.errors) {
      return apiError(
        'GitHub GraphQL errors',
        400,
        JSON.stringify(result.errors),
      );
    }

    const repositories = result.data?.user?.repositories?.nodes;

    if (!repositories) {
      return apiError('No repository data found', 404);
    }

    const languageStats: Record<
      string,
      { bytes: number; color: string; name: string }
    > = {};

    repositories.forEach((repo: { languages: { edges: LanguageEdge[] } }) => {
      repo.languages.edges.forEach((edge: LanguageEdge) => {
        const { name, color } = edge.node;
        const { size } = edge;

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

    const sortedLanguages = Object.values(languageStats)
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 10);

    const totalBytes = sortedLanguages.reduce(
      (sum, lang) => sum + lang.bytes,
      0,
    );

    const languagesWithPercentage = sortedLanguages.map((lang) => {
      const estimatedLines = Math.round(lang.bytes / 40);

      return {
        ...lang,
        percentage: ((lang.bytes / totalBytes) * 100).toFixed(1),
        lines: estimatedLines,
      };
    });

    return apiSuccess(
      {
        languages: languagesWithPercentage,
        total_bytes: totalBytes,
      },
      200,
    );
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
