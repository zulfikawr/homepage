import { database, ref, get, set } from '@/lib/firebase';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';

// Default interests and objectives data
const defaultInterestsAndObjectives: InterestsAndObjectives = {
  description:
    'This is a default description about my interests and objectives.',
  objectives: [
    'Achieve excellence in my field of work.',
    'Contribute to meaningful projects that make a difference.',
    'Continuously learn and grow both personally and professionally.',
  ],
  conclusion:
    'In conclusion, my interests and objectives drive me to pursue excellence and make a positive impact.',
};

/**
 * Fetch interests and objectives from Firebase
 * @returns Promise with interests and objectives data
 */
export async function getInterestsAndObjectives(): Promise<InterestsAndObjectives> {
  try {
    const interestsAndObjectivesRef = ref(database, 'interestsAndObjectives');
    const snapshot = await get(interestsAndObjectivesRef);

    if (snapshot.exists()) {
      return snapshot.val() as InterestsAndObjectives;
    } else {
      // Initialize with default data if none exists
      await set(interestsAndObjectivesRef, defaultInterestsAndObjectives);
      return defaultInterestsAndObjectives;
    }
  } catch (error) {
    console.error('Error fetching interestsAndObjectives:', error);
    // Return default data on error
    return defaultInterestsAndObjectives;
  }
}

/**
 * Update interests and objectives in Firebase
 * @param data Updated interests and objectives data
 * @returns Promise with updated data
 */
export async function updateInterestsAndObjectives(
  data: InterestsAndObjectives,
): Promise<{
  success: boolean;
  data?: InterestsAndObjectives;
  error?: string;
}> {
  try {
    if (!data.description || !data.objectives || !data.conclusion) {
      return {
        success: false,
        error: 'Missing required fields',
      };
    }

    const interestsAndObjectivesRef = ref(database, 'interestsAndObjectives');
    await set(interestsAndObjectivesRef, data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error updating interestsAndObjectives:', error);
    return {
      success: false,
      error: 'Failed to update interests and objectives',
    };
  }
}
