import { database, ref, get, set, remove } from 'lib/firebase';
import { Employment } from 'types/employment';

/**
 * Fetch all employments from Firebase
 * @returns Promise with array of employment data
 */
export async function getEmployments(): Promise<Employment[]> {
  try {
    const employmentsRef = ref(database, 'employments');
    const snapshot = await get(employmentsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const employments = Object.entries(data).map(
        ([id, employment]: [string, Omit<Employment, 'id'>]) => ({
          id,
          ...employment,
        }),
      );
      return employments;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching employments:', error);
    return [];
  }
}

/**
 * Add a new employment to Firebase
 * @param data Employment data to add
 * @returns Promise with operation result
 */
export async function addEmployment(
  data: Employment,
): Promise<{ success: boolean; employment?: Employment; error?: string }> {
  try {
    const {
      id,
      organization,
      jobTitle,
      jobType,
      responsibilities,
      dateString,
    } = data;

    // Validate required fields
    if (
      !id ||
      !organization ||
      !jobTitle ||
      !jobType ||
      !dateString ||
      !responsibilities
    ) {
      return {
        success: false,
        error: 'Missing required fields',
      };
    }

    const newEmployment: Employment = {
      ...data,
      orgLogoSrc: data.orgLogoSrc || '/images/placeholder.png',
    };

    const newEmploymentRef = ref(database, `employments/${id}`);
    await set(newEmploymentRef, newEmployment);

    return {
      success: true,
      employment: newEmployment,
    };
  } catch (error) {
    console.error('Error adding employment:', error);
    return {
      success: false,
      error: 'Failed to add employment',
    };
  }
}

/**
 * Update an existing employment in Firebase
 * @param data Updated employment data
 * @returns Promise with operation result
 */
export async function updateEmployment(
  data: Employment,
): Promise<{ success: boolean; employment?: Employment; error?: string }> {
  try {
    const {
      id,
      organization,
      jobTitle,
      jobType,
      responsibilities,
      dateString,
    } = data;

    // Validate required fields
    if (
      !id ||
      !organization ||
      !jobTitle ||
      !jobType ||
      !dateString ||
      !responsibilities
    ) {
      return {
        success: false,
        error: 'Missing required fields',
      };
    }

    const updatedEmployment: Employment = {
      ...data,
      orgLogoSrc: data.orgLogoSrc || '/images/placeholder.png',
    };

    const employmentRef = ref(database, `employments/${id}`);
    await set(employmentRef, updatedEmployment);

    return {
      success: true,
      employment: updatedEmployment,
    };
  } catch (error) {
    console.error('Error updating employment:', error);
    return {
      success: false,
      error: 'Failed to update employment',
    };
  }
}

/**
 * Delete an employment from Firebase
 * @param id ID of the employment to delete
 * @returns Promise with operation result
 */
export async function deleteEmployment(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Employment ID is required',
      };
    }

    const employmentRef = ref(database, `employments/${id}`);
    await remove(employmentRef);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting employment:', error);
    return {
      success: false,
      error: 'Failed to delete employment',
    };
  }
}
