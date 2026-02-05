import { NextRequest, NextResponse } from 'next/server';

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
import { getDB } from '@/lib/cloudflare';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string }> },
) {
  try {
    let { name } = await context.params;
    // Remove trailing slash if present
    name = name.replace(/\/$/, '');

    const db = getDB();
    if (!db)
      return NextResponse.json({ error: 'DB not available' }, { status: 500 });

    const tableMap: Record<string, string> = {
      profile: 'personal_info',
      readingList: 'books',
      interestsAndObjectives: 'interests_objectives',
    };

    const table = tableMap[name] || name;

    const whitelist = [
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

    if (!whitelist.includes(table)) {
      return NextResponse.json(
        { error: 'Invalid collection' },
        { status: 400 },
      );
    }

    const { results } = await db.prepare(`SELECT * FROM ${table}`).all();

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Collection API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
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
        result = await postsDB.addPost(
          data as Parameters<typeof postsDB.addPost>[0],
        );
        break;
      case 'projects':
        result = await projectsDB.addProject(
          data as Parameters<typeof projectsDB.addProject>[0],
        );
        break;
      case 'readingList':
      case 'books':
        result = await booksDB.addBook(
          data as Parameters<typeof booksDB.addBook>[0],
        );
        break;
      case 'certificates':
        result = await certsDB.addCertificate(
          data as Parameters<typeof certsDB.addCertificate>[0],
        );
        break;
      case 'employments':
        result = await employmentsDB.addEmployment(
          data as Parameters<typeof employmentsDB.addEmployment>[0],
        );
        break;
      case 'publications':
        result = await publicationsDB.addPublication(
          data as Parameters<typeof publicationsDB.addPublication>[0],
        );
        break;
      case 'sections':
        result = await sectionsDB.addSection(
          data as Parameters<typeof sectionsDB.addSection>[0],
        );
        break;
      case 'movies':
        result = await moviesDB.addMovie(
          data as Parameters<typeof moviesDB.addMovie>[0],
        );
        break;
      default:
        return NextResponse.json(
          { error: 'POST not supported for this collection' },
          { status: 405 },
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`API POST error for ${name}:`, error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
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
        return NextResponse.json(
          { error: 'PUT not supported for this collection' },
          { status: 405 },
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`API PUT error for ${name}:`, error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id)
      return NextResponse.json({ error: 'ID required' }, { status: 400 });

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
        return NextResponse.json(
          { error: 'DELETE not supported for this collection' },
          { status: 405 },
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`API DELETE error for ${name}:`, error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
