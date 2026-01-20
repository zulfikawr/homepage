import pb from '@/lib/pocketbase';
import { Certificate } from '@/types/certificate';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Certificate object with full URLs for images.
 * @param record PocketBase record.
 * @returns Certificate object.
 */
export function mapRecordToCertificate(record: RecordModel): Certificate {
  // Prioritize the new 'image' file field, fallback to 'imageUrl' text field
  let imageUrl = (record.image as string) || (record.imageUrl as string) || '';

  if (imageUrl) {
    if (imageUrl.startsWith('http')) {
      // already a full URL
    } else if (imageUrl.startsWith('/')) {
      // local public asset
    } else {
      // PocketBase filename
      imageUrl = pb.files.getURL(
        {
          collectionName: 'certificates',
          id: record.id,
        } as unknown as RecordModel,
        imageUrl,
      );
    }
  }

  // Prioritize the new 'organizationLogo' file field, fallback to 'organizationLogoUrl' text field
  let organizationLogoUrl =
    (record.organizationLogo as string) ||
    (record.organizationLogoUrl as string) ||
    '';
  if (
    organizationLogoUrl &&
    !organizationLogoUrl.startsWith('http') &&
    !organizationLogoUrl.startsWith('/')
  ) {
    organizationLogoUrl = pb.files.getURL(
      {
        collectionName: 'certificates',
        id: record.id,
      } as unknown as RecordModel,
      organizationLogoUrl,
    );
  }

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    issuedBy: record.issuedBy,
    dateIssued: record.dateIssued,
    credentialId: record.credentialId,
    imageUrl,
    organizationLogoUrl,
    link: record.link,
  };
}

/**
 * Fetches and subscribes to certificates data.
 */
export function certificatesData(callback: (data: Certificate[]) => void) {
  const fetchAndCallback = async () => {
    try {
      const records = await pb
        .collection('certificates')
        .getFullList<RecordModel>({ sort: '-created' });
      const data: Certificate[] = records.map(mapRecordToCertificate);
      callback(data);
    } catch {
      callback([]);
    }
  };

  fetchAndCallback();
  pb.collection('certificates').subscribe('*', fetchAndCallback);
  return () => pb.collection('certificates').unsubscribe();
}
