'use client';

import dynamic from 'next/dynamic';

import SectionTitle from '@/components/section-title';
import { Skeleton } from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import { useLoadingToggle } from '@/contexts/loading-context';
import { InterestsAndObjectives } from '@/types/interests-and-objectives';

const MarkdownRenderer = dynamic(
  () =>
    import('@/components/ui/markdown-renderer').then(
      (module) => module.MarkdownRenderer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className='space-y-3'>
        <Skeleton width='100%' height={16} />
        <Skeleton width='100%' height={16} />
        <Skeleton width='16.6%' height={16} />
      </div>
    ),
  },
);

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

      <div className='-mt-2'>
        {isLoading ? (
          <div className='space-y-3'>
            <Skeleton width='100%' height={16} />
            <Skeleton width='100%' height={16} />
            <Skeleton width='16.6%' height={16} />
          </div>
        ) : (
          <MarkdownRenderer content={data?.content || ''} />
        )}
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
