import pb from '@/lib/pocketbase';
import { Section } from '@/types/section';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Section object.
 */
export function mapRecordToSection(record: RecordModel): Section {
  return {
    id: record.id,
    name: record.name,
    title: record.title,
    enabled: record.enabled,
    order: record.order,
  };
}

/**
 * Fetches and subscribes to sections data.
 */
export function sectionsData(callback: (data: Section[]) => void) {
  const fetchAndCallback = async () => {
    try {
      const records = await pb
        .collection('sections')
        .getFullList<RecordModel>({ sort: 'order' });
      callback(records.map(mapRecordToSection));
    } catch {
      callback([]);
    }
  };

  fetchAndCallback();
  pb.collection('sections').subscribe('*', fetchAndCallback);
  return () => pb.collection('sections').unsubscribe();
}
