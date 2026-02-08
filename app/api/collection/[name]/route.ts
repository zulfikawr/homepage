import { NextRequest } from 'next/server';
import { z } from 'zod';

import * as booksDB from '@/database/books';
import * as certsDB from '@/database/certificates';
import * as customizationDB from '@/database/customization';
import * as employmentsDB from '@/database/employments';
import * as feedbackDB from '@/database/feedback';
import * as interestsDB from '@/database/interests-and-objectives';
import * as moviesDB from '@/database/movies';
import * as personalInfoDB from '@/database/personal-info';
import * as postsDB from '@/database/posts';
import * as projectsDB from '@/database/projects';
import * as publicationsDB from '@/database/publications';
import * as resumeDB from '@/database/resume';
import * as sectionsDB from '@/database/sections';
import {
  apiError,
  apiSuccess,
  handleApiError,
  validateSearchParams,
} from '@/lib/api';
import { getDB } from '@/lib/cloudflare';

const TABLE_MAP: Record<string, string> = {
  profile: 'personal_info',
  readingList: 'books',
  interestsAndObjectives: 'interests_objectives',
};

const WHITELIST = [
  'posts',
  'projects',
  'books',
  'certificates',
  'employments',
  'publications',
  'sections',
  'personal_info',
  'interests_objectives',
  'feedback',
  'comments',
  'resume',
  'analytics_events',
  'movies',
  'customization_settings',
];

const deleteSchema = z.object({
  id: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string }> },
) {
  try {
    let { name } = await context.params;
    name = name.replace(/\/$/, '');

    const db = getDB();
    if (!db) return apiError('Database not available', 500);

    const table = TABLE_MAP[name] || name;

    if (!WHITELIST.includes(table)) {
      return apiError('Invalid collection', 400);
    }

    const { results } = await db.prepare(`SELECT * FROM ${table}`).all();

    return apiSuccess({ results });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  try {
    const contentType = request.headers.get('content-type') || '';
    const data = (await (contentType.includes('multipart/form-data')
      ? request.formData()
      : request.json())) as Record<string, unknown> | FormData;

    let result;
    switch (name) {
      case 'posts':
        result = await postsDB.createPost(
          data as Parameters<typeof postsDB.createPost>[0],
        );
        break;
      case 'projects':
        result = await projectsDB.createProject(
          data as Parameters<typeof projectsDB.createProject>[0],
        );
        break;
      case 'readingList':
      case 'books':
        result = await booksDB.createBook(
          data as Parameters<typeof booksDB.createBook>[0],
        );
        break;
      case 'certificates':
        result = await certsDB.createCertificate(
          data as Parameters<typeof certsDB.createCertificate>[0],
        );
        break;
      case 'employments':
        result = await employmentsDB.createEmployment(
          data as Parameters<typeof employmentsDB.createEmployment>[0],
        );
        break;
      case 'publications':
        result = await publicationsDB.createPublication(
          data as Parameters<typeof publicationsDB.createPublication>[0],
        );
        break;
      case 'sections':
        result = await sectionsDB.createSection(
          data as Parameters<typeof sectionsDB.createSection>[0],
        );
        break;
      case 'movies':
        result = await moviesDB.createMovie(
          data as Parameters<typeof moviesDB.createMovie>[0],
        );
        break;
      default:
        return apiError('POST not supported for this collection', 405);
    }

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  try {
    const contentType = request.headers.get('content-type') || '';
    const data = (await (contentType.includes('multipart/form-data')
      ? request.formData()
      : request.json())) as Record<string, unknown> | FormData;

    let result;
    switch (name) {
      case 'posts': {
        const id =
          data instanceof FormData
            ? (data.get('id') as string)
            : (data.id as string);
        result = await postsDB.updatePost(
          id,
          data as Parameters<typeof postsDB.updatePost>[1],
        );
        break;
      }
      case 'projects':
        result = await projectsDB.updateProject(
          data as Parameters<typeof projectsDB.updateProject>[0],
        );
        break;
      case 'readingList':
      case 'books':
        result = await booksDB.updateBook(
          data as Parameters<typeof booksDB.updateBook>[0],
        );
        break;
      case 'certificates':
        result = await certsDB.updateCertificate(
          data as Parameters<typeof certsDB.updateCertificate>[0],
        );
        break;
      case 'employments':
        result = await employmentsDB.updateEmployment(
          data as Parameters<typeof employmentsDB.updateEmployment>[0],
        );
        break;
      case 'publications':
        result = await publicationsDB.updatePublication(
          data as Parameters<typeof publicationsDB.updatePublication>[0],
        );
        break;
      case 'sections':
        result = await sectionsDB.updateSection(
          data as Parameters<typeof sectionsDB.updateSection>[0],
        );
        break;
      case 'movies':
        result = await moviesDB.updateMovie(
          data as Parameters<typeof moviesDB.updateMovie>[0],
        );
        break;
      case 'profile':
        result = await personalInfoDB.updatePersonalInfo(
          data as Parameters<typeof personalInfoDB.updatePersonalInfo>[0],
        );
        break;
      case 'interestsAndObjectives':
        result = await interestsDB.updateInterestsAndObjectives(
          data as Parameters<
            typeof interestsDB.updateInterestsAndObjectives
          >[0],
        );
        break;
      case 'customization_settings':
        result = await customizationDB.updateCustomizationSettings(
          data as Parameters<
            typeof customizationDB.updateCustomizationSettings
          >[0],
        );
        break;
      case 'resume':
        result = await resumeDB.updateResume(
          data as Parameters<typeof resumeDB.updateResume>[0],
        );
        break;
      default:
        return apiError('PUT not supported for this collection', 405);
    }

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  try {
    const validation = await validateSearchParams(request, deleteSchema);
    if ('error' in validation) return validation.error;

    const { id } = validation.data;

    let result;
    switch (name) {
      case 'posts':
        result = await postsDB.deletePost(id);
        break;
      case 'projects':
        result = await projectsDB.deleteProject(id);
        break;
      case 'readingList':
      case 'books':
        result = await booksDB.deleteBook(id);
        break;
      case 'certificates':
        result = await certsDB.deleteCertificate(id);
        break;
      case 'employments':
        result = await employmentsDB.deleteEmployment(id);
        break;
      case 'publications':
        result = await publicationsDB.deletePublication(id);
        break;
      case 'sections':
        result = await sectionsDB.deleteSection(id);
        break;
      case 'movies':
        result = await moviesDB.deleteMovie(id);
        break;
      case 'feedback':
        result = await feedbackDB.deleteFeedback(id);
        break;
      default:
        return apiError('DELETE not supported for this collection', 405);
    }

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
