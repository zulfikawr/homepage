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
export function mapRecordToPersonalInfo(record: RecordModel): PersonalInfo {
  const fileName =
    (record.avatar as string) || (record.avatarUrl as string) || '';
  let avatarUrl = '';

  if (fileName) {
    if (fileName.startsWith('http')) {
      avatarUrl = fileName;
    } else if (fileName.startsWith('/')) {
      avatarUrl = fileName;
    } else {
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
