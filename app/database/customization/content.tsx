'use client';

import CustomizationForm from '@/components/form/customization';
import { ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Shimmer } from '@/components/ui/shimmer';
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

  return (
    <div>
      <PageTitle
        emoji='🎨'
        title='Customization'
        subtitle='Manage site defaults'
      />

      <Shimmer loading={loading}>
        <ViewTransition>
          <CustomizationForm data={customization} />
        </ViewTransition>
      </Shimmer>
    </div>
  );
}
