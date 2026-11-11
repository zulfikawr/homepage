import { StaggerContainer, ViewTransition } from '@/components/motion';
import { BannerSetting, groupBannerRows } from '@/lib/banner-config';

interface BannerGridProps {
  settings: BannerSetting[];
  nodes: Record<string, React.ReactNode>;
}

const BannerGrid = ({ settings, nodes }: BannerGridProps) => {
  const rows = groupBannerRows(settings);

  return (
    <div className='space-y-6'>
      <StaggerContainer>
        {rows.map((row) => {
          const isWide = row.length === 1 && row[0].width === 'wide';

          return (
            <ViewTransition
              key={row.map((banner) => banner.id).join('-')}
              className='h-full'
            >
              {isWide ? (
                nodes[row[0].id]
              ) : (
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  {row.map((banner) => (
                    <div key={banner.id} className='h-full'>
                      {nodes[banner.id]}
                    </div>
                  ))}
                </div>
              )}
            </ViewTransition>
          );
        })}
      </StaggerContainer>
    </div>
  );
};

export default BannerGrid;
