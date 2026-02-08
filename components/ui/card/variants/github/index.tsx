'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Icon } from '@/components/ui';
import { Card } from '@/components/ui/card';

interface GitHubCardProps {
  repoUrl: string;
  repoName: string;
  isPreview?: boolean;
}

interface GitHubData {
  stars: number;
  forks: number;
  language?: string;
  description?: string;
}

export default function GitHubCard({
  repoUrl,
  repoName,
  isPreview,
}: GitHubCardProps) {
  const [data, setData] = useState<GitHubData>({
    stars: 0,
    forks: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parts = repoUrl.replace(/\/$/, '').split('/');
        const repo = parts.pop();
        const owner = parts.pop();

        if (!owner || !repo) return;

        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
        );
        if (res.ok) {
          interface GitHubRepoApiData {
            stargazersCount: number;
            forksCount: number;
            language: string | null;
            description: string | null;
          }
          const apiData = (await res.json()) as GitHubRepoApiData;
          setData({
            stars: apiData.stargazersCount || 0,
            forks: apiData.forksCount || 0,
            language: apiData.language || undefined,
            description: apiData.description || undefined,
          });
        }
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
      }
    };

    fetchData();
  }, [repoUrl]);

  return (
    <div className={isPreview ? 'w-full' : ''}>
      <Card isPreview={isPreview}>
        <Link
          href={repoUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='block h-full'
          onClick={isPreview ? (e) => e.preventDefault() : undefined}
        >
          <div className='flex flex-col h-full p-4 sm:p-5 gap-3'>
            {/* Header with icon and name */}
            <div className='flex items-start justify-between gap-3'>
              <h3 className='text-base font-semibold text-foreground truncate dark:text-theme-fg'>
                {repoName}
              </h3>
              <Icon
                name='arrowSquareOut'
                className='h-4 w-4 text-muted-foreground flex-shrink-0 dark:text-theme-fg-dim'
              />
            </div>

            {/* Description from GitHub */}
            {data.description && (
              <p className='text-sm text-muted-foreground line-clamp-2 dark:text-theme-fg-dim'>
                {data.description}
              </p>
            )}

            {/* Language badge */}
            {data.language && (
              <div className='text-xs font-medium text-muted-foreground dark:text-theme-fg-dim'>
                <span className='inline-flex items-center gap-1.5'>
                  <span className='inline-block h-2 w-2 rounded-full bg-primary dark:bg-theme-aqua'></span>
                  {data.language}
                </span>
              </div>
            )}

            {/* Stats footer */}
            <div className='flex items-center gap-4 mt-auto pt-3 border-t border-border dark:border-theme-bg-soft'>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground dark:text-theme-fg-dim'>
                <Icon
                  name='star'
                  className='h-4 w-4 text-theme-yellow dark:text-theme-yellow'
                />
                <span className='font-medium'>
                  {data.stars.toLocaleString()}
                </span>
              </div>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground dark:text-theme-fg-dim'>
                <Icon
                  name='gitFork'
                  className='h-4 w-4 text-theme-blue dark:text-theme-blue'
                />
                <span className='font-medium'>
                  {data.forks.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    </div>
  );
}

export { GitHubCard };
