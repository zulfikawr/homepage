'use client';

import { useEffect } from 'react';

import EmploymentForm from '@/components/Form/Employment';
import PageTitle from '@/components/PageTitle';
import { useTitle } from '@/contexts/titleContext';
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
      <EmploymentForm employment_to_edit={employment} />
    </div>
  );
}
