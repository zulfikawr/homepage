import pb from '@/lib/pocketbase';
import { Certificate } from '@/types/certificate';
import { RecordModel } from 'pocketbase';

/**
 * Fetches and subscribes to certificates data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function certificatesData(callback: (data: Certificate[]) => void) {
  const fetchAll = async () => {
    try {
      const data = await pb
        .collection('certificates')
        .getFullList<Certificate>({ sort: '-created' });
      callback(data);
    } catch {
      callback([]);
    }
  };

  fetchAll();

  pb.collection('certificates').subscribe('*', fetchAll);

  return () => pb.collection('certificates').unsubscribe();
}

/**
 * Fetches all certificates from the database.
 * @returns Promise with array of certificates.
 */
export async function getCertificates(): Promise<Certificate[]> {
  try {
    return await pb
      .collection('certificates')
      .getFullList<Certificate>({ sort: '-created' });
  } catch {
    return [];
  }
}

/**
 * Adds a new certificate to the database.
 * @param data Certificate data without ID.
 * @returns Promise with operation result.
 */
export async function addCertificate(
  data: Omit<Certificate, 'id'>,
): Promise<{ success: boolean; certificate?: Certificate; error?: string }> {
  try {
    const record = await pb
      .collection('certificates')
      .create<Certificate>(data);
    return { success: true, certificate: record };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing certificate in the database.
 * @param data Updated certificate data.
 * @returns Promise with operation result.
 */
export async function updateCertificate(
  data: Certificate,
): Promise<{ success: boolean; certificate?: Certificate; error?: string }> {
  try {
    const { id, ...rest } = data;
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('certificates')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    const record = await pb
      .collection('certificates')
      .update<Certificate>(recordId, rest);
    return { success: true, certificate: record };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a certificate from the database.
 * @param id ID or slug of the certificate.
 * @returns Promise with operation result.
 */
export async function deleteCertificate(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('certificates')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    await pb.collection('certificates').delete(recordId);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fetches a single certificate by ID or slug.
 * @param id ID or slug of the certificate.
 * @returns Promise with the certificate data or null.
 */
export async function getCertificateById(
  id: string,
): Promise<Certificate | null> {
  try {
    if (id.length === 15) {
      return await pb.collection('certificates').getOne<Certificate>(id);
    }
    return await pb
      .collection('certificates')
      .getFirstListItem<Certificate>(`slug="${id}"`);
  } catch {
    return null;
  }
}
