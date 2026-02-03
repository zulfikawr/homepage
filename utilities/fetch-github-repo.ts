export interface GitHubRepoData {
  stars: number;
  forks: number;
  language?: string;
  description?: string;
}

export async function fetchGitHubRepo(
  repoUrl: string,
): Promise<GitHubRepoData | null> {
  try {
    const parts = repoUrl.replace(/\/$/, '').split('/');
    const repo = parts.pop();
    const owner = parts.pop();

    if (!owner || !repo) {
      console.error('Invalid GitHub URL');
      return null;
    }

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error(`GitHub API error: ${res.status}`);
      return null;
    }

    interface GitHubRepoResponse {
      stargazersCount: number;
      forksCount: number;
      language: string | null;
      description: string | null;
    }
    const data = (await res.json()) as GitHubRepoResponse;

    return {
      stars: data.stargazersCount || 0,
      forks: data.forksCount || 0,
      language: data.language || undefined,
      description: data.description || undefined,
    };
  } catch (error) {
    console.error('Failed to fetch GitHub repo:', error);
    return null;
  }
}
