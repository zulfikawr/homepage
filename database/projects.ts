import pb from '@/lib/pocketbase';
import { Project } from '@/types/project';
import { RecordModel } from 'pocketbase';
import { generateId } from '@/utilities/generateId';

/**
 * Maps a PocketBase record to a Project object with full URLs for images.
 * @param record PocketBase record.
 * @returns Project object.
 */
function mapRecordToProject(record: RecordModel): Project {
  let image = (record.image as string) || '';

  if (image) {
    if (image.startsWith('http')) {
      // already a full URL
    } else if (image.startsWith('/')) {
      // local public asset
    } else {
      // PocketBase filename
      image = pb.files.getUrl(
        { collectionName: 'projects', id: record.id } as unknown as RecordModel,
        image,
      );
    }
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
    favicon: record.favicon,
    pinned: record.pinned,
  };
}

/**
 * Fetches and subscribes to projects data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
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

/**
 * Fetches all projects from the database.
 * @returns Promise with array of projects.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const records = await pb
      .collection('projects')
      .getFullList<RecordModel>({ sort: '-created' });
    return records.map(mapRecordToProject);
  } catch {
    return [];
  }
}

/**
 * Adds a new project to the database.
 * @param data Project data without ID.
 * @returns Promise with operation result.
 */
export async function addProject(
  data: Omit<Project, 'id'>,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const record = await pb.collection('projects').create<RecordModel>(data);
    return { success: true, project: mapRecordToProject(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing project in the database.
 * @param data Updated project data.
 * @returns Promise with operation result.
 */
export async function updateProject(
  data: Project,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const { id, ...rest } = data;
    let recordId = id;
    if (id.length !== 15) {
      try {
        const record = await pb
          .collection('projects')
          .getFirstListItem(`slug="${id}"`);
        recordId = record.id;
      } catch {
        // ID might be correct ID but not 15 chars (unlikely in PB)
      }
    }

    const updateData: Partial<Project> = { ...rest };

    // Extract filename if it's a PocketBase URL
    if (data.image && data.image.includes('/api/files/')) {
      const parts = data.image.split('/');
      const fileName = parts[parts.length - 1].split('?')[0];
      updateData.image = fileName;
    }

    const record = await pb
      .collection('projects')
      .update<RecordModel>(recordId, updateData);
    return { success: true, project: mapRecordToProject(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a project from the database.
 * @param id ID or slug of the project.
 * @returns Promise with operation result.
 */
export async function deleteProject(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('projects')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    await pb.collection('projects').delete(recordId);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fetches a single project by ID or slug.
 * @param id ID or slug of the project.
 * @returns Promise with the project data or null.
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    let record: RecordModel;
    if (id.length === 15) {
      record = await pb.collection('projects').getOne<RecordModel>(id);
    } else {
      record = await pb
        .collection('projects')
        .getFirstListItem<RecordModel>(`slug="${id}"`);
    }
    return mapRecordToProject(record);
  } catch {
    return null;
  }
}
