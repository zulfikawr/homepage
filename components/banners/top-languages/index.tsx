'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';

import { Card } from '@/components/ui';
import { Button, Icon, Separator, Skeleton, Tooltip } from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import { useLoadingToggle } from '@/contexts/loading-context';

interface Language {
  name: string;
  bytes: number;
  color: string;
  percentage: string;
  lines: number;
}

interface LanguageData {
  languages: Language[];
  total_bytes: number;
}

const getLanguageIcon = (name: string): string => {
  const iconMap: Record<string, string> = {
    JavaScript: 'javascript',
    TypeScript: 'typescript',
    Python: 'python',
    Go: 'go',
    Rust: 'rust',
    Java: 'java',
    PHP: 'php',
    Ruby: 'ruby',
    Swift: 'swift',
    Kotlin: 'kotlin',
    'C++': 'cpp',
    'C#': 'csharp',
    Dart: 'dart',
    HTML: 'html',
    CSS: 'css',
    Vue: 'vue',
    R: 'r',
  };

  return iconMap[name] || 'code';
};

const BannerHeader = ({
  isLoading = false,
  showMoreButton = true,
}: {
  isLoading?: boolean;
  showMoreButton?: boolean;
}) => {
  const GoToGithubButton = (
    <Link
      href='https://github.com/zulfikawr?tab=repositories'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Button className='h-7 !p-1 dark:bg-muted tracking-normal'>
        {isLoading ? (
          <Skeleton width={20} height={20} className='rounded-sm' />
        ) : (
          <Icon name='caretRight' className='size-5' />
        )}
      </Button>
    </Link>
  );

  return (
    <div className='flex w-full items-center justify-between px-4 py-3 bg-card-header '>
      <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
        {isLoading ? (
          <>
            <Skeleton width={28} height={28} className='rounded-md' />
            <Skeleton width={120} height={24} />
          </>
        ) : (
          <>
            <Icon name='code' className='size-7 text-gruv-yellow' />
            <span>Top Languages</span>
          </>
        )}
      </div>

      {showMoreButton && (
        <>
          <div className='hidden md:block'>
            <Tooltip text='View Repositories'>{GoToGithubButton}</Tooltip>
          </div>

          <div className='block md:hidden'>{GoToGithubButton}</div>
        </>
      )}
    </div>
  );
};

export const TopLanguagesLayout = ({
  isLoading,
  data,
  showMoreButton = true,
}: {
  isLoading: boolean;
  data: LanguageData | null;
  showMoreButton?: boolean;
}) => {
  const topLanguage = data?.languages?.[0];

  return (
    <Card isPreview>
      <BannerHeader isLoading={isLoading} showMoreButton={showMoreButton} />

      <Separator margin='0' />

      <div className='p-4 space-y-4'>
        <div className='flex items-center gap-4'>
          <div className='flex-shrink-0'>
            {isLoading ? (
              <div className='w-16 h-16 rounded-lg flex items-center justify-center'>
                <Skeleton width={48} height={48} className='rounded-lg' />
              </div>
            ) : topLanguage ? (
              <div className='w-16 h-16 rounded-lg bg-transparent flex items-center justify-center'>
                <Icon
                  name={getLanguageIcon(topLanguage.name)}
                  className='size-12'
                />
              </div>
            ) : null}
          </div>

          <div className='flex-1 space-y-1'>
            {isLoading ? (
              <>
                <h3 className='text-xl font-bold h-7 flex items-center'>
                  <Skeleton width={120} height={24} as='span' />
                </h3>
                <p className='text-sm h-5 flex items-center'>
                  <Skeleton width={80} height={16} as='span' />
                </p>
              </>
            ) : topLanguage ? (
              <>
                <h3 className='text-xl font-bold text-foreground'>
                  {topLanguage.name}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {topLanguage.percentage}% of code
                </p>
              </>
            ) : (
              <p className='text-sm text-muted-foreground'>No data available</p>
            )}
          </div>
        </div>

        <div className='space-y-3'>
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='space-y-1.5'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Skeleton
                        width={12}
                        height={12}
                        variant='circle'
                        className='flex-shrink-0'
                      />
                      <Skeleton width={80} height={12} />
                    </div>
                    <Skeleton width={60} height={12} />
                  </div>
                  <Skeleton width='100%' height={8} className='rounded-full' />
                </div>
              ))}
            </>
          ) : data?.languages && data.languages.length > 0 ? (
            data.languages.slice(0, 5).map((lang) => (
              <div key={lang.name} className='space-y-1.5'>
                <div className='flex items-center justify-between text-xs'>
                  <div className='flex items-center gap-2'>
                    <div
                      className='w-3 h-3 rounded-full'
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className='text-foreground font-medium'>
                      {lang.name}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground'>
                      ~{lang.lines.toLocaleString()} lines
                    </span>
                    <span className='text-muted-foreground'>|</span>
                    <span className='text-muted-foreground'>
                      {lang.percentage}%
                    </span>
                  </div>
                </div>
                <div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='h-full transition-all duration-500 ease-out rounded-full'
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: lang.color,
                    }}
                  />
                </div>
              </div>
            ))
          ) : null}
        </div>
      </div>
    </Card>
  );
};

const emptySubscribe = () => () => {};

export default function TopLanguagesBanner({
  data,
  isLoading = false,
  showMoreButton = true,
}: {
  data: LanguageData | null;
  isLoading?: boolean;
  showMoreButton?: boolean;
}) {
  const { forceLoading } = useLoadingToggle();
  const loading = isLoading || forceLoading;

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div>
        <TopLanguagesLayout
          isLoading={true}
          data={null}
          showMoreButton={showMoreButton}
        />
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div>
        <Card isPreview>
          <BannerHeader showMoreButton={showMoreButton} />
          <Separator margin='0' />
          <CardEmpty message='No language data available' />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <TopLanguagesLayout
        isLoading={loading}
        data={data}
        showMoreButton={showMoreButton}
      />
    </div>
  );
}
