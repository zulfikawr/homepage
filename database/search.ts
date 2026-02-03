'use server';

import { getDB } from '@/lib/cloudflare';
import { Book } from '@/types/book';
import { Post } from '@/types/post';
import { Project } from '@/types/project';
import { Publication } from '@/types/publication';

export type SearchResult =
  | { type: 'post'; data: Post }
  | { type: 'project'; data: Project }
  | { type: 'book'; data: Book }
  | { type: 'publication'; data: Publication };

interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date_string: string;
}

interface ProjectRow {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface BookRow {
  id: string;
  title: string;
  author: string;
  slug: string;
}

interface PublicationRow {
  id: string;
  title: string;
  slug: string;
}

export async function searchDatabase(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const db = getDB();
  if (!db) return [];

  const searchTerms = `%${query.toLowerCase().trim()}%`;

  try {
    const [posts, projects, books, publications] = await Promise.all([
      db
        .prepare(
          'SELECT id, title, slug, excerpt, date_string FROM posts WHERE title LIKE ? OR content LIKE ? OR excerpt LIKE ? LIMIT 5',
        )
        .bind(searchTerms, searchTerms, searchTerms)
        .all<PostRow>(),
      db
        .prepare(
          'SELECT id, name, slug, description FROM projects WHERE name LIKE ? OR description LIKE ? OR readme LIKE ? LIMIT 5',
        )
        .bind(searchTerms, searchTerms, searchTerms)
        .all<ProjectRow>(),
      db
        .prepare(
          'SELECT id, title, author, slug FROM books WHERE title LIKE ? OR author LIKE ? LIMIT 5',
        )
        .bind(searchTerms, searchTerms)
        .all<BookRow>(),
      db
        .prepare(
          'SELECT id, title, slug FROM publications WHERE title LIKE ? OR excerpt LIKE ? OR publisher LIKE ? LIMIT 5',
        )
        .bind(searchTerms, searchTerms, searchTerms)
        .all<PublicationRow>(),
    ]);

    // Map rows manually since we removed record mappers dependency on PB
    const results: SearchResult[] = [
      ...posts.results.map((row) => ({
        type: 'post' as const,
        data: {
          id: row.id,
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt,
          date_string: row.date_string,
        } as Post,
      })),
      ...projects.results.map((row) => ({
        type: 'project' as const,
        data: {
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
        } as Project,
      })),
      ...books.results.map((row) => ({
        type: 'book' as const,
        data: {
          id: row.id,
          title: row.title,
          author: row.author,
          slug: row.slug,
        } as Book,
      })),
      ...publications.results.map((row) => ({
        type: 'publication' as const,
        data: { id: row.id, title: row.title, slug: row.slug } as Publication,
      })),
    ];

    return results;
  } catch {
    return [];
  }
}
