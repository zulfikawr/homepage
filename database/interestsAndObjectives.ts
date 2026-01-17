import pb from '@/lib/pocketbase';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';
import { RecordModel } from 'pocketbase';

const COLLECTION = 'interests_and_objectives';
const RECORD_ID = 'mainxxxxxxxxxxx';

const defaultData: InterestsAndObjectives = {
  description: 'Default description.',
  objectives: ['Objective 1'],
  conclusion: 'Conclusion.',
};

/**
 * Subscribes to interests and objectives data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function interestsAndObjectivesData(
  callback: (data: InterestsAndObjectives) => void,
) {
  const fetchOne = async () => {
    try {
      const record = await pb
        .collection(COLLECTION)
        .getOne<RecordModel>(RECORD_ID);
      callback({
        description: record.description,
        conclusion: record.conclusion,
        objectives:
          typeof record.objectives === 'string'
            ? JSON.parse(record.objectives)
            : record.objectives,
      });
    } catch {
      callback(defaultData);
    }
  };

  fetchOne();

  pb.collection(COLLECTION).subscribe(RECORD_ID, (e) => {
    const record = e.record;
    callback({
      description: record.description,
      conclusion: record.conclusion,
      objectives:
        typeof record.objectives === 'string'
          ? JSON.parse(record.objectives)
          : record.objectives,
    } as unknown as InterestsAndObjectives);
  });

  return () => pb.collection(COLLECTION).unsubscribe(RECORD_ID);
}

/**
 * Fetches the interests and objectives from the database.
 * @returns Promise with interests and objectives data.
 */
export async function getInterestsAndObjectives(): Promise<InterestsAndObjectives> {
  try {
    const record = await pb
      .collection(COLLECTION)
      .getOne<RecordModel>(RECORD_ID);
    return {
      description: record.description,
      conclusion: record.conclusion,
      objectives:
        typeof record.objectives === 'string'
          ? JSON.parse(record.objectives)
          : record.objectives,
    };
  } catch {
    return defaultData;
  }
}

/**
 * Updates the interests and objectives data.
 * @param data New interests and objectives data.
 * @returns Promise with operation result.
 */
export async function updateInterestsAndObjectives(
  data: InterestsAndObjectives,
): Promise<{
  success: boolean;
  data?: InterestsAndObjectives;
  error?: string;
}> {
  try {
    const record = await pb
      .collection(COLLECTION)
      .update<InterestsAndObjectives>(RECORD_ID, data);
    return { success: true, data: record };
  } catch (error: unknown) {
    try {
      const record = await pb
        .collection(COLLECTION)
        .create<InterestsAndObjectives>({ id: RECORD_ID, ...data });
      return { success: true, data: record };
    } catch (createError: unknown) {
      return {
        success: false,
        error:
          createError instanceof Error
            ? createError.message
            : String(createError),
      };
    }
  }
}
