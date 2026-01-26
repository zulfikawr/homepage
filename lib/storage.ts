import { RecordModel } from 'pocketbase';

import pb from './pocketbase';

/**
 * Generates a URL for a file stored in PocketBase.
 * This function acts as an abstraction layer to allow switching storage providers easily.
 *
 * @param record - The PocketBase record (or an object with collectionName and id)
 * @param fileName - The name of the file
 * @returns The full URL to the file
 */
export function getFileUrl(
  record: RecordModel | { collectionName: string; id: string },
  fileName: string,
): string {
  if (!fileName) return '';

  // If it's already a full URL, return it
  if (fileName.startsWith('http')) return fileName;

  // Custom logic for "clean" storage paths can be added here
  // For example, if you move resume to a custom folder:
  // if (record.collectionName === 'resume') return `/storage/resume/${fileName}`;

  return pb.files.getURL(record as RecordModel, fileName);
}
