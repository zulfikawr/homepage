import { Employment } from '@/types/employment';
import { drawer } from '@/components/Drawer';
import EmploymentViewer from '@/components/Viewer/Employment';
import { trimStr } from '@/utilities/string';
import { Card } from '@/components/Card';
import { Badge } from '@/components/UI';
import EmploymentForm from '@/components/Form/Employment';
import ImageWithFallback from '@/components/ImageWithFallback';

interface EmploymentCardProps {
  employment: Employment;
  isInDrawer?: boolean;
  isInForm?: boolean;
}

export default function EmploymentCard({
  employment,
  isInDrawer,
  isInForm,
}: EmploymentCardProps) {
  const handleCardClick = () => {
    if (isInForm) return;

    const content = isInDrawer ? (
      <EmploymentForm employmentToEdit={employment} />
    ) : (
      <EmploymentViewer employment={employment} />
    );

    drawer.open(content);
  };

  return (
    <Card
      onClick={handleCardClick}
      isInDrawer={isInDrawer}
      isInForm={isInForm}
      className='min-w-[18rem] lg:min-w-[25rem]'
    >
      <div className='text-normal flex w-full items-center justify-between gap-x-2.5 overflow-hidden overflow-x-auto whitespace-nowrap border-b border-neutral-200 px-4.5 py-2.5 font-medium tracking-wide text-neutral-700 dark:border-neutral-700 dark:text-white'>
        <div className='flex items-center gap-x-2'>
          {employment.orgLogoSrc && (
            <ImageWithFallback
              src={employment.orgLogoSrc}
              height={24}
              width={24}
              alt={`${employment.organization} logo`}
              className='rounded-full border bg-white dark:border-neutral-700'
              type='square'
            />
          )}
          <p>{employment.organization}</p>
        </div>
        <Badge icon='mapPin'>{employment.organizationLocation}</Badge>
      </div>
      <div className='flex items-center justify-between gap-x-2.5 overflow-hidden overflow-x-auto whitespace-nowrap px-4.5 py-3'>
        <div className='text-sm tracking-wide text-neutral-600 dark:text-neutral-300'>
          <p>{employment.jobTitle}</p>
        </div>
        <div className='flex flex-col items-start text-xs font-medium text-neutral-500 lg:items-center'>
          {employment.dateString}
        </div>
      </div>

      {employment.organizationIndustry && (
        <div className='flex items-center justify-between border-t border-neutral-200 px-4.5 py-1.5 dark:border-neutral-700 w-full'>
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            {trimStr(employment.organizationIndustry, 25)}
          </p>
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            {employment.jobType}
          </p>
        </div>
      )}
    </Card>
  );
}

export { EmploymentCard };
