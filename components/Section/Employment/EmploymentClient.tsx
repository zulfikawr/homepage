'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import { EmploymentCard } from '@/components/UI/Card/variants/Employment';
import Mask from '@/components/Visual/Mask';
import { Employment } from '@/types/employment';

export default function EmploymentClient({
  employments,
}: {
  employments: Employment[];
}) {
  return (
    <Mask className='-m-4 scrollbar-hide'>
      <div className='inline-flex min-w-full gap-x-4 p-4'>
        <StaggerContainer>
          {employments.map((employment) => (
            <ViewTransition key={employment.id} direction='right'>
              <EmploymentCard employment={employment} />
            </ViewTransition>
          ))}
        </StaggerContainer>
      </div>
    </Mask>
  );
}
