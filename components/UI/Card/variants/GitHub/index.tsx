'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Icon } from '../../..';
import { Card } from '../..';

interface GitHubCardProps {
  repoUrl: string;
  repoName: string;
  isInForm?: boolean;
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
  isInForm = false,
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
          const apiData = await res.json();
          setData({
            stars: apiData.stargazers_count || 0,
            forks: apiData.forks_count || 0,
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
    <Card isInForm={isInForm} className='overflow-hidden'>
      <Link
        href={repoUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='block h-full'
      >
        <div className='flex flex-col h-full p-4 sm:p-5 gap-3'>
          {/* Header with icon and name */}
          <div className='flex items-start justify-between gap-3'>
            <h3 className='text-base font-semibold text-foreground truncate dark:text-gruv-fg'>
              {repoName}
            </h3>
            <Icon
              name='arrowSquareOut'
              className='h-4 w-4 text-muted-foreground flex-shrink-0 dark:text-gruv-fg-dim'
            />
          </div>

          {/* Description from GitHub */}
          {data.description && (
            <p className='text-sm text-muted-foreground line-clamp-2 dark:text-gruv-fg-dim'>
              {data.description}
            </p>
          )}

          {/* Language badge */}
          {data.language && (
            <div className='text-xs font-medium text-muted-foreground dark:text-gruv-fg-dim'>
              <span className='inline-flex items-center gap-1.5'>
                <span className='inline-block h-2 w-2 rounded-full bg-primary dark:bg-gruv-aqua'></span>
                {data.language}
              </span>
            </div>
          )}

          {/* Stats footer */}
          <div className='flex items-center gap-4 mt-auto pt-3 border-t border-border dark:border-gruv-bg-soft'>
            <div className='flex items-center gap-1.5 text-xs text-muted-foreground dark:text-gruv-fg-dim'>
              <Icon
                name='star'
                className='h-4 w-4 text-gruv-yellow dark:text-gruv-yellow'
              />
              <span className='font-medium'>{data.stars.toLocaleString()}</span>
            </div>
            <div className='flex items-center gap-1.5 text-xs text-muted-foreground dark:text-gruv-fg-dim'>
              <Icon
                name='gitFork'
                className='h-4 w-4 text-gruv-blue dark:text-gruv-blue'
              />
              <span className='font-medium'>{data.forks.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export { GitHubCard };
