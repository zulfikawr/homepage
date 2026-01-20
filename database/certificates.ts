'use server';

import pb from '@/lib/pocketbase';
import { Certificate } from '@/types/certificate';
import { RecordModel } from 'pocketbase';
import { revalidateTag } from 'next/cache';
import { mapRecordToCertificate } from './certificates.client';

/**
 * Fetches all certificates from the database.
 * @returns Promise with array of certificates.
 */
export async function getCertificates(): Promise<Certificate[]> {
  'use cache';
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
    const certificate = mapRecordToCertificate(record);
    try {
      revalidateTag('certificates', 'max');
    } catch {
      // Ignore
    }
    return { success: true, certificate };
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
    const certificate = mapRecordToCertificate(record);
    try {
      revalidateTag('certificates', 'max');
    } catch {
      // Ignore
    }
    return { success: true, certificate };
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
    try {
      revalidateTag('certificates', 'max');
    } catch {
      // Ignore
    }
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
  'use cache';
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
