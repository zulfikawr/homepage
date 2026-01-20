import pb from '@/lib/pocketbase';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';
import { RecordModel } from 'pocketbase';

export const COLLECTION = 'interests_and_objectives';

export const defaultInterestsData: InterestsAndObjectives = {
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

export function mapInterestsRecord(
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
        const randomRecord =
          records[Math.floor(Math.random() * records.length)];
        callback(mapInterestsRecord(randomRecord));
      } else {
        callback(defaultInterestsData);
      }
    } catch {
      callback(defaultInterestsData);
    }
  };

  fetchAndCallback();

  pb.collection(COLLECTION).subscribe('*', fetchAndCallback);

  return () => pb.collection(COLLECTION).unsubscribe();
}
