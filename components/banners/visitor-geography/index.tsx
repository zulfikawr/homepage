'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';

import { Card } from '@/components/ui';
import { Button, Icon, Separator, Skeleton, Tooltip } from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import WorldMapVisualization from '@/components/visual/world-map';
import { useLoadingToggle } from '@/contexts/loading-context';

const BannerHeader = ({
  isLoading = false,
  showMoreButton = true,
}: {
  isLoading?: boolean;
  showMoreButton?: boolean;
}) => {
  const ViewAnalyticsButton = (
    <Link href='/analytics' prefetch={true}>
      <Button className='h-7 !p-1 dark:bg-muted tracking-normal'>
        {isLoading ? (
          <Skeleton width={20} height={20} />
        ) : (
          <Icon name='caretRight' className='size-5' />
        )}
      </Button>
    </Link>
  );

  return (
    <div className='flex w-full items-center justify-between px-4 py-3 bg-card-header'>
      <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
        {isLoading ? (
          <>
            <Skeleton width={28} height={28} className='rounded-md' />
            <Skeleton width={180} height={20} />
          </>
        ) : (
          <>
            <Icon name='globe' className='size-7 text-theme-blue' />
            <span>Visitor Geography</span>
          </>
        )}
      </div>

      {showMoreButton && (
        <>
          <div className='hidden md:block'>
            <Tooltip text='View Analytics'>{ViewAnalyticsButton}</Tooltip>
          </div>

          <div className='block md:hidden'>{ViewAnalyticsButton}</div>
        </>
      )}
    </div>
  );
};

export const VisitorGeographyLayout = ({
  isLoading,
  data,
  error,
  showMoreButton = true,
}: {
  isLoading: boolean;
  data: { code: string; name: string; count: number }[] | null;
  error: string | null;
  showMoreButton?: boolean;
}) => {
  return (
    <Card isPreview className='h-full'>
      <BannerHeader isLoading={isLoading} showMoreButton={showMoreButton} />

      <Separator margin='0' />

      {error ? (
        <CardEmpty message={error} />
      ) : isLoading ? (
        <div className='h-full w-full min-h-[250px] md:min-h-[350px] relative bg-card/50 p-4'>
          <Skeleton className='w-full h-full' />
        </div>
      ) : data && data.length > 0 ? (
        <div className='h-full w-full min-h-[250px] md:min-h-[350px] relative bg-card/50'>
          <div className='absolute inset-0'>
            <WorldMapVisualization data={data} />
          </div>
        </div>
      ) : (
        <CardEmpty message='No visitor data available yet' />
      )}
    </Card>
  );
};

const emptySubscribe = () => () => {};

export default function VisitorGeographyBanner({
  data = [],
  isLoading = false,
  showMoreButton = true,
}: {
  data?: { code: string; name: string; count: number }[];
  isLoading?: boolean;
  showMoreButton?: boolean;
}) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { forceLoading } = useLoadingToggle();
  const loading = isLoading || forceLoading;

  if (!mounted) {
    return (
      <div className='h-full'>
        <VisitorGeographyLayout
          isLoading={true}
          data={null}
          error={null}
          showMoreButton={showMoreButton}
        />
      </div>
    );
  }

  return (
    <div>
      <VisitorGeographyLayout
        isLoading={loading}
        data={data}
        error={null}
        showMoreButton={showMoreButton}
      />
    </div>
  );
}
