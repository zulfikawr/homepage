'use client';

import { useState } from 'react';
import { EmploymentCard } from 'components/Card/Employment';
import { drawer } from 'components/Drawer';
import { getEmployments } from 'functions/employments';
import { useAuth } from 'contexts/authContext';
import { sortByDate } from 'utilities/sortByDate';
import { useFetchData } from 'lib/fetchData';
import EmploymentsDrawer from './drawer';
import SectionTitle from '@/components/SectionTitle';
import { CardLoading } from '@/components/Card/Loading';

const EmploymentSection = () => {
  const { user } = useAuth();
  const [maskClass, setMaskClass] = useState('');
  const {
    data: employments,
    loading,
    error,
    refetch,
  } = useFetchData(getEmployments);

  const sortedEmployments = employments ? sortByDate(employments) : [];

  const handleOpenEmploymentsDrawer = () => {
    drawer.open(
      <EmploymentsDrawer employments={sortedEmployments} onUpdate={refetch} />,
    );
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
        onClick={handleOpenEmploymentsDrawer}
        isClickable={!!user}
      />
      <div className='flex flex-col gap-y-4'>
        <div
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            let maskClass = '';
            if (
              target.scrollLeft > 0 &&
              target.scrollLeft < target.scrollWidth - target.clientWidth
            ) {
              maskClass = 'mask-x-full';
            } else if (target.scrollLeft === 0) {
              maskClass = 'mask-x-r';
            } else {
              maskClass = 'mask-x-l';
            }
            setMaskClass(maskClass);
          }}
          className={`relative ${maskClass}`}
        >
          <div className='flex gap-x-4 overflow-x-auto whitespace-nowrap pt-[2px] pb-[2px] -mt-[2px] -mb-[2px]'>
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <CardLoading key={index} type='employment' />
                  ))
              : sortedEmployments.map((employment) => (
                  <EmploymentCard key={employment.id} {...employment} />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmploymentSection;
