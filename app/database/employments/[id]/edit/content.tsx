'use client';

import { Employment } from '@/types/employment';
import PageTitle from '@/components/PageTitle';
import EmploymentForm from '@/components/Form/Employment';
import { useTitle } from '@/contexts/titleContext';
import { useEffect } from 'react';

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
