'use client';

import CustomizationForm from '@/components/form/customization';
import { ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { useCollection } from '@/hooks';
import { mapRecordToCustomization } from '@/lib/mappers';
import { CustomizationSettings } from '@/types/customization';

export default function CustomizationContent() {
  const { data: customizationList, loading } =
    useCollection<CustomizationSettings>(
      'customization_settings',
      mapRecordToCustomization,
    );

  const customization =
    customizationList && customizationList.length > 0
      ? customizationList[0]
      : undefined;

  if (loading) {
    return (
      <div>
        <PageTitle
          emoji='🎨'
          title='Customization'
          subtitle='Manage site defaults'
          isLoading={true}
        />
        <div className='animate-pulse space-y-4'>
          <div className='h-10 bg-muted rounded-md w-full' />
          <div className='h-10 bg-muted rounded-md w-full' />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        emoji='🎨'
        title='Customization'
        subtitle='Manage site defaults'
      />

      <ViewTransition>
        <CustomizationForm data={customization} />
      </ViewTransition>
    </div>
  );
}
