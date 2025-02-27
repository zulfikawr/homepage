import { useState } from 'react';
import Link from 'next/link';
import { EmploymentCard } from '~/components/Card/Employment';
import { Icon, Button } from '~/components/UI';
import { drawer } from '~/components/Drawer';
import EmploymentForm from '~/components/Form/Employment';
import useSWR from 'swr';
import fetcher from '~/lib/fetcher';
import { Employment } from '~/types/employment';

const EmploymentSection = () => {
  const { data, error } = useSWR('/api/employments', fetcher);
  const [maskClass, setMaskClass] = useState('');

  const handleAddEmployment = () => {
    drawer.open(<EmploymentForm />);
  };

  if (error) return <div>Failed to load employments</div>;
  if (!data) return <div>Loading...</div>;

  const { employments }: { employments: Employment[] } = data;

  const parseDate = (dateString: string) => {
    if (dateString.includes('Present')) {
      return new Date();
    }
    const [month, year] = dateString.split(' ');
    return new Date(`${month} 1, ${year}`);
  };

  const sortedEmployments = employments.sort((a, b) => {
    const dateA = parseDate(a.dateString);
    const dateB = parseDate(b.dateString);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <section className='mt-14'>
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

      {/* Add Employment Button */}
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
    </section>
  );
};

export default EmploymentSection;
