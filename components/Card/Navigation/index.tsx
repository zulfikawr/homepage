'use client';

import { useRouter } from 'next/navigation';

import { Card } from '@/components/Card';
import { Icon } from '@/components/UI';
import { IconName } from '@/components/UI/Icon';
import openLink from '@/utilities/externalLink';

interface Props {
  title: string;
  desc?: string;
  icon?: IconName;
  className?: string;
  href?: string;
  isActive?: boolean;
  action?: () => void;
}

export default function NavigationCard({
  title,
  desc,
  icon,
  className,
  href,
  isActive,
  action,
}: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (action) {
      action();
    } else if (href) {
      if (href.indexOf('http') === -1) {
        router.push(href);
      } else {
        openLink(href);
      }
    }
  };

  return (
    <Card
      className='relative px-2 md:px-4 pb-4 pt-3'
      onClick={handleClick}
      isActive={isActive}
    >
      <div className='relative z-10 flex items-center overflow-hidden'>
        {icon && (
          <div
            className={`mr-3 flex h-auto w-20 items-center justify-center border-r border-r-neutral-200 pr-1 md:pr-3 dark:border-r-neutral-600 ${
              className ? className : ''
            }`}
          >
            <Icon name={icon} className='size-[28px] md:size-[32px]' />
          </div>
        )}
        <div className='w-full'>
          <h1 className='text-md md:text-xl font-medium tracking-wide line-clamp-1 text-ellipsis'>
            {title}
          </h1>
          {desc && (
            <p className='text-xs md:text-sm tracking-wide text-muted-foreground dark:text-muted-foreground line-clamp-1 text-ellipsis'>
              {desc}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
