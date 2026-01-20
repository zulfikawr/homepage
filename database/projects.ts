'use server';

import pb from '@/lib/pocketbase';
import { Project } from '@/types/project';
import { RecordModel } from 'pocketbase';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
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
    } else if (clean.image.startsWith('/')) {
      // Local asset -> move to image_url and clear image (file field)
      clean.image_url = clean.image;
      clean.image = null;
    }
    // If it's already a filename, leave as is
  }

  // Handle favicon field
  if (typeof clean.favicon === 'string') {
    if (clean.favicon.includes('/api/files/')) {
      const parts = clean.favicon.split('/');
      clean.favicon = parts[parts.length - 1].split('?')[0];
    } else if (clean.favicon.startsWith('http')) {
      clean.favicon_url = clean.favicon;
      clean.favicon = null;
    } else if (clean.favicon.startsWith('/')) {
      // Local asset -> move to favicon_url and clear favicon (file field)
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
 * Ensures the PocketBase client is authenticated for server-side operations
 * by loading the auth state from the request cookies.
 */
async function ensureAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('pb_auth');

  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }
}

/**
 * Adds a new project to the database.
 */
export async function addProject(
  data: Omit<Project, 'id'> | FormData,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  await ensureAuth();
  try {
    const payload =
      data instanceof FormData
        ? data
        : (cleanProjectData(data) as Record<string, unknown>);
    const record = await pb.collection('projects').create<RecordModel>(payload);
    const project = mapRecordToProject(record);

    revalidatePath('/projects');
    revalidatePath('/database/projects');
    revalidateTag('projects', 'max');

    return { success: true, project };
  } catch (error: unknown) {
    const pbError = error as { data?: unknown; message?: string };
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
  await ensureAuth();
  try {
    let recordId: string;
    let updateData: Record<string, unknown> | FormData;

    if (data instanceof FormData) {
      recordId = data.get('id') as string;
      // Create a new FormData without the id field to avoid PB errors
      const formData = new FormData();
      data.forEach((value, key) => {
        if (key !== 'id') {
          formData.append(key, value);
        }
      });
      updateData = formData;
    } else {
      recordId = data.id;
      updateData = cleanProjectData(data);
    }

    // Resolve slug to ID if necessary
    if (recordId.length !== 15) {
      const records = await pb.collection('projects').getFullList<RecordModel>({
        filter: `slug = "${recordId}"`,
      });
      if (records.length > 0) {
        recordId = records[0].id;
      }
    } else {
      // Even if 15 chars, check if it's a valid ID or if it's actually a slug
      try {
        await pb.collection('projects').getOne(recordId);
      } catch {
        const records = await pb
          .collection('projects')
          .getFullList<RecordModel>({
            filter: `slug = "${recordId}"`,
          });
        if (records.length > 0) {
          recordId = records[0].id;
        }
      }
    }

    const record = await pb
      .collection('projects')
      .update<RecordModel>(recordId, updateData);
    const project = mapRecordToProject(record);

    revalidatePath('/projects');
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath('/database/projects');
    revalidatePath(`/database/projects/${project.id}/edit`);
    revalidateTag('projects', 'max');

    return { success: true, project };
  } catch (error: unknown) {
    const pbError = error as {
      data?: unknown;
      message?: string;
      status?: number;
    };
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
  await ensureAuth();
  try {
    let recordId = id;
    if (id.length !== 15) {
      const records = await pb.collection('projects').getFullList<RecordModel>({
        filter: `slug = "${id}"`,
      });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('projects').getOne(id);
      } catch {
        const records = await pb
          .collection('projects')
          .getFullList<RecordModel>({
            filter: `slug = "${id}"`,
          });
        if (records.length > 0) recordId = records[0].id;
      }
    }
    await pb.collection('projects').delete(recordId);

    revalidatePath('/projects');
    revalidatePath('/database/projects');
    revalidateTag('projects', 'max');

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
