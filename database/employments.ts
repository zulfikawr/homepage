import pb from '@/lib/pocketbase';
import { Employment } from '@/types/employment';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to an Employment object.
 */
function mapRecordToEmployment(record: RecordModel): Employment {
  return {
    id: record.id,
    slug: record.slug,
    organization: record.organization,
    jobTitle: record.jobTitle,
    dateString: record.dateString,
    jobType: record.jobType,
    orgLogoSrc: record.orgLogoSrc,
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

/**
 * Fetches all employment records.
 * @returns Promise with array of employments.
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
 * @param data Employment data without ID.
 * @returns Promise with operation result.
 */
export async function addEmployment(
  data: Omit<Employment, 'id'>,
): Promise<{ success: boolean; employment?: Employment; error?: string }> {
  try {
    const record = await pb.collection('employments').create<RecordModel>(data);
    return { success: true, employment: mapRecordToEmployment(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing employment record.
 * @param data Updated employment data.
 * @returns Promise with operation result.
 */
export async function updateEmployment(
  data: Employment,
): Promise<{ success: boolean; employment?: Employment; error?: string }> {
  try {
    const { id, ...rest } = data;
    let recordId = id;

    if (recordId.length !== 15) {
      try {
        const record = await pb
          .collection('employments')
          .getFirstListItem(`slug="${recordId}"`);
        recordId = record.id;
      } catch {
        // Ignore
      }
    }

    const record = await pb
      .collection('employments')
      .update<RecordModel>(recordId, rest);
    return { success: true, employment: mapRecordToEmployment(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes an employment record.
 * @param id ID or slug of the record.
 * @returns Promise with operation result.
 */
export async function deleteEmployment(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('employments')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    await pb.collection('employments').delete(recordId);
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
 * @param id ID or slug of the record.
 * @returns Promise with the record or null.
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
