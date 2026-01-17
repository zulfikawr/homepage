import pb from '@/lib/pocketbase';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';
import { RecordModel } from 'pocketbase';

const COLLECTION = 'interests_and_objectives';

const defaultData: InterestsAndObjectives = {
  description:
    'I write articles about diplomacy, economy, climate, and conflicts, with a primary interest in climate and renewable energy in Southeast Asia.',
  objectives: [
    'Analyze the impact of climate policies on regional economies and international relations.',
    'Explore sustainable energy solutions and their role in diplomacy.',
    'Report on conflicts and geopolitical issues related to resource management and environmental change.',
  ],
  conclusion:
    'Through my work, I aim to contribute to discussions on sustainable development and how climate policies shape global relations.',
};

function mapRecord(
  record: RecordModel,
): InterestsAndObjectives & { id: string } {
  return {
    id: record.id,
    description: record.description,
    conclusion: record.conclusion,
    objectives:
      typeof record.objectives === 'string'
        ? JSON.parse(record.objectives)
        : record.objectives,
  };
}

/**
 * Fetches all interests and objectives and picks a random one.
 * Subscribes to the collection for changes.
 */
export function interestsAndObjectivesData(
  callback: (data: InterestsAndObjectives & { id?: string }) => void,
) {
  const fetchAndCallback = async () => {
    try {
      const records = await pb
        .collection(COLLECTION)
        .getFullList<RecordModel>();

      if (records.length > 0) {
        // Pick a random one
        const randomRecord =
          records[Math.floor(Math.random() * records.length)];
        callback(mapRecord(randomRecord));
      } else {
        callback(defaultData);
      }
    } catch {
      callback(defaultData);
    }
  };

  fetchAndCallback();

  // Subscribe to any change in the collection
  pb.collection(COLLECTION).subscribe('*', fetchAndCallback);

  return () => pb.collection(COLLECTION).unsubscribe();
}

/**
 * Fetches all interests and objectives from the database and picks a random one.
 * @returns Promise with interests and objectives data.
 */
export async function getInterestsAndObjectives(): Promise<InterestsAndObjectives> {
  try {
    const records = await pb.collection(COLLECTION).getFullList<RecordModel>();

    if (records.length > 0) {
      const randomRecord = records[Math.floor(Math.random() * records.length)];
      return mapRecord(randomRecord);
    }
    return defaultData;
  } catch {
    return defaultData;
  }
}

/**
 * Updates an interests and objectives record.
 */
export async function updateInterestsAndObjectives(
  data: InterestsAndObjectives & { id?: string },
): Promise<{
  success: boolean;
  data?: InterestsAndObjectives;
  error?: string;
}> {
  try {
    const id = data.id || 'main';
    const updateData: Record<string, unknown> = { ...data };
    if ('id' in updateData) delete updateData.id;

    let record;
    try {
      record = await pb
        .collection(COLLECTION)
        .update<RecordModel>(id, updateData);
    } catch {
      // If it doesn't exist, create it with the given ID if possible, or let PB generate one
      record = await pb
        .collection(COLLECTION)
        .create<RecordModel>({ id, ...updateData });
    }

    return { success: true, data: mapRecord(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
