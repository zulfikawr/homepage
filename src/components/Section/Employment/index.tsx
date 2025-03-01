import { useState } from 'react';
import Link from 'next/link';
import { EmploymentCard } from '~/components/Card/Employment';
import { Icon } from '~/components/UI';
import { drawer } from '~/components/Drawer';
import { getEmployments } from '~/functions/employments';
import { useAuth } from '~/contexts/authContext';
import { sortByDate } from '~/utilities/sortByDate';
import { useFetchData } from '~/lib/fetchData';
import EmploymentsDrawer from './drawer';

const EmploymentSection = () => {
  const { user } = useAuth();
  const [maskClass, setMaskClass] = useState('');
  const { data: employments, loading, error } = useFetchData(getEmployments);

  const handleOpenEmploymentsDrawer = () => {
    drawer.open(<EmploymentsDrawer employments={sortedEmployments} />);
  };

  const sortedEmployments = employments ? sortByDate(employments) : [];

  if (error) return <div>Failed to load employments</div>;
  if (loading) return null;
  if (!employments) return <div>No employments found</div>;

  return (
    <section>
      <div className='flex items-center justify-between'>
        <div
          onClick={user ? handleOpenEmploymentsDrawer : undefined}
          className={`inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-[4px] font-medium tracking-wider shadow-sm ${
            user ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600' : ''
          } dark:border-gray-600 dark:bg-gray-700`}
        >
          <span className='mr-1.5 flex h-5 w-5'>
            <Icon name='briefcase' />
          </span>
          <span className='block uppercase'>Employments</span>
        </div>
        <Link
          href='https://www.linkedin.com/in/zulfikar-muhammad'
          target='_blank'
          className='flex items-center gap-x-2 flex items-center gap-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        >
          LinkedIn
          <span className='h-5 w-5'>
            <Icon name='arrowSquareOut' />
          </span>
        </Link>
      </div>
      <div className='mt-5 flex flex-col gap-y-4'>
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
          className={`flex gap-x-4 overflow-x-auto whitespace-nowrap ${maskClass}`}
        >
          {sortedEmployments.map((employment, index) => (
            <EmploymentCard key={index} {...employment} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmploymentSection;
