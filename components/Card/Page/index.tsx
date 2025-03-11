'use client';

import { Icon } from 'components/UI';
import { useRouter } from 'next/navigation';
import openLink from 'utilities/externalLink';

interface Props {
  title: string;
  desc: string;
  icon?: string;
  className?: string;
  href?: string;
}

export default function PageCard({
  title,
  desc,
  icon,
  className,
  href,
}: Props) {
  const router = useRouter();
  const handleClick = () => {
    if (href) {
      if (href.indexOf('http') === -1) {
        router.push(href);
      } else {
        openLink(href);
      }
    }
  };

  return (
    <div
      className='relative flex cursor-pointer items-center rounded-md border bg-white px-2 md:px-4 pb-4 pt-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:shadow-none'
      onClick={handleClick}
    >
      <div className='relative z-10 flex items-center overflow-hidden'>
        {icon && (
          <div
            className={`mr-3 flex h-auto w-20 items-center justify-center border-r border-r-gray-200 pr-1 md:pr-3 dark:border-r-gray-600 ${
              className ? className : ''
            }`}
          >
            <Icon
              name={icon}
              className='h-[28px] w-[28px] md:h-[32px] md:w-[32px]'
            />
          </div>
        )}
        <div className='w-full'>
          <h1 className='flex items-center text-md md:text-xl font-medium tracking-wide'>
            {title}
          </h1>
          <p className='text-xs md:text-sm tracking-wide text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis'>
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
