'use client';

import { useSyncExternalStore } from 'react';
import { getTimeAgo } from '@/utilities/timeAgo';

interface TimeAgoProps {
  date: string | number | Date;
  prefix?: string;
  className?: string;
}

const emptySubscribe = () => () => {};

export const TimeAgo = ({
  date,
  prefix = '',
  className = '',
}: TimeAgoProps) => {
  // useSyncExternalStore is the idiomatic way to handle client-only state
  // without triggering hydration mismatches or lint errors.
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // During SSR and initial client render, we show a static placeholder
  // to avoid Next.js 16 prerender errors with new Date().
  if (!isMounted) {
    return (
      <span className={className}>
        {prefix} {typeof date === 'string' ? date : ''}
      </span>
    );
  }

  // Once mounted, we calculate the actual relative time
  const timeAgoString = getTimeAgo(date);

  return (
    <span className={className}>
      {prefix} {timeAgoString}
    </span>
  );
};
