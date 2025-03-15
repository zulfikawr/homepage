import { generateId } from '@/utilities/generateId';
import { database, ref, get, set, remove } from '@/lib/firebase';
import { Certificate } from '@/types/certificate';

/**
 * Fetch all certificates from Firebase
 * @returns Promise with array of certificates
 */
export async function getCertificates(): Promise<Certificate[]> {
  try {
    const certsRef = ref(database, 'certificates');
    const snapshot = await get(certsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const certificates = Object.entries(data).map(
        ([id, cert]: [string, Omit<Certificate, 'id'>]) => ({
          id,
          ...cert,
        }),
      );
      return certificates;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw new Error('Failed to fetch certificates');
  }
}

/**
 * Add a new certificate to Firebase
 * @param data Certificate data to add
 * @returns Promise with operation result
 */
export async function addCertificate(
  data: Omit<Certificate, 'id'>,
): Promise<{ success: boolean; certificate?: Certificate; error?: string }> {
  try {
    const {
      title,
      issuedBy,
      dateIssued,
      credentialId,
      imageUrl,
      organizationLogoUrl,
      link,
    } = data;

    if (!title || !issuedBy || !dateIssued || !credentialId || !link) {
      return { success: false, error: 'Missing required fields' };
    }

    const newCertificate: Certificate = {
      id: generateId(title),
      title,
      issuedBy,
      dateIssued,
      credentialId,
      imageUrl,
      organizationLogoUrl,
      link,
    };

    const newCertRef = ref(database, `certificates/${newCertificate.id}`);
    await set(newCertRef, newCertificate);

    return { success: true, certificate: newCertificate };
  } catch (error) {
    console.error('Error adding certificate:', error);
    return { success: false, error: 'Failed to add certificate' };
  }
}

/**
 * Update an existing certificate in Firebase
 * @param data Updated certificate data
 * @returns Promise with operation result
 */
export async function updateCertificate(
  data: Certificate,
): Promise<{ success: boolean; certificate?: Certificate; error?: string }> {
  try {
    const {
      id,
      title,
      issuedBy,
      dateIssued,
      credentialId,
      imageUrl,
      organizationLogoUrl,
      link,
    } = data;

    if (!id || !title || !issuedBy || !dateIssued || !credentialId || !link) {
      return { success: false, error: 'Missing required fields' };
    }

    const updatedCertificate: Certificate = {
      id,
      title,
      issuedBy,
      dateIssued,
      credentialId,
      imageUrl,
      organizationLogoUrl,
      link,
    };

    const certRef = ref(database, `certificates/${id}`);
    await set(certRef, updatedCertificate);

    return { success: true, certificate: updatedCertificate };
  } catch (error) {
    console.error('Error updating certificate:', error);
    return { success: false, error: 'Failed to update certificate' };
  }
}

/**
 * Delete a certificate from Firebase
 * @param id ID of the certificate to delete
 * @returns Promise with operation result
 */
export async function deleteCertificate(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) {
      return { success: false, error: 'Certificate ID is required' };
    }

    const certRef = ref(database, `certificates/${id}`);
    await remove(certRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return { success: false, error: 'Failed to delete certificate' };
  }
}
