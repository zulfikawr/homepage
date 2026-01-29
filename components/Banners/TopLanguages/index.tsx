import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Card } from '@/components/UI';
import { Button, Icon, Separator, Skeleton, Tooltip } from '@/components/UI';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { useLoadingToggle } from '@/contexts/loadingContext';

interface Language {
  name: string;
  bytes: number;
  color: string;
  percentage: string;
  lines: number;
}

interface LanguageData {
  languages: Language[];
  totalBytes: number;
}

// Map language names to iconify icon names
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

const BannerHeader = ({ isLoading = false }: { isLoading?: boolean }) => {
  const GoToGithubButton = (
    <Link
      href='https://github.com/zulfikawr?tab=repositories'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Button className='h-7 p-1 dark:bg-muted tracking-normal'>
        {isLoading ? (
          <Skeleton width={20} height={20} />
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
            <Skeleton width={28} height={28} className='rounded-md' />
            <Skeleton width={180} height={20} />
          </>
        ) : (
          <>
            <Icon name='code' className='size-7 text-gruv-aqua' />
            <span>Top Languages</span>
          </>
        )}
      </div>

      <div className='hidden md:block'>
        <Tooltip text='View Repositories'>{GoToGithubButton}</Tooltip>
      </div>

      <div className='block md:hidden'>{GoToGithubButton}</div>
    </div>
  );
};

const TopLanguagesLayout = ({
  isLoading,
  data,
}: {
  isLoading: boolean;
  data: LanguageData | null;
}) => {
  const topLanguage = data?.languages?.[0];

  return (
    <Card isPreview>
      <BannerHeader isLoading={isLoading} />

      <Separator margin='0' />

      <div className='p-4 space-y-4'>
        {/* Top Language Display */}
        <div className='flex items-center gap-4'>
          <div className='flex-shrink-0'>
            {isLoading ? (
              <Skeleton width={64} height={64} className='rounded-lg' />
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
                <Skeleton width={120} height={24} />
                <Skeleton width={80} height={20} />
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

        {/* Language Progress Bars */}
        <div className='space-y-3'>
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='space-y-1.5'>
                  <div className='flex items-center justify-between'>
                    <Skeleton width={80} height={14} />
                    <Skeleton width={40} height={14} />
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

const TopLanguagesBanner = ({ className }: { className?: string }) => {
  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { forceLoading, forceEmpty } = useLoadingToggle();

  const isLoading = loading || forceLoading;

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/github/languages', {
          next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
          throw new Error('Failed to fetch language data');
        }

        const data = await response.json();
        setLanguageData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching language data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load languages',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  if (error && !forceEmpty) {
    return (
      <div className={className}>
        <Card isPreview>
          <BannerHeader />
          <Separator margin='0' />
          <CardEmpty message={error} />
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <TopLanguagesLayout
        isLoading={isLoading}
        data={forceEmpty ? null : languageData}
      />
    </div>
  );
};

export default TopLanguagesBanner;
