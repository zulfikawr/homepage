'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { InterestsAndObjectives } from '@/types/interests-and-objectives';

import { executeQueryFirst, executeUpdate } from './base';

const defaultInterestsData: InterestsAndObjectives = {
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

interface InterestsRow {
  id: string;
  description: string;
  objectives: string;
  conclusion: string;
}

function mapRowToInterests(row: InterestsRow): InterestsAndObjectives {
  return {
    description: row.description,
    objectives: row.objectives ? JSON.parse(row.objectives) : [],
    conclusion: row.conclusion,
  };
}

export async function getInterestsAndObjectives(): Promise<InterestsAndObjectives> {
  try {
    const row = await executeQueryFirst<InterestsRow>(
      'SELECT * FROM interests_objectives ORDER BY RANDOM() LIMIT 1',
    );

    if (row) {
      return mapRowToInterests(row);
    }
    return defaultInterestsData;
  } catch {
    return defaultInterestsData;
  }
}

export async function updateInterestsAndObjectives(
  data: (InterestsAndObjectives & { id?: string }) | FormData,
): Promise<{
  success: boolean;
  data?: InterestsAndObjectives;
  error?: string;
}> {
  try {
    let id: string;
    let description: string;
    let objectivesJson: string;
    let conclusion: string;

    if (data instanceof FormData) {
      id = (data.get('id') as string) || '1';
      description = data.get('description') as string;
      objectivesJson = data.get('objectives') as string;
      conclusion = data.get('conclusion') as string;

      try {
        JSON.parse(objectivesJson);
      } catch {
        objectivesJson = '[]';
      }
    } else {
      id = data.id || '1';
      description = data.description;
      objectivesJson = JSON.stringify(data.objectives || []);
      conclusion = data.conclusion;
    }

    await executeUpdate(
      `INSERT INTO interests_objectives (id, description, objectives, conclusion)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         description = excluded.description,
         objectives = excluded.objectives,
         conclusion = excluded.conclusion,
         updated_at = unixepoch()`,
      [id, description, objectivesJson, conclusion],
    );

    revalidatePath('/');
    revalidatePath('/database/interests-and-objectives');
    revalidateTag('interestsAndObjectives', 'max');

    const updated = await getInterestsAndObjectives();
    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
