'use client';

import { GitHubContributionData } from '@/types/github';

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

interface GitHubCache {
  data: GitHubContributionData | null;
  lastFetched: number;
}

const apiCache: GitHubCache = {
  data: null,
  lastFetched: 0,
};

/**
 * Fetches GitHub contribution data using the API route
 * The API route handles authentication server-side
 */
export async function getGitHubContributions(): Promise<GitHubContributionData | null> {
  try {
    // Check cache first
    const now = Date.now();
    if (apiCache.data && now - apiCache.lastFetched < CACHE_DURATION) {
      return apiCache.data;
    }

    const response = await fetch('/api/github/contributions', {
      method: 'GET',
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      interface GitHubErrorResponse {
        error?: string;
        message?: string;
        details?: unknown;
      }
      const errorData = (await response.json()) as GitHubErrorResponse;
      console.error('GitHub API error:', response.status, errorData);
      return null;
    }

    const data = (await response.json()) as GitHubContributionData;

    // Cache the data
    apiCache.data = data;
    apiCache.lastFetched = now;

    return data;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return null;
  }
}

/**
 * Gets the gruvbox color for a given intensity level
 */
export function getGruvboxIntensityColor(intensity: number): string {
  const colors = {
    0: '#ebdbb2', // theme-bg-light (empty)
    1: '#d5c4a1', // light-medium (low)
    2: '#bdae93', // medium (medium)
    3: '#79740e', // theme-green (high)
    4: '#b57614', // theme-yellow (very high)
    5: '#af3a03', // theme-orange (extra high)
    6: '#9d0006', // theme-red (extreme)
  };

  return colors[intensity as keyof typeof colors] || colors[0];
}

/**
 * Gets the gruvbox color for a given intensity level (dark mode)
 */
export function getGruvboxIntensityColorDark(intensity: number): string {
  const colors = {
    0: '#3c3836', // theme-bg-dark (empty)
    1: '#504945', // theme-bg-soft (low)
    2: '#665c54', // medium
    3: '#b8bb26', // theme-green (high)
    4: '#fabd2f', // theme-yellow (very high)
    5: '#fe8019', // theme-orange (extra high)
    6: '#fb4934', // theme-red (extreme)
  };

  return colors[intensity as keyof typeof colors] || colors[0];
}
