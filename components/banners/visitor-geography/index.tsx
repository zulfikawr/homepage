'use client';

import Link from 'next/link';

import { Card } from '@/components/ui';
import { Button, Icon, Separator, Skeleton, Tooltip } from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import WorldMapVisualization from '@/components/visual/world-map';
import { useLoadingToggle } from '@/contexts/loading-context';

const BannerHeader = ({ isLoading = false }: { isLoading?: boolean }) => {
  const ViewAnalyticsButton = (
    <Link
      href='/analytics'
      prefetch={true}
      target='_blank'
      rel='noopener noreferrer'
    >
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
            <Icon name='globe' className='size-7 text-gruv-blue' />
            <span>Visitor Geography</span>
          </>
        )}
      </div>

      <div className='hidden md:block'>
        <Tooltip text='View Analytics'>{ViewAnalyticsButton}</Tooltip>
      </div>

      <div className='block md:hidden'>{ViewAnalyticsButton}</div>
    </div>
  );
};

export const VisitorGeographyLayout = ({
  isLoading,
  data,
  error,
}: {
  isLoading: boolean;
  data: { code: string; name: string; count: number }[] | null;
  error: string | null;
}) => {
  return (
    <Card isPreview className='h-full'>
      <BannerHeader isLoading={isLoading} />

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

export default function VisitorGeographyBanner({
  className,
  data = [],
  isLoading = false,
}: {
  className?: string;
  data?: { code: string; name: string; count: number }[];
  isLoading?: boolean;
}) {
  const { forceLoading } = useLoadingToggle();
  const loading = isLoading || forceLoading;

  return (
    <div className={className}>
      <VisitorGeographyLayout isLoading={loading} data={data} error={null} />
    </div>
  );
}
