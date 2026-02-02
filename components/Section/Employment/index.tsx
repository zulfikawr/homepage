'use client';

import SectionTitle from '@/components/SectionTitle';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import Mask from '@/components/Visual/Mask';
import { useLoadingToggle } from '@/contexts/loadingContext';
import { Employment } from '@/types/employment';
import { sortByDate } from '@/utilities/sortByDate';

import EmploymentClient from './EmploymentClient';

export const EmploymentLayout = ({
  employments,
  isLoading = false,
}: {
  employments?: Employment[];
  isLoading?: boolean;
}) => {
  const sortedEmployments = employments ? sortByDate(employments) : [];

  return (
    <section className='relative'>
      <SectionTitle
        icon='briefcase'
        title='Employments'
        loading={isLoading}
        link={
          !isLoading
            ? {
                href: 'https://www.linkedin.com/in/zulfikar-muhammad',
                label: 'LinkedIn',
              }
            : undefined
        }
      />
      <div className='flex flex-col gap-y-4'>
        {isLoading ? (
          <Mask className='-m-4 scrollbar-hide'>
            <div className='inline-flex min-w-full gap-x-4 p-4'>
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <CardLoading key={i} variant='employment' />
                ))}
            </div>
          </Mask>
        ) : sortedEmployments.length === 0 ? (
          <CardEmpty message='No employments found.' />
        ) : (
          <EmploymentClient employments={sortedEmployments} />
        )}
      </div>
    </section>
  );
};

export default function EmploymentSection({ data }: { data: Employment[] }) {
  const { forceLoading } = useLoadingToggle();

  if (forceLoading) {
    return <EmploymentLayout isLoading={true} />;
  }

  return <EmploymentLayout employments={data} isLoading={false} />;
}
