'use server';

import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';
import { Post } from '@/types/post';
import { Project } from '@/types/project';
import { Book } from '@/types/book';
import { Publication } from '@/types/publication';
import { cookies } from 'next/headers';
import {
  mapRecordToPost,
  mapRecordToProject,
  mapRecordToBook,
  mapRecordToPublication,
} from '@/lib/mappers';

export type SearchResult =
  | { type: 'post'; data: Post }
  | { type: 'project'; data: Project }
  | { type: 'book'; data: Book }
  | { type: 'publication'; data: Publication };

/**
 * Ensures the PocketBase client is authenticated for server-side operations
 * by loading the auth state from the request cookies.
 */
async function ensureAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('pb_auth');

  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }
}

export async function searchDatabase(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const searchTerms = query.toLowerCase().trim();
  const filter = `title ~ "${searchTerms}" || content ~ "${searchTerms}" || excerpt ~ "${searchTerms}"`;
  const projectFilter = `name ~ "${searchTerms}" || description ~ "${searchTerms}" || readme ~ "${searchTerms}"`;
  const bookFilter = `title ~ "${searchTerms}" || author ~ "${searchTerms}"`;
  const publicationFilter = `title ~ "${searchTerms}" || excerpt ~ "${searchTerms}" || publisher ~ "${searchTerms}"`;

  await ensureAuth();
  try {
    const [posts, projects, books, publications] = await Promise.all([
      pb
        .collection('posts')
        .getList<RecordModel>(1, 10, { filter, sort: '-created' }),
      pb.collection('projects').getList<RecordModel>(1, 10, {
        filter: projectFilter,
        sort: '-created',
      }),
      pb
        .collection('reading_list')
        .getList<RecordModel>(1, 10, { filter: bookFilter, sort: '-created' }),
      pb.collection('publications').getList<RecordModel>(1, 10, {
        filter: publicationFilter,
        sort: '-created',
      }),
    ]);

    const results: SearchResult[] = [
      ...posts.items.map((item) => ({
        type: 'post' as const,
        data: mapRecordToPost(item),
      })),
      ...projects.items.map((item) => ({
        type: 'project' as const,
        data: mapRecordToProject(item),
      })),
      ...books.items.map((item) => ({
        type: 'book' as const,
        data: mapRecordToBook(item),
      })),
      ...publications.items.map((item) => ({
        type: 'publication' as const,
        data: mapRecordToPublication(item),
      })),
    ];

    return results;
  } catch {
    return [];
  }
}
