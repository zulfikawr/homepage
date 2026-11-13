'use client';

import dynamic from 'next/dynamic';

import SectionTitle from '@/components/section-title';
import { Shimmer } from '@/components/ui/shimmer';
import CardEmpty from '@/components/ui/card/variants/empty';
import { useLoadingToggle } from '@/contexts/loading-context';
import { InterestsAndObjectives } from '@/types/interests-and-objectives';

const TEMPLATE_MARKDOWN = `I build terminal tools and web applications. I am interested in how systems work, low-level utilities, and building reliable software.

- Write code that solves specific technical problems.
- Build tools that make it easier to interact with the system.

Through my work, I aim to create projects that I find useful and contribute back to the open-source community.`;

const MarkdownRenderer = dynamic(
  () =>
    import('@/components/ui/markdown-renderer').then(
      (module) => module.MarkdownRenderer,
    ),
  {
    ssr: false,
    loading: () => (
      <Shimmer loading>
        <div className='space-y-3'>
          <p>{TEMPLATE_MARKDOWN}</p>
        </div>
      </Shimmer>
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

      <Shimmer loading={isLoading}>
        <div className='-mt-2'>
          <MarkdownRenderer content={data?.content || TEMPLATE_MARKDOWN} />
        </div>
      </Shimmer>
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
