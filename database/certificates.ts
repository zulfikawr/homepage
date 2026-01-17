import pb from '@/lib/pocketbase';
import { Certificate } from '@/types/certificate';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Certificate object with full URLs for images.
 * @param record PocketBase record.
 * @returns Certificate object.
 */
function mapRecordToCertificate(record: RecordModel): Certificate {
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
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
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

/**
 * Fetches all certificates from the database.
 * @returns Promise with array of certificates.
 */
export async function getCertificates(): Promise<Certificate[]> {
  try {
    const records = await pb
      .collection('certificates')
      .getFullList<RecordModel>({ sort: '-created' });
    return records.map(mapRecordToCertificate);
  } catch {
    return [];
  }
}

/**
 * Adds a new certificate to the database.
 * @param data Certificate data or FormData.
 * @returns Promise with operation result.
 */
export async function addCertificate(
  data: Omit<Certificate, 'id'> | FormData,
): Promise<{ success: boolean; certificate?: Certificate; error?: string }> {
  try {
    const record = await pb
      .collection('certificates')
      .create<RecordModel>(data);
    return { success: true, certificate: mapRecordToCertificate(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing certificate in the database.
 * @param data Updated certificate data or FormData.
 * @returns Promise with operation result.
 */
export async function updateCertificate(
  data: Certificate | FormData,
): Promise<{ success: boolean; certificate?: Certificate; error?: string }> {
  try {
    let recordId: string;
    let updateData: Record<string, unknown> | FormData;

    if (data instanceof FormData) {
      recordId = data.get('id') as string;
      updateData = data;
    } else {
      const { id, ...rest } = data;
      recordId = id;

      // Basic slug-to-ID matching if ID is not standard
      if (recordId.length !== 15) {
        try {
          const record = await pb
            .collection('certificates')
            .getFirstListItem(`slug="${recordId}"`);
          recordId = record.id;
        } catch {
          // Ignore error if not found by slug
        }
      }

      const cleanData: Record<string, unknown> = { ...rest };

      // Extract filename if it's a PocketBase URL
      if (data.imageUrl && data.imageUrl.includes('/api/files/')) {
        const parts = data.imageUrl.split('/');
        const fileName = parts[parts.length - 1].split('?')[0];
        cleanData.image = fileName;
      }

      if (
        data.organizationLogoUrl &&
        data.organizationLogoUrl.includes('/api/files/')
      ) {
        const parts = data.organizationLogoUrl.split('/');
        const fileName = parts[parts.length - 1].split('?')[0];
        cleanData.organizationLogo = fileName;
      }

      updateData = cleanData;
    }

    const record = await pb
      .collection('certificates')
      .update<RecordModel>(recordId, updateData);
    return { success: true, certificate: mapRecordToCertificate(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a certificate from the database.
 * @param id ID or slug of the certificate.
 * @returns Promise with operation result.
 */
export async function deleteCertificate(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('certificates')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    await pb.collection('certificates').delete(recordId);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fetches a single certificate by ID or slug.
 * @param id ID or slug of the certificate.
 * @returns Promise with the certificate data or null.
 */
export async function getCertificateById(
  id: string,
): Promise<Certificate | null> {
  try {
    if (id.length === 15) {
      try {
        const record = await pb
          .collection('certificates')
          .getOne<RecordModel>(id);
        if (record) return mapRecordToCertificate(record);
      } catch {
        // Ignored
      }
    }

    const records = await pb
      .collection('certificates')
      .getFullList<RecordModel>({
        filter: `slug = "${id}"`,
        requestKey: null,
      });

    if (records.length > 0) {
      return mapRecordToCertificate(records[0]);
    }

    return null;
  } catch {
    return null;
  }
}
