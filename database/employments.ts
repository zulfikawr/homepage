'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getBucket, getDB } from '@/lib/cloudflare';
import { Employment } from '@/types/employment';

interface EmploymentRow {
  [key: string]: unknown;
  id: string;
  slug: string;
  organization: string;
  organization_industry: string;
  job_title: string;
  job_type: string;
  responsibilities: string;
  date_string: string;
  org_logo_url: string;
  organization_location: string;
}

function mapRowToEmployment(row: EmploymentRow | null): Employment | null {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    organization: row.organization,
    jobTitle: row.job_title,
    dateString: row.date_string,
    jobType: row.job_type as Employment['jobType'],
    orgLogoUrl: row.org_logo_url,
    organizationIndustry: row.organization_industry,
    organizationLocation: row.organization_location,
    responsibilities: row.responsibilities
      ? JSON.parse(row.responsibilities)
      : [],
  };
}

/**
 * Uploads a file to R2 and returns the public path.
 */
async function uploadFile(file: File): Promise<string> {
  const bucket = getBucket();
  if (!bucket) throw new Error('Storage binding (BUCKET) not found');

  const key = `org-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const arrayBuffer = await file.arrayBuffer();

  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  return `/api/storage/${key}`;
}

/**
 * Fetches all employment records.
 */
export async function getEmployments(): Promise<Employment[]> {
  try {
    const db = getDB();
    if (!db) return [];

    const { results } = await db
      .prepare('SELECT * FROM employments ORDER BY created_at DESC')
      .all<EmploymentRow>();
    return results
      .map(mapRowToEmployment)
      .filter((e): e is Employment => e !== null);
  } catch (error) {
    console.error('[Database] Failed to fetch employments:', error);
    return [];
  }
}

/**
 * Adds a new employment record.
 */
export async function addEmployment(
  data: Omit<Employment, 'id'> | FormData,
): Promise<{ success: boolean; employment?: Employment; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    const id = crypto.randomUUID();
    let payload: Partial<Employment> = {};

    if (data instanceof FormData) {
      payload.organization = data.get('organization') as string;
      payload.organizationIndustry = data.get('organizationIndustry') as string;
      payload.jobTitle = data.get('jobTitle') as string;
      payload.jobType = data.get('jobType') as Employment['jobType'];
      payload.dateString = data.get('dateString') as string;
      payload.organizationLocation = data.get('organizationLocation') as string;
      payload.slug = data.get('slug') as string;

      const respStr = data.get('responsibilities') as string;
      try {
        payload.responsibilities = JSON.parse(respStr);
      } catch {
        payload.responsibilities = [];
      }

      const logoFile = data.get('orgLogo') as File | null;
      const logoUrlInput = data.get('orgLogoUrl') as string | null;
      if (logoFile && logoFile.size > 0) {
        payload.orgLogoUrl = await uploadFile(logoFile);
      } else if (logoUrlInput) {
        payload.orgLogoUrl = logoUrlInput.replace('/api/storage/', '');
      }
    } else {
      payload = { ...data };
    }

    if (!payload.slug) {
      payload.slug =
        payload.organization?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;
    }
    const respJson = JSON.stringify(payload.responsibilities || []);

    await db
      .prepare(
        `INSERT INTO employments (id, slug, organization, organization_industry, job_title, job_type, responsibilities, date_string, org_logo_url, organization_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        payload.slug,
        payload.organization,
        payload.organizationIndustry,
        payload.jobTitle,
        payload.jobType,
        respJson,
        payload.dateString,
        payload.orgLogoUrl || '',
        payload.organizationLocation || '',
      )
      .run();

    revalidatePath('/');
    revalidatePath('/database/employments');
    revalidateTag('employments', 'max');

    const newEmp = await getEmploymentById(id);
    if (!newEmp)
      throw new Error('Failed to retrieve employment after creation');

    return { success: true, employment: newEmp };
  } catch (error: unknown) {
    console.error('[Database] Failed to add employment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing employment record.
 */
export async function updateEmployment(
  data: Employment | FormData,
): Promise<{ success: boolean; employment?: Employment; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    let recordId: string;

    if (data instanceof FormData) {
      recordId = data.get('id') as string;
    } else {
      recordId = data.id;
    }

    const existing = await getEmploymentById(recordId);
    if (!existing) return { success: false, error: 'Employment not found' };
    recordId = existing.id;

    let payload: Partial<Employment> = {};
    if (data instanceof FormData) {
      payload.organization = data.get('organization') as string;
      payload.organizationIndustry = data.get('organizationIndustry') as string;
      payload.jobTitle = data.get('jobTitle') as string;
      payload.jobType = data.get('jobType') as Employment['jobType'];
      payload.dateString = data.get('dateString') as string;
      payload.organizationLocation = data.get('organizationLocation') as string;
      payload.slug = data.get('slug') as string;

      const respStr = data.get('responsibilities') as string;
      if (respStr) {
        try {
          payload.responsibilities = JSON.parse(respStr);
        } catch {
          payload.responsibilities = [];
        }
      }

      const logoFile = data.get('orgLogo') as File | null;
      const logoUrlInput = data.get('orgLogoUrl') as string | null;
      if (logoFile && logoFile.size > 0) {
        payload.orgLogoUrl = await uploadFile(logoFile);
      } else if (logoUrlInput) {
        payload.orgLogoUrl = logoUrlInput.replace('/api/storage/', '');
      }
    } else {
      payload = { ...data };
    }

    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    if (payload.organization !== undefined) {
      fields.push('organization = ?');
      values.push(payload.organization);
    }
    if (payload.slug !== undefined) {
      fields.push('slug = ?');
      values.push(payload.slug);
    }
    if (payload.organizationIndustry !== undefined) {
      fields.push('organization_industry = ?');
      values.push(payload.organizationIndustry);
    }
    if (payload.jobTitle !== undefined) {
      fields.push('job_title = ?');
      values.push(payload.jobTitle);
    }
    if (payload.jobType !== undefined) {
      fields.push('job_type = ?');
      values.push(payload.jobType);
    }
    if (payload.dateString !== undefined) {
      fields.push('date_string = ?');
      values.push(payload.dateString);
    }
    if (payload.orgLogoUrl !== undefined) {
      fields.push('org_logo_url = ?');
      values.push(payload.orgLogoUrl);
    }
    if (payload.organizationLocation !== undefined) {
      fields.push('organization_location = ?');
      values.push(payload.organizationLocation);
    }
    if (payload.responsibilities !== undefined) {
      fields.push('responsibilities = ?');
      values.push(JSON.stringify(payload.responsibilities));
    }

    if (fields.length > 0) {
      values.push(recordId);
      await db
        .prepare(`UPDATE employments SET ${fields.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();
    }

    revalidatePath('/');
    revalidatePath('/database/employments');
    revalidateTag('employments', 'max');

    const updated = await getEmploymentById(recordId);
    if (!updated) throw new Error('Failed to retrieve employment after update');

    return { success: true, employment: updated };
  } catch (error: unknown) {
    console.error('[Database] Failed to update employment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes an employment record.
 */
export async function deleteEmployment(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    const existing = await getEmploymentById(id);
    if (!existing) return { success: false, error: 'Employment not found' };

    await db
      .prepare('DELETE FROM employments WHERE id = ?')
      .bind(existing.id)
      .run();

    revalidatePath('/');
    revalidatePath('/database/employments');
    revalidateTag('employments', 'max');

    return { success: true };
  } catch (error: unknown) {
    console.error('[Database] Failed to delete employment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fetches a single employment record by ID or slug.
 */
export async function getEmploymentById(
  id: string,
): Promise<Employment | null> {
  try {
    const db = getDB();
    if (!db) return null;

    const query = 'SELECT * FROM employments WHERE id = ? OR slug = ?';
    const row = await db.prepare(query).bind(id, id).first<EmploymentRow>();

    if (!row) return null;
    return mapRowToEmployment(row);
  } catch (error) {
    console.error('[Database] Failed to get employment by ID:', error);
    return null;
  }
}
