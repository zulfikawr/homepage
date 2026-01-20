import pb from '@/lib/pocketbase';
import { Project } from '@/types/project';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Project object with full URLs for images.
 * @param record PocketBase record.
 * @returns Project object.
 */
export function mapRecordToProject(record: RecordModel): Project {
  // Prioritize the new 'image' file field, fallback to 'image_url' text field
  let image = (record.image as string) || (record.image_url as string) || '';

  if (image) {
    if (image.startsWith('http')) {
      // already a full URL
    } else if (image.startsWith('/')) {
      // local public asset
    } else {
      // PocketBase filename
      image = pb.files.getURL(
        { collectionName: 'projects', id: record.id } as unknown as RecordModel,
        image,
      );
    }
  }

  // Prioritize the new 'favicon' file field, fallback to 'favicon_url' text field
  let favicon =
    (record.favicon as string) || (record.favicon_url as string) || '';
  if (favicon && !favicon.startsWith('http') && !favicon.startsWith('/')) {
    favicon = pb.files.getURL(
      { collectionName: 'projects', id: record.id } as unknown as RecordModel,
      favicon,
    );
  }

  return {
    id: record.id,
    name: record.name,
    dateString: record.dateString,
    image,
    description: record.description,
    tools:
      typeof record.tools === 'string'
        ? JSON.parse(record.tools)
        : record.tools,
    readme: record.readme,
    status: record.status,
    link: record.link,
    favicon,
    pinned: record.pinned,
    slug: record.slug,
  };
}

/**
 * Fetches and subscribes to projects data.
 */
export function projectsData(callback: (data: Project[]) => void) {
  const fetchAndCallback = async () => {
    try {
      const records = await pb
        .collection('projects')
        .getFullList<RecordModel>({ sort: '-created' });
      const data: Project[] = records.map(mapRecordToProject);
      callback(data);
    } catch {
      callback([]);
    }
  };

  fetchAndCallback();
  pb.collection('projects').subscribe('*', fetchAndCallback);
  return () => pb.collection('projects').unsubscribe();
}
