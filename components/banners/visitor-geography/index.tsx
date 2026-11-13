'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Card } from '@/components/ui';
import { Button, Icon, Separator, Tooltip } from '@/components/ui';
import { Shimmer } from '@/components/ui/shimmer';
import WorldMapSkeleton from '@/components/visual/world-map/skeleton';
import CardEmpty from '@/components/ui/card/variants/empty';
import { useLoadingToggle } from '@/contexts/loading-context';

const WorldMapVisualization = dynamic(
  () => import('@/components/visual/world-map'),
  { ssr: false },
);

const BannerHeader = ({
  showMoreButton = true,
}: {
  showMoreButton?: boolean;
}) => {
  const ViewAnalyticsButton = (
    <Link aria-label='View analytics' href='/analytics' prefetch={false}>
      <Button
        aria-label='View analytics'
        className='h-7 !p-1 dark:bg-muted tracking-normal'
      >
        <Icon name='caretRight' className='size-5' />
      </Button>
    </Link>
  );

  return (
    <div className='flex w-full items-center justify-between px-4 py-3 bg-card-header'>
      <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
        <Icon name='globe' className='size-7 text-theme-blue' />
        <span>Visitor Geography</span>
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
  shouldRenderMap = false,
}: {
  isLoading: boolean;
  data: { code: string; name: string; count: number }[] | null;
  error: string | null;
  showMoreButton?: boolean;
  shouldRenderMap?: boolean;
}) => {
  return (
    <Card isPreview className='h-full'>
      <Shimmer loading={isLoading}>
        <BannerHeader showMoreButton={showMoreButton} />
      </Shimmer>

      <Separator margin='0' />

      {error ? (
        <CardEmpty message={error} />
      ) : data && data.length > 0 ? (
        <div className='h-full w-full min-h-[250px] md:min-h-[350px] relative bg-card/50'>
          <div className='absolute inset-0'>
            {isLoading || !shouldRenderMap ? (
              <WorldMapSkeleton />
            ) : (
              <WorldMapVisualization data={data} />
            )}
          </div>
        </div>
      ) : isLoading ? (
        <div className='h-full w-full min-h-[250px] md:min-h-[350px] relative bg-card/50'>
          <div className='absolute inset-0'>
            <WorldMapSkeleton />
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
  const mapRef = useRef<HTMLDivElement>(null);
  const [shouldRenderMap, setShouldRenderMap] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { forceLoading } = useLoadingToggle();
  const loading = isLoading || forceLoading;

  useEffect(() => {
    const element = mapRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRenderMap(true);
        observer.disconnect();
      },
      { rootMargin: '200px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className='h-full'>
        <VisitorGeographyLayout
          isLoading={true}
          data={null}
          error={null}
          showMoreButton={showMoreButton}
          shouldRenderMap={false}
        />
      </div>
    );
  }

  return (
    <div ref={mapRef}>
      <VisitorGeographyLayout
        isLoading={loading}
        data={data}
        error={null}
        showMoreButton={showMoreButton}
        shouldRenderMap={shouldRenderMap}
      />
    </div>
  );
}
