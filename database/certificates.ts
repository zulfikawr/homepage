'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { RecordModel } from 'pocketbase';

import { mapRecordToCertificate } from '@/lib/mappers';
import pb from '@/lib/pocketbase';
import { Certificate } from '@/types/certificate';

/**
 * Ensures the PocketBase client is authenticated for server-side operations
 * by loading the auth state from the request cookies.
 */
async function ensureAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('pb_auth');

  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }
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
  await ensureAuth();
  try {
    const record = await pb
      .collection('certificates')
      .create<RecordModel>(data);
    const certificate = mapRecordToCertificate(record);

    revalidatePath('/certs');
    revalidatePath('/database/certs');
    revalidateTag('certificates', 'max');

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
  await ensureAuth();
  try {
    let recordId: string;
    let updateData: Record<string, unknown> | FormData;

    if (data instanceof FormData) {
      recordId = data.get('id') as string;
      updateData = data;
    } else {
      const { id, ...rest } = data;
      recordId = id;

      if (recordId.length !== 15) {
        const records = await pb
          .collection('certificates')
          .getFullList<RecordModel>({
            filter: `slug = "${recordId}"`,
          });
        if (records.length > 0) recordId = records[0].id;
      } else {
        try {
          await pb.collection('certificates').getOne(recordId);
        } catch {
          const records = await pb
            .collection('certificates')
            .getFullList<RecordModel>({
              filter: `slug = "${recordId}"`,
            });
          if (records.length > 0) recordId = records[0].id;
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

    revalidatePath('/certs');
    revalidatePath('/database/certs');
    revalidateTag('certificates', 'max');

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
  await ensureAuth();
  try {
    let recordId = id;
    if (id.length !== 15) {
      const records = await pb
        .collection('certificates')
        .getFullList<RecordModel>({
          filter: `slug = "${id}"`,
        });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('certificates').getOne(id);
      } catch {
        const records = await pb
          .collection('certificates')
          .getFullList<RecordModel>({
            filter: `slug = "${id}"`,
          });
        if (records.length > 0) recordId = records[0].id;
      }
    }
    await pb.collection('certificates').delete(recordId);

    revalidatePath('/certs');
    revalidatePath('/database/certs');
    revalidateTag('certificates', 'max');

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
