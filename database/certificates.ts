'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getBucket, getDB } from '@/lib/cloudflare';
import { Certificate } from '@/types/certificate';

interface CertificateRow {
  [key: string]: unknown;
  id: string;
  slug: string;
  title: string;
  issued_by: string;
  date_issued: string;
  credential_id: string;
  image_url: string;
  organization_logo_url: string;
  link: string;
}

function mapRowToCertificate(row: CertificateRow | null): Certificate | null {
  if (!row) return null;
  const image_key = row.image_url;
  const logo_key = row.organization_logo_url;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    issued_by: row.issued_by,
    date_issued: row.date_issued,
    credential_id: row.credential_id,
    image: image_key ? `/api/storage/${image_key}` : '',
    image_url: image_key || '',
    organization_logo: logo_key ? `/api/storage/${logo_key}` : '',
    organization_logo_url: logo_key || '',
    link: row.link,
  };
}

async function uploadFile(file: File, prefix: string): Promise<string> {
  const bucket = getBucket();
  if (!bucket) throw new Error('Storage binding (BUCKET) not found');
  const key = `${prefix}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const arrayBuffer = await file.arrayBuffer();
  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });
  return `/api/storage/${key}`;
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const db = getDB();
    if (!db) return [];
    const { results } = await db
      .prepare('SELECT * FROM certificates ORDER BY created_at DESC')
      .all<CertificateRow>();
    return results
      .map(mapRowToCertificate)
      .filter((c): c is Certificate => c !== null);
  } catch (error) {
    console.error('[Database] Failed to fetch certificates:', error);
    return [];
  }
}

export async function addCertificate(
  data: Omit<Certificate, 'id'> | FormData,
): Promise<{ success: boolean; certificate?: Certificate; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    const id = crypto.randomUUID();
    let payload: Partial<Certificate> = {};

    if (data instanceof FormData) {
      payload.title = data.get('title') as string;
      payload.slug = data.get('slug') as string;
      payload.issued_by = data.get('issued_by') as string;
      payload.date_issued = data.get('date_issued') as string;
      payload.credential_id = data.get('credential_id') as string;
      payload.link = data.get('link') as string;

      const imageFile = data.get('image') as File | null;
      const imageUrlInput = data.get('image_url') as string | null;
      if (imageFile && imageFile.size > 0) {
        payload.image_url = await uploadFile(imageFile, 'cert');
      } else if (imageUrlInput) {
        payload.image_url = imageUrlInput.replace('/api/storage/', '');
      }

      const logoFile = data.get('organization_logo') as File | null;
      const logoUrlInput = data.get('organization_logo_url') as string | null;
      if (logoFile && logoFile.size > 0) {
        payload.organization_logo_url = await uploadFile(logoFile, 'logo');
      } else if (logoUrlInput) {
        payload.organization_logo_url = logoUrlInput.replace(
          '/api/storage/',
          '',
        );
      }
    } else {
      payload = { ...data };
    }

    if (!payload.slug) {
      payload.slug =
        payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;
    }

    await db
      .prepare(
        `INSERT INTO certificates (id, slug, title, issued_by, date_issued, credential_id, image_url, organization_logo_url, link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        payload.slug,
        payload.title,
        payload.issued_by,
        payload.date_issued,
        payload.credential_id,
        payload.image_url || '',
        payload.organization_logo_url || '',
        payload.link || '',
      )
      .run();

    revalidatePath('/certs');
    revalidatePath('/database/certs');
    revalidateTag('certificates', 'max');

    const newCert = await getCertificateById(id);
    if (!newCert)
      throw new Error('Failed to retrieve certificate after creation');

    return { success: true, certificate: newCert };
  } catch (error) {
    console.error('[Database] Failed to add certificate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateCertificate(
  data: Certificate | FormData,
): Promise<{ success: boolean; certificate?: Certificate; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    let recordId =
      data instanceof FormData ? (data.get('id') as string) : data.id;
    const existing = await getCertificateById(recordId);
    if (!existing) return { success: false, error: 'Certificate not found' };
    recordId = existing.id;

    let payload: Partial<Certificate> = {};
    if (data instanceof FormData) {
      payload.title = data.get('title') as string;
      payload.slug = data.get('slug') as string;
      payload.issued_by = data.get('issued_by') as string;
      payload.date_issued = data.get('date_issued') as string;
      payload.credential_id = data.get('credential_id') as string;
      payload.link = data.get('link') as string;
      const imageFile = data.get('image') as File | null;
      const imageUrlInput = data.get('image_url') as string | null;
      if (imageFile && imageFile.size > 0) {
        payload.image_url = await uploadFile(imageFile, 'cert');
      } else if (imageUrlInput) {
        payload.image_url = imageUrlInput.replace('/api/storage/', '');
      }

      const logoFile = data.get('organization_logo') as File | null;
      const logoUrlInput = data.get('organization_logo_url') as string | null;
      if (logoFile && logoFile.size > 0) {
        payload.organization_logo_url = await uploadFile(logoFile, 'logo');
      } else if (logoUrlInput) {
        payload.organization_logo_url = logoUrlInput.replace(
          '/api/storage/',
          '',
        );
      }
    } else {
      payload = { ...data };
    }

    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    if (payload.title !== undefined) {
      fields.push('title = ?');
      values.push(payload.title);
    }
    if (payload.slug !== undefined) {
      fields.push('slug = ?');
      values.push(payload.slug);
    }
    if (payload.issued_by !== undefined) {
      fields.push('issued_by = ?');
      values.push(payload.issued_by);
    }
    if (payload.date_issued !== undefined) {
      fields.push('date_issued = ?');
      values.push(payload.date_issued);
    }
    if (payload.credential_id !== undefined) {
      fields.push('credential_id = ?');
      values.push(payload.credential_id);
    }
    if (payload.link !== undefined) {
      fields.push('link = ?');
      values.push(payload.link);
    }
    if (payload.image_url !== undefined) {
      fields.push('image_url = ?');
      values.push(payload.image_url);
    }
    if (payload.organization_logo_url !== undefined) {
      fields.push('organization_logo_url = ?');
      values.push(payload.organization_logo_url);
    }

    if (fields.length > 0) {
      values.push(recordId);
      await db
        .prepare(`UPDATE certificates SET ${fields.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();
    }

    revalidatePath('/certs');
    revalidatePath('/database/certs');
    revalidateTag('certificates', 'max');

    const updated = await getCertificateById(recordId);
    return { success: true, certificate: updated! };
  } catch (error) {
    console.error('[Database] Failed to update certificate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteCertificate(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    const existing = await getCertificateById(id);
    if (!existing) return { success: false, error: 'Certificate not found' };
    await db
      .prepare('DELETE FROM certificates WHERE id = ?')
      .bind(existing.id)
      .run();
    revalidatePath('/certs');
    revalidatePath('/database/certs');
    revalidateTag('certificates', 'max');
    return { success: true };
  } catch (error) {
    console.error('[Database] Failed to delete certificate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getCertificateById(
  id: string,
): Promise<Certificate | null> {
  try {
    const db = getDB();
    if (!db) return null;
    const row = await db
      .prepare('SELECT * FROM certificates WHERE id = ? OR slug = ?')
      .bind(id, id)
      .first<CertificateRow>();
    return mapRowToCertificate(row);
  } catch (error) {
    console.error('[Database] Failed to get certificate by ID:', error);
    return null;
  }
}
