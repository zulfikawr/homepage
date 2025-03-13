import Image from 'next/image';
import { Employment } from '@/types/employment';
import { drawer } from '@/components/Drawer';
import EmploymentViewer from '@/components/Viewer/Employment';
import { trimStr } from '@/utilities/string';
import { Card } from '@/components/Card';

export interface EmploymentCardProps extends Employment {
  isInDrawer?: boolean;
}

const EmploymentCard = (props: EmploymentCardProps) => {
  const {
    organization,
    jobTitle,
    dateString,
    jobType,
    orgLogoSrc,
    organizationIndustry,
    organizationLocation,
    isInDrawer,
  } = props;

  const handleCardClick = () => {
    drawer.open(<EmploymentViewer employment={props} />);
  };

  return (
    <Card
      onClick={() => {
        if (!isInDrawer) handleCardClick();
      }}
      isInDrawer={isInDrawer}
      className='min-w-[18rem] lg:min-w-[25rem]'
    >
      <div className='text-normal flex w-full items-center justify-between gap-x-2.5 overflow-hidden overflow-x-auto whitespace-nowrap border-b border-neutral-200 px-4.5 py-2.5 font-medium tracking-wide text-neutral-700 dark:border-neutral-700 dark:text-white'>
        <div className='flex items-center gap-x-2'>
          {orgLogoSrc && (
            <Image
              src={orgLogoSrc}
              height={24}
              width={24}
              alt={`${organization} logo`}
              className='rounded-full border bg-white dark:border-neutral-700'
            />
          )}
          <p>{organization}</p>
        </div>
        <label className='rounded-full border bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-400'>
          {organizationLocation}
        </label>
      </div>
      <div className='flex items-center justify-between gap-x-2.5 overflow-hidden overflow-x-auto whitespace-nowrap px-4.5 py-3'>
        <div className='text-sm tracking-wide text-neutral-600 dark:text-neutral-300'>
          <p>{jobTitle}</p>
        </div>
        <div className='flex flex-col items-start text-xs font-medium text-neutral-500 lg:items-center'>
          {dateString}
        </div>
      </div>

      {organizationIndustry && (
        <div className='flex items-center justify-between border-t border-neutral-200 px-4.5 py-1.5 dark:border-neutral-700 w-full'>
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            {trimStr(organizationIndustry, 25)}
          </p>
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            {jobType}
          </p>
        </div>
      )}
    </Card>
  );
};

export { EmploymentCard };
