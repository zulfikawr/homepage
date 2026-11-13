'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { Button, Icon } from '@/components/ui';
import { Shimmer } from '@/components/ui/shimmer';
import type { IconName } from '@/components/ui/icon';
import { useRadius } from '@/contexts/radius-context';

interface SectionTitleProps {
  icon?: IconName;
  title?: string;
  iconClassName?: string;
  loading?: boolean;
  link?: {
    href: string;
    label: string;
  };
}

const SectionTitle = ({
  icon,
  title,
  link,
  loading = false,
}: SectionTitleProps) => {
  const { radius } = useRadius();

  const iconColor = useMemo(() => {
    if (!title) return 'text-primary';
    const colors = [
      'text-theme-aqua',
      'text-theme-green',
      'text-theme-yellow',
      'text-theme-blue',
      'text-theme-red',
      'text-primary',
    ];
    const charCodeSum = title
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  }, [title]);

  return (
    <div
      className={twMerge(
        'flex items-center relative z-10 mb-5 select-none',
        link && !loading ? 'justify-between' : 'justify-start',
      )}
    >
      <Shimmer loading={loading}>
        <div
          className='inline-flex items-center bg-card border-2 shadow-brutalist px-4 py-[4px] font-medium tracking-wider brutalist-interactive-lg'
          style={{ borderRadius: `${radius}px` }}
        >
          <span
            className={twMerge(
              'mr-1.5 flex h-5 w-5 items-center justify-center',
              iconColor,
              '${iconClassName}',
            )}
          >
            {icon && <Icon name={icon} />}
          </span>
          <span className='block uppercase cursor-default'>{title}</span>
        </div>
      </Shimmer>
      {link && !loading && (
        <Link href={link.href} target='_blank'>
          <Button
            variant='ghostLink'
            className='h-auto py-0 px-0 gap-1.5 text-sm'
          >
            {link.label}
            <Icon name='arrowSquareOut' size={14} />
          </Button>
        </Link>
      )}
    </div>
  );
};

export default SectionTitle;
