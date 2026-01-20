import pb from '@/lib/pocketbase';
import { Employment } from '@/types/employment';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to an Employment object.
 */
export function mapRecordToEmployment(record: RecordModel): Employment {
  // Prioritize the new 'orgLogo' file field, fallback to 'orgLogoUrl' text field
  let logo = (record.orgLogo as string) || (record.orgLogoUrl as string) || '';

  if (logo) {
    if (logo.startsWith('http')) {
      // already a full URL
    } else if (logo.startsWith('/')) {
      // local public asset
    } else {
      // PocketBase filename
      logo = pb.files.getURL(
        {
          collectionName: 'employments',
          id: record.id,
        } as unknown as RecordModel,
        logo,
      );
    }
  }

  return {
    id: record.id,
    slug: record.slug,
    organization: record.organization,
    jobTitle: record.jobTitle,
    dateString: record.dateString,
    jobType: record.jobType,
    orgLogoUrl: logo,
    organizationIndustry: record.organizationIndustry,
    organizationLocation: record.organizationLocation,
    responsibilities:
      typeof record.responsibilities === 'string'
        ? JSON.parse(record.responsibilities)
        : record.responsibilities,
  };
}

/**
 * Fetches and subscribes to employments data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function employmentsData(callback: (data: Employment[]) => void) {
  const fetchAndCallback = async () => {
    try {
      const records = await pb
        .collection('employments')
        .getFullList<RecordModel>({ sort: '-created' });
      callback(records.map(mapRecordToEmployment));
    } catch {
      callback([]);
    }
  };

  fetchAndCallback();

  pb.collection('employments').subscribe('*', fetchAndCallback);

  return () => pb.collection('employments').unsubscribe();
}
