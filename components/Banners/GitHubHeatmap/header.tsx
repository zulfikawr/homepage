import Link from 'next/link';

import { Button, Icon, Tooltip } from '@/components/UI';

interface BannerHeaderProps {
  isLoading?: boolean;
}

const BannerHeader: React.FC<BannerHeaderProps> = ({ isLoading = false }) => {
  const GoToGithubButton = (
    <Link
      href='https://github.com/zulfikawr'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Button className='h-7 p-1 dark:bg-muted tracking-normal'>
        {isLoading ? (
          <div className='size-5 bg-muted-foreground/20 rounded animate-pulse' />
        ) : (
          <Icon name='caretRight' className='size-5' />
        )}
      </Button>
    </Link>
  );

  return (
    <div className='flex w-full items-center justify-between px-4 py-3'>
      <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
        {isLoading ? (
          <>
            <div className='size-7 bg-muted rounded-md animate-pulse' />
            <div className='h-5 w-40 bg-muted rounded animate-pulse' />
          </>
        ) : (
          <>
            <Icon name='githubLogo' className='size-7 text-gruv-blue' />
            <span>GitHub Contributions</span>
          </>
        )}
      </div>

      <div className='hidden md:block'>
        <Tooltip text='GitHub'>{GoToGithubButton}</Tooltip>
      </div>

      <div className='block md:hidden'>{GoToGithubButton}</div>
    </div>
  );
};

export default BannerHeader;
