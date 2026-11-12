'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { InterestsAndObjectives } from '@/types/interests-and-objectives';

import { executeQueryFirst, executeUpdate } from './base';

const defaultInterestsData: InterestsAndObjectives = {
  content: `I write articles about diplomacy, economy, climate, and conflicts, with a primary interest in climate and renewable energy in Southeast Asia.

## Objectives

- Analyze the impact of climate policies on regional economies and international relations.
- Explore sustainable energy solutions and their role in diplomacy.
- Report on conflicts and geopolitical issues related to resource management and environmental change.

Through my work, I aim to contribute to discussions on sustainable development and how climate policies shape global relations.`,
};

interface InterestsRow {
  id: number;
  content: string;
}

function mapRowToInterests(row: InterestsRow): InterestsAndObjectives {
  return { content: row.content || '' };
}

export async function getInterestsAndObjectives(): Promise<InterestsAndObjectives> {
  try {
    const row = await executeQueryFirst<InterestsRow>(
      'SELECT * FROM interests_objectives ORDER BY RANDOM() LIMIT 1',
    );

    if (row) return mapRowToInterests(row);
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
    let content: string;

    if (data instanceof FormData) {
      id = (data.get('id') as string) || '1';
      content = (data.get('content') as string) || '';
    } else {
      id = data.id || '1';
      content = data.content || '';
    }

    await executeUpdate(
      `INSERT INTO interests_objectives (id, content)
       VALUES (?, ?)
       ON CONFLICT(id) DO UPDATE SET
         content = excluded.content,
         updated_at = unixepoch()`,
      [id, content],
    );

    revalidatePath('/');
    revalidatePath('/database/interests-and-objectives');
    revalidateTag('interestsAndObjectives', 'max');

    return { success: true, data: await getInterestsAndObjectives() };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
