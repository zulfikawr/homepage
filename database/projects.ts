import pb from '@/lib/pocketbase';
import { Project } from '@/types/project';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Project object with full URLs for images.
 * @param record PocketBase record.
 * @returns Project object.
 */
function mapRecordToProject(record: RecordModel): Project {
  // Prioritize the new 'image' file field, fallback to 'image_url' text field
  let image = (record.image as string) || (record.image_url as string) || '';

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

  // Prioritize the new 'favicon' file field, fallback to 'favicon_url' text field
  let favicon =
    (record.favicon as string) || (record.favicon_url as string) || '';
  if (favicon && !favicon.startsWith('http') && !favicon.startsWith('/')) {
    favicon = pb.files.getUrl(
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
 * Helper to clean project data before sending to PocketBase.
 * Handles file field vs text field URL issues.
 */
function cleanProjectData(data: any): any {
  const clean: any = { ...data };

  // Handle image field (file field vs image_url text field)
  if (clean.image) {
    if (clean.image.includes('/api/files/')) {
      // PocketBase file URL -> extract filename for the file field
      const parts = clean.image.split('/');
      clean.image = parts[parts.length - 1].split('?')[0];
    } else if (clean.image.startsWith('http')) {
      // External URL -> move to image_url and clear image (file field)
      clean.image_url = clean.image;
      clean.image = null;
    }
    // If it's a local asset or already a filename, leave as is
  }

  // Handle favicon field
  if (clean.favicon) {
    if (clean.favicon.includes('/api/files/')) {
      const parts = clean.favicon.split('/');
      clean.favicon = parts[parts.length - 1].split('?')[0];
    } else if (clean.favicon.startsWith('http')) {
      clean.favicon_url = clean.favicon;
      clean.favicon = null;
    }
  }

  // Ensure tools is stringified if it's an array and we're sending JSON
  // (PocketBase usually handles this but being explicit is safer)
  if (Array.isArray(clean.tools)) {
    clean.tools = JSON.stringify(clean.tools);
  }

  // Remove the ID from the body as it's passed in the URL
  delete clean.id;

  return clean;
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
 * @param data Project data or FormData.
 * @returns Promise with operation result.
 */
export async function addProject(
  data: Omit<Project, 'id'> | FormData,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const payload = data instanceof FormData ? data : cleanProjectData(data);
    const record = await pb.collection('projects').create<RecordModel>(payload);
    return { success: true, project: mapRecordToProject(record) };
  } catch (error: any) {
    console.error('PocketBase create error:', error.data || error);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

/**
 * Updates an existing project in the database.
 * @param data Updated project data or FormData.
 * @returns Promise with operation result.
 */
export async function updateProject(
  data: Project | FormData,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    let recordId: string;
    let updateData: any;

    if (data instanceof FormData) {
      recordId = data.get('id') as string;
      updateData = data;
    } else {
      recordId = data.id;

      // Basic slug-to-ID matching if ID is not standard
      if (recordId.length !== 15) {
        try {
          const record = await pb
            .collection('projects')
            .getFirstListItem(`slug="${recordId}"`);
          recordId = record.id;
        } catch {}
      }

      updateData = cleanProjectData(data);
    }

    const record = await pb
      .collection('projects')
      .update<RecordModel>(recordId, updateData);
    return { success: true, project: mapRecordToProject(record) };
  } catch (error: any) {
    console.error('PocketBase update error details:', error.data);
    console.error('PocketBase update error message:', error.message);
    return {
      success: false,
      error: error.message || String(error),
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
    if (id.length === 15) {
      try {
        const record = await pb.collection('projects').getOne<RecordModel>(id);
        if (record) return mapRecordToProject(record);
      } catch (e) {}
    }

    const records = await pb.collection('projects').getFullList<RecordModel>({
      filter: `slug = "${id}"`,
      requestKey: null,
    });

    if (records.length > 0) {
      return mapRecordToProject(records[0]);
    }

    return null;
  } catch (error) {
    console.error('getProjectById error:', error);
    return null;
  }
}