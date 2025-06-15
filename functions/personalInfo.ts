import { database, ref, get, set, onValue } from '@/lib/firebase';
import { PersonalInfo } from '@/types/personalInfo';

// Default personal info data
const defaultPersonalInfo: PersonalInfo = {
  name: 'Zulfikar',
  title: 'IR student, journalist, and web developer.',
  avatarUrl: '/avatar.jpg',
};

/**
 * Subscribe to personal info changes in Firebase
 * @param callback Function to call when data changes
 * @returns Unsubscribe function
 */
export function personalInfoData(callback: (data: PersonalInfo) => void) {
  const personalInfoRef = ref(database, 'personalInfo');

  return onValue(personalInfoRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : defaultPersonalInfo;
    callback(data);
  });
}

/**
 * Fetch personal info from Firebase
 * @returns Promise with personal info data
 */
export async function getPersonalInfo(): Promise<PersonalInfo> {
  try {
    const personalInfoRef = ref(database, 'personalInfo');
    const snapshot = await get(personalInfoRef);

    if (snapshot.exists()) {
      return snapshot.val() as PersonalInfo;
    } else {
      // Initialize with default data if none exists
      await set(personalInfoRef, defaultPersonalInfo);
      return defaultPersonalInfo;
    }
  } catch (error) {
    console.error('Error fetching personalInfo:', error);
    // Return default data on error
    return defaultPersonalInfo;
  }
}

/**
 * Update personal info in Firebase
 * @param data Updated personal info data
 * @returns Promise with updated data
 */
export async function updatePersonalInfo(
  data: PersonalInfo,
): Promise<{ success: boolean; data?: PersonalInfo; error?: string }> {
  try {
    if (!data.name || !data.title || !data.avatarUrl) {
      return {
        success: false,
        error: 'Missing required fields',
      };
    }

    const personalInfoRef = ref(database, 'personalInfo');
    await set(personalInfoRef, data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error updating personalInfo:', error);
    return {
      success: false,
      error: 'Failed to update personal info',
    };
  }
}
