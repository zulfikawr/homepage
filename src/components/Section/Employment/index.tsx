import Link from 'next/link';
import { EmploymentCard } from '~/components/Card/Employment';
import { Icon, Button } from '~/components/UI';
import { drawer } from '~/components/Drawer';
import EmploymentForm from '~/components/Form/Employment';
import { useState } from 'react';
import { getEmployments } from '~/functions/employments';
import { useAuth } from '~/contexts/authContext';
import { sortByDate } from '~/utilities/sortByDate';
import { useFetchData } from '~/lib/fetchData';

const EmploymentSection = () => {
  const { user } = useAuth();
  const [maskClass, setMaskClass] = useState('');
  const { data: employments, loading, error } = useFetchData(getEmployments);

  const handleAddEmployment = () => {
    drawer.open(<EmploymentForm />);
  };

  const sortedEmployments = employments ? sortByDate(employments) : [];

  if (error) return <div>Failed to load employments</div>;
  if (loading) return <div>Loading...</div>;
  if (!employments) return <div>No employments found</div>;

  return (
    <section>
      <div className='flex items-center justify-between'>
        <label className='inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-[4px] font-medium tracking-wider shadow-sm dark:border-gray-600 dark:bg-gray-700'>
          <span className='mr-1.5 flex h-5 w-5'>
            <Icon name='suitcase' />
          </span>
          <span className='uppercase'>Employment</span>
        </label>
        <Link
          href='https://www.linkedin.com/in/zulfikar-muhammad'
          target='_blank'
          className='flex items-center gap-x-1 text-gray-500 underline-offset-4 hover:underline dark:text-gray-400'
        >
          LinkedIn
          <span className='h-5 w-5 underline'>
            <Icon name='externalLink' />
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

      {user && (
        <div className='mt-6 flex justify-center'>
          <Button
            type='primary'
            onClick={handleAddEmployment}
            className='flex items-center gap-2'
          >
            <span className='h-5 w-5'>
              <Icon name='plus' />
            </span>
            Add Employment
          </Button>
        </div>
      )}
    </section>
  );
};

export default EmploymentSection;
