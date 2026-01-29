'use client';

import { useRef } from 'react';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import SectionTitle from '@/components/SectionTitle';
import { EmploymentCard } from '@/components/UI/Card/variants/Employment';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // const [showLeftMask, setShowLeftMask] = useState(false);
  // const [showRightMask, setShowRightMask] = useState(true);

  // const handleScroll = () => {
  //   if (scrollContainerRef.current) {
  //     const { scrollLeft, scrollWidth, clientWidth } =
  //       scrollContainerRef.current;
  //     setShowLeftMask(scrollLeft > 0);
  //     setShowRightMask(scrollLeft < scrollWidth - clientWidth);
  //   }
  // };

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
          <div
            ref={scrollContainerRef}
            className='flex gap-x-4 overflow-x-auto whitespace-nowrap pt-[2px] pb-[2px] -mt-[2px] -mb-[2px] scrollbar-hide relative'
          >
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <CardLoading key={index} variant='employment' />
              ))}
          </div>
        ) : sortedEmployments.length === 0 ? (
          <CardEmpty message='No employments found.' />
        ) : (
          <div className='relative'>
            {/* Left Mask */}
            {/* <div
            className={`absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-neutral-100 via-neutral-100/50 to-transparent pointer-events-none z-10 dark:from-neutral-900 dark:via-neutral-900/50 
            transition-opacity duration-300 ease-in-out ${
              showLeftMask ? 'opacity-100' : 'opacity-0'
            }`}
          /> */}

            {/* Right Mask */}
            {/* <div
            className={`absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-neutral-100 via-neutral-100/50 to-transparent pointer-events-none z-10 dark:from-neutral-900 dark:via-neutral-900/50 
            transition-opacity duration-300 ease-in-out ${
              showRightMask ? 'opacity-100' : 'opacity-0'
            }`}
          /> */}

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              // onScroll={handleScroll}
              className='flex gap-x-4 overflow-x-auto whitespace-nowrap pt-[2px] pb-[2px] -mt-[2px] -mb-[2px] scrollbar-hide relative'
            >
              <div className='flex gap-x-4'>
                <StaggerContainer>
                  {sortedEmployments.map((employment) => (
                    <ViewTransition key={employment.id} direction='right'>
                      <EmploymentCard employment={employment} />
                    </ViewTransition>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EmploymentSection;
