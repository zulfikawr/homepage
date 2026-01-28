import { useRouter } from 'next/navigation';

import { Card } from '@/components/Card';
import { drawer } from '@/components/Drawer';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Badge } from '@/components/UI';
import EmploymentViewer from '@/components/Viewer/Employment';
import { Employment } from '@/types/employment';
import { trimStr } from '@/utilities/string';

interface EmploymentCardProps {
  employment: Employment;
  openForm?: boolean;
  isInForm?: boolean;
}

const JOB_TYPE_LABELS: Record<string, string> = {
  fullTime: 'Full-time',
  partTime: 'Part-time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
};

function formatJobType(key?: string) {
  if (!key) return '';
  if (JOB_TYPE_LABELS[key]) return JOB_TYPE_LABELS[key];
  const spaced = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export default function EmploymentCard({
  employment,
  openForm,
  isInForm,
}: EmploymentCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (isInForm) return;

    if (openForm) {
      router.push(`/database/employments/${employment.id}/edit`);
    } else {
      drawer.open(<EmploymentViewer employment={employment} />);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      openForm={openForm}
      isInForm={isInForm}
      className='min-w-[18rem] lg:min-w-[25rem]'
    >
      <div className='text-normal flex w-full items-center justify-between gap-x-2.5 overflow-hidden overflow-x-auto whitespace-nowrap border-b border-border px-4.5 py-2.5 font-medium tracking-wide text-foreground  dark:text-foreground'>
        <div className='flex items-center gap-x-2'>
          {employment.orgLogoUrl && (
            <ImageWithFallback
              src={employment.orgLogoUrl}
              height={24}
              width={24}
              alt={`${employment.organization} logo`}
              className='rounded-full border bg-muted '
              type='square'
              sizes='24px'
            />
          )}
          <p>{employment.organization}</p>
        </div>
        <Badge type='yellow' icon='mapPin'>
          {employment.organizationLocation}
        </Badge>
      </div>
      <div className='flex items-center justify-between gap-x-2.5 overflow-hidden overflow-x-auto whitespace-nowrap px-4.5 py-3'>
        <div className='text-sm font-medium tracking-wide text-foreground'>
          <p>{employment.jobTitle}</p>
        </div>
        <div className='flex flex-col items-start text-xs font-medium text-gruv-blue lg:items-center'>
          {employment.dateString}
        </div>
      </div>

      {employment.organizationIndustry && (
        <div className='flex items-center justify-between border-t border-border px-4.5 py-1.5  w-full'>
          <p className='text-sm text-muted-foreground'>
            {trimStr(employment.organizationIndustry, 25)}
          </p>
          <Badge type='aqua' className='text-[10px] px-1.5 py-0'>
            {formatJobType(employment.jobType)}
          </Badge>
        </div>
      )}
    </Card>
  );
}

export { EmploymentCard };
