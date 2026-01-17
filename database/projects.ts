import pb from '@/lib/pocketbase';
import { Project } from '@/types/project';
import { RecordModel } from 'pocketbase';

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
      const data: Project[] = records.map((record) => ({
        id: record.id,
        name: record.name,
        dateString: record.dateString,
        image: record.image,
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
      }));
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
    return records.map((record) => ({
      id: record.id,
      name: record.name,
      dateString: record.dateString,
      image: record.image,
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
    }));
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
    const record = await pb.collection('projects').create<Project>(data);
    return { success: true, project: record };
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
    const record = await pb
      .collection('projects')
      .update<Project>(recordId, rest);
    return { success: true, project: record };
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
    return {
      id: record.id,
      name: record.name,
      dateString: record.dateString,
      image: record.image,
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
  } catch {
    return null;
  }
}
