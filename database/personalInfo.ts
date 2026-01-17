import pb from '@/lib/pocketbase';
import { PersonalInfo } from '@/types/personalInfo';
import { RecordModel } from 'pocketbase';

const COLLECTION = 'personal_info';
const RECORD_ID = 'mainxxxxxxxxxxx';

const defaultData: PersonalInfo = {
  name: 'Zulfikar',
  title: 'I build things for the web',
  avatarUrl: '/avatar.jpg',
};

/**
 * Subscribes to personal info data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function personalInfoData(callback: (data: PersonalInfo) => void) {
  pb.collection(COLLECTION)
    .getOne<PersonalInfo>(RECORD_ID)
    .then(callback)
    .catch(() => callback(defaultData));

  pb.collection(COLLECTION).subscribe(RECORD_ID, (e) => {
    callback(e.record as unknown as PersonalInfo);
  });

  return () => pb.collection(COLLECTION).unsubscribe(RECORD_ID);
}

/**
 * Fetches the personal info from the database.
 * @returns Promise with personal info data.
 */
export async function getPersonalInfo(): Promise<PersonalInfo> {
  try {
    return await pb.collection(COLLECTION).getOne<PersonalInfo>(RECORD_ID);
  } catch {
    return defaultData;
  }
}

/**
 * Updates the personal info data.
 * @param data New personal info data.
 * @returns Promise with operation result.
 */
export async function updatePersonalInfo(
  data: PersonalInfo,
): Promise<{ success: boolean; data?: PersonalInfo; error?: string }> {
  try {
    const record = await pb
      .collection(COLLECTION)
      .update<PersonalInfo>(RECORD_ID, data);
    return { success: true, data: record };
  } catch (error: unknown) {
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
