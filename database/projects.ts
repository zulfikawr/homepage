'use server';

import pb from '@/lib/pocketbase';
import { Project } from '@/types/project';
import { RecordModel } from 'pocketbase';
import { revalidateTag } from 'next/cache';
import { mapRecordToProject } from './projects.client';

/**
 * Helper to clean project data before sending to PocketBase.
 * Handles file field vs text field URL issues.
 */
function cleanProjectData(
  data: Omit<Project, 'id'> | Project,
): Record<string, unknown> {
  const clean: Record<string, unknown> = { ...data };

  // Handle image field (file field vs image_url text field)
  if (typeof clean.image === 'string') {
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
  if (typeof clean.favicon === 'string') {
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
  if ('id' in clean) {
    delete clean.id;
  }

  return clean;
}

/**
 * Fetches all projects from the database.
 */
export async function getProjects(): Promise<Project[]> {
  'use cache';
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
 */
export async function addProject(
  data: Omit<Project, 'id'> | FormData,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const payload =
      data instanceof FormData
        ? data
        : (cleanProjectData(data) as Record<string, unknown>);
    const record = await pb.collection('projects').create<RecordModel>(payload);
    const project = mapRecordToProject(record);
    try {
      revalidateTag('projects', 'max');
    } catch {
      // Ignore
    }
    return { success: true, project };
  } catch (error: unknown) {
    const pbError = error as { data?: unknown; message?: string };
    console.error('PocketBase create error:', pbError.data || pbError);
    return {
      success: false,
      error: pbError.message || String(pbError),
    };
  }
}

/**
 * Updates an existing project in the database.
 */
export async function updateProject(
  data: Project | FormData,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    let recordId: string;
    let updateData: Record<string, unknown> | FormData;

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
        } catch {
          // Ignore error if not found by slug
        }
      }

      updateData = cleanProjectData(data);
    }

    const record = await pb
      .collection('projects')
      .update<RecordModel>(recordId, updateData);
    const project = mapRecordToProject(record);
    try {
      revalidateTag('projects', 'max');
    } catch {
      // Ignore
    }
    return { success: true, project };
  } catch (error: unknown) {
    const pbError = error as { data?: unknown; message?: string };
    console.error('PocketBase update error details:', pbError.data);
    console.error('PocketBase update error message:', pbError.message);
    return {
      success: false,
      error: pbError.message || String(pbError),
    };
  }
}

/**
 * Deletes a project from the database.
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
    try {
      revalidateTag('projects', 'max');
    } catch {
      // Ignore
    }
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
 */
export async function getProjectById(id: string): Promise<Project | null> {
  'use cache';
  try {
    if (id.length === 15) {
      try {
        const record = await pb.collection('projects').getOne<RecordModel>(id);
        if (record) return mapRecordToProject(record);
      } catch {
        // Ignored
      }
    }

    const records = await pb.collection('projects').getFullList<RecordModel>({
      filter: `slug = "${id}"`,
      requestKey: null,
    });

    if (records.length > 0) {
      return mapRecordToProject(records[0]);
    }

    return null;
  } catch {
    return null;
  }
}
