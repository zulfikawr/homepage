'use client';

import { useEffect } from 'react';

import EmploymentForm from '@/components/form/employment';
import PageTitle from '@/components/page-title';
import { useTitle } from '@/contexts/title-context';
import { Employment } from '@/types/employment';

interface EditEmploymentPageProps {
  employment: Employment;
}

export default function EditEmploymentPage({
  employment,
}: EditEmploymentPageProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle(`Edit: ${employment.organization}`);
    return () => setHeaderTitle('Employments');
  }, [employment.organization, setHeaderTitle]);

  return (
    <div>
      <PageTitle
        emoji='💼'
        title='Edit Employment'
        subtitle={employment.organization}
      />
      <EmploymentForm employmentToEdit={employment} />
    </div>
  );
}
