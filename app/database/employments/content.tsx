'use client';

import React from 'react';
import EmploymentCard from '@/components/Card/Employment';
import { employmentsData } from '@/database/employments';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';

export default function EmploymentDatabase() {
  const router = useRouter();

  const {
    data: employments,
    loading,
    error,
  } = useRealtimeData(employmentsData);

  if (error) return <div>Failed to load employments</div>;

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
          Array(4)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='employment' />)
        ) : Array.isArray(employments) && employments.length > 0 ? (
          <>
            <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800 p-5'>
              <Button
                type='primary'
                icon='plus'
                onClick={handleAddEmployment}
                className='mx-auto'
              >
                Add more
              </Button>
            </div>

            {employments.map((employment) => (
              <EmploymentCard
                key={employment.id}
                employment={employment}
                openForm
              />
            ))}
          </>
        ) : (
          <CardEmpty message='No employments available' />
        )}
      </div>
    </div>
  );
}
