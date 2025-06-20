'use client';

import { useState, useRef } from 'react';
import { EmploymentCard } from '@/components/Card/Employment';
import { employmentsData } from '@/functions/employments';
import { sortByDate } from '@/utilities/sortByDate';
import SectionTitle from '@/components/SectionTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';

const EmploymentSection = () => {
  const {
    data: employments,
    loading,
    error,
  } = useRealtimeData(employmentsData);

  const sortedEmployments = employments ? sortByDate(employments) : [];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftMask, setShowLeftMask] = useState(false);
  const [showRightMask, setShowRightMask] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftMask(scrollLeft > 0);
      setShowRightMask(scrollLeft < scrollWidth - clientWidth);
    }
  };

  if (error) return <div>Failed to load employments</div>;

  return (
    <section className='relative'>
      <SectionTitle
        icon='briefcase'
        title='Employments'
        link={{
          href: 'https://www.linkedin.com/in/zulfikar-muhammad',
          label: 'LinkedIn',
        }}
      />
      <div className='flex flex-col gap-y-4'>
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
            onScroll={handleScroll}
            className='flex gap-x-4 overflow-x-auto whitespace-nowrap pt-[2px] pb-[2px] -mt-[2px] -mb-[2px] scrollbar-hide relative'
          >
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <CardLoading key={index} type='employment' />
                  ))
              : sortedEmployments.map((employment) => (
                  <EmploymentCard key={employment.id} employment={employment} />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmploymentSection;
