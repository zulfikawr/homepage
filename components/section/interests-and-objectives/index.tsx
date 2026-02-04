'use client';

import SectionTitle from '@/components/section-title';
import { Skeleton } from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import { Separator } from '@/components/ui/separator';
import { useLoadingToggle } from '@/contexts/loading-context';
import { InterestsAndObjectives } from '@/types/interests-and-objectives';

export const InterestsAndObjectivesLayout = ({
  data,
  isLoading = false,
}: {
  data?: InterestsAndObjectives;
  isLoading?: boolean;
}) => {
  return (
    <section>
      <SectionTitle
        icon='microscope'
        title='Interests & Objectives'
        loading={isLoading}
      />

      <div className='-mt-2 flex flex-col font-light text-muted-foreground dark:text-muted-foreground'>
        {isLoading ? (
          <div className='space-y-3'>
            <Skeleton width='100%' height={16} />
            <Skeleton width='100%' height={16} />
            <Skeleton width='16.6%' height={16} />
          </div>
        ) : (
          <p>{data?.description}</p>
        )}

        <Separator margin='4' />

        <div className='h-6 flex items-center'>
          {isLoading ? (
            <Skeleton width={192} height={16} />
          ) : (
            <p>My general objectives are to:</p>
          )}
        </div>

        <ul className='mt-2 list-disc pl-5 space-y-2'>
          {isLoading
            ? [1, 2, 3].map((i) => (
                <li key={i} className='pl-3'>
                  <Skeleton width='80%' height={16} />
                </li>
              ))
            : data?.objectives.map((objective, index) => (
                <li key={index} className='pl-3 text-theme-aqua'>
                  <span className='text-muted-foreground font-light'>
                    {objective}
                  </span>
                </li>
              ))}
        </ul>

        <div className='mt-5 space-y-3'>
          {isLoading ? (
            <>
              <Skeleton width='100%' height={16} />
              <Skeleton width='80%' height={16} />
            </>
          ) : (
            <p>{data?.conclusion}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default function InterestsAndObjectivesSection({
  data,
}: {
  data?: InterestsAndObjectives;
}) {
  const { forceLoading } = useLoadingToggle();

  if (forceLoading || !data) {
    if (!data && !forceLoading) {
      return (
        <section>
          <SectionTitle icon='microscope' title='Interests & Objectives' />
          <CardEmpty message='No interests and objectives found.' />
        </section>
      );
    }
    return <InterestsAndObjectivesLayout isLoading={true} />;
  }

  return <InterestsAndObjectivesLayout data={data} isLoading={false} />;
}
