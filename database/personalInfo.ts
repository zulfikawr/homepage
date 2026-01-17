import pb from '@/lib/pocketbase';
import { PersonalInfo } from '@/types/personalInfo';
import { RecordModel } from 'pocketbase';

export const COLLECTION = 'profile';
export const RECORD_ID = 'me';

const defaultData: PersonalInfo = {
  name: 'Zulfikar',
  title: 'I build things for the web',
  avatarUrl: '/avatar.jpg',
};

/**
 * Maps a PocketBase record to a PersonalInfo object with full URLs.
 * @param record PocketBase record.
 * @returns PersonalInfo object.
 */
function mapRecordToPersonalInfo(record: RecordModel): PersonalInfo {
  // 1. Determine which field contains the valid image pointer
  // Prefer 'avatar' as it's the standard PB file field
  const fileName =
    (record.avatar as string) || (record.avatarUrl as string) || '';
  let avatarUrl = '';

  if (fileName) {
    if (fileName.startsWith('http')) {
      avatarUrl = fileName;
    } else if (fileName.startsWith('/')) {
      // IMPORTANT: If it starts with a slash, it's a local public asset (e.g., /avatar.jpg)
      // We return it as-is so Next.js picks it up from the public folder.
      avatarUrl = fileName;
    } else {
      // It's a filename from PocketBase (e.g., image_7a2b.png)
      // Force using COLLECTION name instead of record's internal collectionId
      avatarUrl = pb.files.getURL(
        { collectionName: COLLECTION, id: record.id } as unknown as RecordModel,
        fileName,
      );
    }
  } else {
    avatarUrl = defaultData.avatarUrl;
  }

  return {
    name: record.name as string,
    title: record.title as string,
    avatarUrl,
  };
}

/**
 * Subscribes to personal info data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function personalInfoData(callback: (data: PersonalInfo) => void) {
  pb.collection(COLLECTION)
    .getOne(RECORD_ID)
    .then((record) => callback(mapRecordToPersonalInfo(record)))
    .catch(() => callback(defaultData));

  pb.collection(COLLECTION).subscribe(RECORD_ID, (e) => {
    callback(mapRecordToPersonalInfo(e.record));
  });

  return () => pb.collection(COLLECTION).unsubscribe(RECORD_ID);
}

/**
 * Fetches the personal info from the database.
 * @returns Promise with personal info data.
 */
export async function getPersonalInfo(): Promise<PersonalInfo> {
  try {
    const record = await pb.collection(COLLECTION).getOne(RECORD_ID);
    return mapRecordToPersonalInfo(record);
  } catch {
    return defaultData;
  }
}

/**
 * Updates the personal info data.
 * @param data New personal info data or FormData.
 * @returns Promise with operation result.
 */
export async function updatePersonalInfo(
  data: PersonalInfo | FormData,
): Promise<{ success: boolean; data?: PersonalInfo; error?: string }> {
  try {
    let updateData: Record<string, unknown> | FormData;

    if (data instanceof FormData) {
      updateData = data;
    } else {
      const cleanData: Record<string, unknown> = {
        name: data.name,
        title: data.title,
      };

      // 2. Extract filename if it's a PocketBase URL, or keep as is if it's a local path
      const finalAvatarUrl = data.avatarUrl;
      if (finalAvatarUrl.includes('/api/files/')) {
        const parts = finalAvatarUrl.split('/');
        const fileName = parts[parts.length - 1].split('?')[0];
        cleanData.avatar = fileName;
        cleanData.avatarUrl = '';
      } else {
        cleanData.avatarUrl = finalAvatarUrl;
      }
      updateData = cleanData;
    }

    const record = await pb
      .collection(COLLECTION)
      .update(RECORD_ID, updateData);

    return { success: true, data: mapRecordToPersonalInfo(record) };
  } catch {
    try {
      const record = await pb
        .collection(COLLECTION)
        .create<PersonalInfo>({ id: RECORD_ID, ...data });
      return { success: true, data: record };
    } catch (createError: unknown) {
      return {
        success: false,
        error:
          createError instanceof Error
            ? createError.message
            : String(createError),
      };
    }
  }
}
