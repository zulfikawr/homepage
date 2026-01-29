'use client';

import { useRouter } from 'next/navigation';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/UI';
import EmploymentCard from '@/components/UI/Card/variants/Employment';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import { useCollection } from '@/hooks';
import { mapRecordToEmployment } from '@/lib/mappers';
import { Employment } from '@/types/employment';

export default function EmploymentDatabase() {
  const router = useRouter();

  const {
    data: employments,
    loading,
    error,
  } = useCollection<Employment>('employments', mapRecordToEmployment);

  if (error) return <CardEmpty message='Failed to load employments' />;

  const handleAddEmployment = () => {
    router.push('/database/employments/new');
  };

  return (
    <div>
      <PageTitle
        emoji='💼'
        title='Employments'
        subtitle='My professional experiences'
      />

      <div className='grid grid-cols-1 gap-4'>
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, index) => <CardLoading key={index} variant='employment' />)
        ) : (
          <>
            <ViewTransition>
              <div className='w-full rounded-md border bg-white text-center shadow-sm  dark:bg-card p-5'>
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handleAddEmployment}
                  className='mx-auto'
                >
                  {employments && employments.length > 0
                    ? 'Add more'
                    : 'Add employment'}
                </Button>
              </div>
            </ViewTransition>

            {Array.isArray(employments) && employments.length > 0 ? (
              <StaggerContainer>
                {employments.map((employment) => (
                  <ViewTransition key={employment.id}>
                    <EmploymentCard employment={employment} openForm />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            ) : (
              <CardEmpty message='No employments available' />
            )}
          </>
        )}
      </div>
    </div>
  );
}
