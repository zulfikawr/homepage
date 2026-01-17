import pb from '@/lib/pocketbase';
import { Section } from '@/types/section';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Section object.
 */
function mapRecordToSection(record: RecordModel): Section {
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

/**
 * Fetches all sections from the database.
 */
export async function getSections(): Promise<Section[]> {
  try {
    const records = await pb
      .collection('sections')
      .getFullList<RecordModel>({ sort: 'order' });
    return records.map(mapRecordToSection);
  } catch {
    return [];
  }
}

/**
 * Adds a new section to the database.
 */
export async function addSection(
  data: Omit<Section, 'id'>,
): Promise<{ success: boolean; section?: Section; error?: string }> {
  try {
    const record = await pb.collection('sections').create<RecordModel>(data);
    return { success: true, section: mapRecordToSection(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing section in the database.
 */
export async function updateSection(
  id: string,
  data: Partial<Section>,
): Promise<{ success: boolean; section?: Section; error?: string }> {
  try {
    const record = await pb
      .collection('sections')
      .update<RecordModel>(id, data);
    return { success: true, section: mapRecordToSection(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a section from the database.
 */
export async function deleteSection(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await pb.collection('sections').delete(id);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
