'use client';

import { useRouter } from 'next/navigation';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Button, Card } from '@/components/ui';
import EmploymentCard from '@/components/ui/card/variants/employment';
import CardEmpty from '@/components/ui/card/variants/empty';
import { CardLoading } from '@/components/ui/card/variants/loading';
import { useCollection } from '@/hooks';
import { mapRecordToEmployment } from '@/lib/mappers';
import { Employment } from '@/types/employment';
import { sortByDate } from '@/utilities/sort-by-date';

export default function EmploymentDatabase() {
  const router = useRouter();

  const {
    data: employments,
    loading,
    error,
  } = useCollection<Employment>('employments', mapRecordToEmployment);

  const sortedEmployments = employments ? sortByDate(employments) : [];

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
              <Card isPreview>
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handleAddEmployment}
                  className='my-8 mx-auto'
                >
                  {sortedEmployments.length > 0 ? 'Add more' : 'Add employment'}
                </Button>
              </Card>
            </ViewTransition>

            {sortedEmployments.length > 0 ? (
              <StaggerContainer>
                {sortedEmployments.map((employment) => (
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
