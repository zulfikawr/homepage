'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { RecordModel } from 'pocketbase';

import { mapRecordToEmployment } from '@/lib/mappers';
import pb from '@/lib/pocketbase';
import { Employment } from '@/types/employment';

/**
 * Helper to clean employment data before sending to PocketBase.
 */
function cleanEmploymentData(
  data: Omit<Employment, 'id'> | Employment,
): Record<string, unknown> {
  const clean: Record<string, unknown> = { ...data };

  // Handle logo field (file field vs orgLogoUrl text field)
  if (typeof clean.orgLogoUrl === 'string') {
    if (clean.orgLogoUrl.includes('/api/files/')) {
      const parts = clean.orgLogoUrl.split('/');
      clean.orgLogo = parts[parts.length - 1].split('?')[0];
    } else if (
      clean.orgLogoUrl.startsWith('http') ||
      clean.orgLogoUrl.startsWith('/')
    ) {
      // External or local URL -> move to orgLogoUrl and clear orgLogo (file field)
      clean.orgLogo = null;
    }
  }

  // Ensure responsibilities is stringified if it's an array
  if (Array.isArray(clean.responsibilities)) {
    clean.responsibilities = JSON.stringify(clean.responsibilities);
  }

  // Remove the ID from the body as it's passed in the URL
  if ('id' in clean) {
    delete clean.id;
  }

  return clean;
}

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
 * Fetches all employment records.
 */
export async function getEmployments(): Promise<Employment[]> {
  try {
    const records = await pb
      .collection('employments')
      .getFullList<RecordModel>({ sort: '-created' });
    return records.map(mapRecordToEmployment);
  } catch {
    return [];
  }
}

/**
 * Adds a new employment record.
 */
export async function addEmployment(
  data: Omit<Employment, 'id'> | FormData,
): Promise<{ success: boolean; employment?: Employment; error?: string }> {
  await ensureAuth();
  try {
    const payload =
      data instanceof FormData
        ? data
        : (cleanEmploymentData(data) as Record<string, unknown>);
    const record = await pb
      .collection('employments')
      .create<RecordModel>(payload);
    const employment = mapRecordToEmployment(record);

    revalidatePath('/employments');
    revalidatePath('/database/employments');
    revalidateTag('employments', 'max');

    return { success: true, employment };
  } catch (error: unknown) {
    const pbError = error as { data?: unknown; message?: string };
    return {
      success: false,
      error: pbError.message || String(pbError),
    };
  }
}

/**
 * Updates an existing employment record.
 */
export async function updateEmployment(
  data: Employment | FormData,
): Promise<{ success: boolean; employment?: Employment; error?: string }> {
  await ensureAuth();
  try {
    let recordId: string;
    let updateData: Record<string, unknown> | FormData;

    if (data instanceof FormData) {
      recordId = data.get('id') as string;
      const formData = new FormData();
      data.forEach((value, key) => {
        if (key !== 'id') {
          formData.append(key, value);
        }
      });
      updateData = formData;
    } else {
      recordId = data.id;
      updateData = cleanEmploymentData(data);
    }

    // Resolve slug to ID if necessary
    if (recordId.length !== 15) {
      const records = await pb
        .collection('employments')
        .getFullList<RecordModel>({
          filter: `slug = "${recordId}"`,
        });
      if (records.length > 0) {
        recordId = records[0].id;
      }
    } else {
      try {
        await pb.collection('employments').getOne(recordId);
      } catch {
        const records = await pb
          .collection('employments')
          .getFullList<RecordModel>({
            filter: `slug = "${recordId}"`,
          });
        if (records.length > 0) {
          recordId = records[0].id;
        }
      }
    }

    const record = await pb
      .collection('employments')
      .update<RecordModel>(recordId, updateData);
    const employment = mapRecordToEmployment(record);

    revalidatePath('/employments');
    revalidatePath('/database/employments');
    revalidateTag('employments', 'max');

    return { success: true, employment };
  } catch (error: unknown) {
    const pbError = error as {
      data?: unknown;
      message?: string;
      status?: number;
    };
    return {
      success: false,
      error: pbError.message || String(pbError),
    };
  }
}

/**
 * Deletes an employment record.
 */
export async function deleteEmployment(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  await ensureAuth();
  try {
    let recordId = id;
    if (id.length !== 15) {
      const records = await pb
        .collection('employments')
        .getFullList<RecordModel>({
          filter: `slug = "${id}"`,
        });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('employments').getOne(id);
      } catch {
        const records = await pb
          .collection('employments')
          .getFullList<RecordModel>({
            filter: `slug = "${id}"`,
          });
        if (records.length > 0) recordId = records[0].id;
      }
    }
    await pb.collection('employments').delete(recordId);

    revalidatePath('/employments');
    revalidatePath('/database/employments');
    revalidateTag('employments', 'max');

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fetches a single employment record by ID or slug.
 */
export async function getEmploymentById(
  id: string,
): Promise<Employment | null> {
  try {
    if (id.length === 15) {
      try {
        const record = await pb
          .collection('employments')
          .getOne<RecordModel>(id);
        if (record) return mapRecordToEmployment(record);
      } catch {
        // Ignored
      }
    }

    const records = await pb
      .collection('employments')
      .getFullList<RecordModel>({
        filter: `slug = "${id}"`,
        requestKey: null,
      });

    if (records.length > 0) {
      return mapRecordToEmployment(records[0]);
    }

    return null;
  } catch {
    return null;
  }
}
