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
 * Helper to clean certificate data before sending to PocketBase.
 */
function cleanCertificateData(
  data: Omit<Certificate, 'id'> | Certificate,
): Record<string, unknown> {
  const clean: Record<string, unknown> = { ...data };

  // Handle image field
  if (typeof clean.image === 'string') {
    if (clean.image.includes('/api/files/')) {
      const parts = clean.image.split('/');
      clean.image = parts[parts.length - 1].split('?')[0];
    } else if (clean.image.startsWith('http') || clean.image.startsWith('/')) {
      clean.imageUrl = clean.image;
      clean.image = null;
    }
  }

  // Handle organizationLogo field
  if (typeof clean.organizationLogo === 'string') {
    if (clean.organizationLogo.includes('/api/files/')) {
      const parts = clean.organizationLogo.split('/');
      clean.organizationLogo = parts[parts.length - 1].split('?')[0];
    } else if (
      clean.organizationLogo.startsWith('http') ||
      clean.organizationLogo.startsWith('/')
    ) {
      clean.organizationLogoUrl = clean.organizationLogo;
      clean.organizationLogo = null;
    }
  }

  // Remove ID
  if ('id' in clean) {
    delete clean.id;
  }

  return clean;
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
    const payload =
      data instanceof FormData
        ? data
        : (cleanCertificateData(data) as Record<string, unknown>);
    const record = await pb
      .collection('certificates')
      .create<RecordModel>(payload);
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
      const formId = data.get('id') as string;
      if (formId) recordId = formId;
      else throw new Error('ID is required for update');

      const formData = new FormData();
      data.forEach((value, key) => {
        if (key !== 'id') {
          formData.append(key, value);
        }
      });
      updateData = formData;
    } else {
      recordId = data.id;
      updateData = cleanCertificateData(data);
    }

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
