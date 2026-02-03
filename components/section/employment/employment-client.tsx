'use client';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import { EmploymentCard } from '@/components/ui/card/variants/employment';
import Mask from '@/components/visual/mask';
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
