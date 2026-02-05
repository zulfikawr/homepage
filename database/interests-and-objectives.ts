'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getDB } from '@/lib/cloudflare';
import { InterestsAndObjectives } from '@/types/interests-and-objectives';

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

/**
 * Fetches interests and objectives from the database and picks a random one.
 */
export async function getInterestsAndObjectives(): Promise<InterestsAndObjectives> {
  try {
    const db = getDB();
    if (!db) return defaultInterestsData;

    // Pick a random row
    const row = await db
      .prepare('SELECT * FROM interests_objectives ORDER BY RANDOM() LIMIT 1')
      .first<InterestsRow>();

    if (row) {
      return mapRowToInterests(row);
    }
    return defaultInterestsData;
  } catch {
    return defaultInterestsData;
  }
}

/**
 * Updates an interests and objectives record.
 */
export async function updateInterestsAndObjectives(
  data: (InterestsAndObjectives & { id?: string }) | FormData,
): Promise<{
  success: boolean;
  data?: InterestsAndObjectives;
  error?: string;
}> {
  try {
    const db = getDB();
    if (!db) throw new Error('DB not available');

    let id: string;
    let description: string;
    let objectivesJson: string;
    let conclusion: string;

    if (data instanceof FormData) {
      id = (data.get('id') as string) || '1';
      description = data.get('description') as string;
      objectivesJson = data.get('objectives') as string;
      conclusion = data.get('conclusion') as string;

      // Validation: ensure objectives is valid JSON
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

    await db
      .prepare(
        `INSERT INTO interests_objectives (id, description, objectives, conclusion)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         description = excluded.description,
         objectives = excluded.objectives,
         conclusion = excluded.conclusion,
         updated_at = unixepoch()`,
      )
      .bind(id, description, objectivesJson, conclusion)
      .run();

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
