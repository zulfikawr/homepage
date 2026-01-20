import pb from '@/lib/pocketbase';
import { Resume } from '@/types/resume';
import { RecordModel } from 'pocketbase';

export const COLLECTION = 'resume';
export const RECORD_ID = 'resumemainrec00';

const defaultData: Resume = {
  fileUrl: '',
};

/**
 * Maps a PocketBase record to a Resume object with full URLs.
 * @param record PocketBase record.
 * @returns Resume object.
 */
export function mapRecordToResume(record: RecordModel): Resume {
  const fileName = (record.file as string) || '';
  let fileUrl = '';

  if (fileName) {
    fileUrl = pb.files.getURL(
      { collectionName: COLLECTION, id: record.id } as unknown as RecordModel,
      fileName,
    );
  } else {
    fileUrl = defaultData.fileUrl;
  }

  return {
    fileUrl,
  };
}

/**
 * Subscribes to resume data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function resumeData(callback: (data: Resume) => void) {
  pb.collection(COLLECTION)
    .getOne(RECORD_ID)
    .then((record) => callback(mapRecordToResume(record)))
    .catch(() => callback(defaultData));

  pb.collection(COLLECTION).subscribe(RECORD_ID, (e) => {
    callback(mapRecordToResume(e.record));
  });

  return () => pb.collection(COLLECTION).unsubscribe(RECORD_ID);
}
