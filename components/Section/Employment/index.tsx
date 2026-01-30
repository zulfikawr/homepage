'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import SectionTitle from '@/components/SectionTitle';
import { EmploymentCard } from '@/components/UI/Card/variants/Employment';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import Mask from '@/components/Visual/Mask';
import { useCollection } from '@/hooks';
import { mapRecordToEmployment } from '@/lib/mappers';
import { Employment } from '@/types/employment';
import { sortByDate } from '@/utilities/sortByDate';

const EmploymentSection = () => {
  const {
    data: employments,
    loading,
    error,
  } = useCollection<Employment>('employments', mapRecordToEmployment);

  const sortedEmployments = employments ? sortByDate(employments) : [];

  if (error) return <CardEmpty message='Failed to load employments' />;

  return (
    <section className='relative'>
      <SectionTitle
        icon='briefcase'
        title='Employments'
        loading={loading}
        link={{
          href: 'https://www.linkedin.com/in/zulfikar-muhammad',
          label: 'LinkedIn',
        }}
      />
      <div className='flex flex-col gap-y-4'>
        {loading ? (
          <Mask className='-my-1'>
            <div className='inline-flex min-w-full gap-x-4 py-1'>
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <CardLoading key={index} variant='employment' />
                ))}
            </div>
          </Mask>
        ) : sortedEmployments.length === 0 ? (
          <CardEmpty message='No employments found.' />
        ) : (
          <Mask className='-my-1'>
            <div className='inline-flex min-w-full gap-x-4 py-1'>
              <StaggerContainer>
                {sortedEmployments.map((employment) => (
                  <ViewTransition key={employment.id} direction='right'>
                    <EmploymentCard employment={employment} />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            </div>
          </Mask>
        )}
      </div>
    </section>
  );
};

export default EmploymentSection;
