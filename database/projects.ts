'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getBucket, getDB } from '@/lib/cloudflare';
import { mapRecordToProject } from '@/lib/mappers';
import { Project } from '@/types/project';

interface ProjectRow {
  [key: string]: unknown;
  id: string;
  slug: string;
  name: string;
  date_string: string;
  image_url: string;
  description: string;
  tools: string;
  readme: string;
  status: string;
  link: string;
  favicon_url: string;
  github_repo_url: string;
  pinned: number;
}

/**
 * Uploads a file to R2 and returns the filename (key).
 */
async function uploadFile(file: File, slug: string): Promise<string> {
  const bucket = getBucket();
  if (!bucket) throw new Error('Storage not available');

  // Use nested folder structure: projects/{slug}/{filename}
  const key = `projects/${slug}/${file.name.replace(/\s+/g, '-')}`;
  const arrayBuffer = await file.arrayBuffer();

  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  return key;
}

/**
 * Fetches all projects from the database.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const db = getDB();
    if (!db) return [];

    const { results } = await db
      .prepare('SELECT * FROM projects ORDER BY created_at DESC')
      .all<ProjectRow>();
    return results.map((row) => mapRecordToProject(row));
  } catch (e) {
    console.error('Error fetching projects:', e);
    return [];
  }
}

/**
 * Fetches a single project by ID or slug.
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const db = getDB();
    if (!db) return null;

    const query = 'SELECT * FROM projects WHERE id = ? OR slug = ?';
    const row = await db.prepare(query).bind(id, id).first<ProjectRow>();

    if (!row) return null;
    return mapRecordToProject(row);
  } catch (e) {
    console.error('Error fetching project:', e);
    return null;
  }
}

/**
 * Adds a new project to the database.
 */
export async function createProject(
  data: Omit<Project, 'id'> | FormData,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const db = getDB();
    const id = crypto.randomUUID();
    let payload: Partial<Project> = {};

    if (data instanceof FormData) {
      // Handle FormData
      payload.name = data.get('name') as string;
      payload.slug = data.get('slug') as string;
      payload.description = data.get('description') as string;
      payload.readme = data.get('readme') as string;
      payload.date_string = data.get('date_string') as string;
      payload.status = data.get('status') as Project['status'];
      payload.link = data.get('link') as string;
      payload.github_repo_url = data.get('github_repo_url') as string;
      payload.pinned = data.get('pinned') === 'true';

      const toolsStr = data.get('tools') as string;
      try {
        payload.tools = JSON.parse(toolsStr);
      } catch {
        payload.tools = [];
      }

      const projectSlug =
        payload.slug ||
        payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
        id;

      const imageFile = data.get('image') as File;
      const imageUrlInput = data.get('image_url') as string;
      if (imageFile && imageFile.size > 0) {
        payload.image_url = await uploadFile(imageFile, projectSlug);
      } else if (imageUrlInput) {
        payload.image_url = imageUrlInput.replace('/api/storage/', '');
      }

      const faviconFile = data.get('favicon') as File;
      const faviconUrlInput = data.get('favicon_url') as string;
      if (faviconFile && faviconFile.size > 0) {
        payload.favicon_url = await uploadFile(faviconFile, projectSlug);
      } else if (faviconUrlInput) {
        payload.favicon_url = faviconUrlInput.replace('/api/storage/', '');
      }
    } else {
      payload = { ...data };
    }

    // Default values
    if (!payload.slug)
      payload.slug =
        payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;

    const toolsJson = JSON.stringify(payload.tools || []);

    await db
      .prepare(
        `INSERT INTO projects (id, slug, name, date_string, image_url, description, tools, readme, status, link, favicon_url, github_repo_url, pinned)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        payload.slug,
        payload.name,
        payload.date_string,
        payload.image_url,
        payload.description,
        toolsJson,
        payload.readme,
        payload.status,
        payload.link,
        payload.favicon_url,
        payload.github_repo_url,
        payload.pinned ? 1 : 0,
      )
      .run();

    revalidatePath('/projects');
    revalidatePath('/database/projects');
    revalidateTag('projects', 'max');

    const newProject = await getProjectById(id);
    return { success: true, project: newProject! };
  } catch (error: unknown) {
    console.error('Add project error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
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
    const db = getDB();
    let recordId: string;
    let payload: Partial<Project> = {};

    if (data instanceof FormData) {
      recordId = data.get('id') as string;
      payload.name = data.get('name') as string;
      payload.slug = data.get('slug') as string;
      payload.description = data.get('description') as string;
      payload.readme = data.get('readme') as string;
      payload.date_string = data.get('date_string') as string;
      payload.status = data.get('status') as Project['status'];
      payload.link = data.get('link') as string;
      payload.github_repo_url = data.get('github_repo_url') as string;

      const pinnedVal = data.get('pinned');
      if (pinnedVal !== null) payload.pinned = pinnedVal === 'true';

      const toolsStr = data.get('tools') as string;
      if (toolsStr) {
        try {
          payload.tools = JSON.parse(toolsStr);
        } catch {
          payload.tools = [];
        }
      }
    } else {
      recordId = data.id;
      payload = { ...data };
    }

    if (!recordId) return { success: false, error: 'ID required' };

    // Resolve ID if slug
    const existing = await getProjectById(recordId);
    if (!existing) return { success: false, error: 'Project not found' };
    const resolvedId = existing.id;

    if (data instanceof FormData) {
      const projectSlug = payload.slug || existing.slug;

      const imageFile = data.get('image') as File;
      const imageUrlInput = data.get('image_url') as string;
      if (imageFile && imageFile.size > 0) {
        payload.image_url = await uploadFile(imageFile, projectSlug);
      } else if (imageUrlInput) {
        payload.image_url = imageUrlInput.replace('/api/storage/', '');
      }

      const faviconFile = data.get('favicon') as File;
      const faviconUrlInput = data.get('favicon_url') as string;
      if (faviconFile && faviconFile.size > 0) {
        payload.favicon_url = await uploadFile(faviconFile, projectSlug);
      } else if (faviconUrlInput) {
        payload.favicon_url = faviconUrlInput.replace('/api/storage/', '');
      }
    }

    // Dynamic Update Query
    const fields: string[] = [];
    const values: (string | number | boolean | null | undefined)[] = [];

    if (payload.name !== undefined) {
      fields.push('name = ?');
      values.push(payload.name);
    }
    if (payload.slug !== undefined) {
      fields.push('slug = ?');
      values.push(payload.slug);
    }
    if (payload.description !== undefined) {
      fields.push('description = ?');
      values.push(payload.description);
    }
    if (payload.readme !== undefined) {
      fields.push('readme = ?');
      values.push(payload.readme);
    }
    if (payload.date_string !== undefined) {
      fields.push('date_string = ?');
      values.push(payload.date_string);
    }
    if (payload.status !== undefined) {
      fields.push('status = ?');
      values.push(payload.status);
    }
    if (payload.link !== undefined) {
      fields.push('link = ?');
      values.push(payload.link);
    }
    if (payload.github_repo_url !== undefined) {
      fields.push('github_repo_url = ?');
      values.push(payload.github_repo_url);
    }
    if (payload.pinned !== undefined) {
      fields.push('pinned = ?');
      values.push(payload.pinned ? 1 : 0);
    }
    if (payload.tools !== undefined) {
      fields.push('tools = ?');
      values.push(JSON.stringify(payload.tools));
    }
    if (payload.image_url !== undefined) {
      fields.push('image_url = ?');
      values.push(payload.image_url);
    }
    if (payload.favicon_url !== undefined) {
      fields.push('favicon_url = ?');
      values.push(payload.favicon_url);
    }

    if (fields.length > 0) {
      values.push(resolvedId);
      await db
        .prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();
    }

    revalidatePath('/projects');
    revalidatePath(`/projects/${payload.slug || existing.slug}`);
    revalidatePath('/database/projects');
    revalidateTag('projects', 'max');

    const updated = await getProjectById(resolvedId);
    return { success: true, project: updated! };
  } catch (error: unknown) {
    console.error('Update project error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
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
    const db = getDB();
    // Resolve ID
    const existing = await getProjectById(id);
    if (!existing) return { success: false, error: 'Project not found' };

    await db
      .prepare('DELETE FROM projects WHERE id = ?')
      .bind(existing.id)
      .run();

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
