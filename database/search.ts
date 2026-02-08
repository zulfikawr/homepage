'use server';

import { Book } from '@/types/book';
import { Post } from '@/types/post';
import { Project } from '@/types/project';
import { Publication } from '@/types/publication';

import { executeQuery } from './base';

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
  image_url: string;
  audio_url: string;
  categories: string;
}

interface ProjectRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  tools: string;
  status: string;
  link: string;
  favicon_url: string;
  github_repo_url: string;
  pinned: number;
  date_string: string;
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

  const searchTerms = `%${query.toLowerCase().trim()}%`;

  try {
    const [posts, projects, books, publications] = await Promise.all([
      executeQuery<PostRow>(
        'SELECT id, title, slug, excerpt, date_string, image_url, audio_url, categories FROM posts WHERE title LIKE ? OR content LIKE ? OR excerpt LIKE ? LIMIT 5',
        [searchTerms, searchTerms, searchTerms],
      ),
      executeQuery<ProjectRow>(
        'SELECT id, name, slug, description, image_url, tools, status, link, favicon_url, github_repo_url, pinned, date_string FROM projects WHERE name LIKE ? OR description LIKE ? OR readme LIKE ? LIMIT 5',
        [searchTerms, searchTerms, searchTerms],
      ),
      executeQuery<BookRow>(
        'SELECT id, title, author, slug FROM books WHERE title LIKE ? OR author LIKE ? LIMIT 5',
        [searchTerms, searchTerms],
      ),
      executeQuery<PublicationRow>(
        'SELECT id, title, slug FROM publications WHERE title LIKE ? OR excerpt LIKE ? OR publisher LIKE ? LIMIT 5',
        [searchTerms, searchTerms, searchTerms],
      ),
    ]);

    const results: SearchResult[] = [
      ...posts.map((row) => ({
        type: 'post' as const,
        data: {
          id: row.id,
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt,
          date_string: row.date_string,
          image_url: row.image_url,
          audio_url: row.audio_url,
          categories: row.categories ? JSON.parse(row.categories) : [],
        } as Post,
      })),
      ...projects.map((row) => ({
        type: 'project' as const,
        data: {
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
          image_url: row.image_url,
          tools: row.tools ? JSON.parse(row.tools) : [],
          status: row.status,
          link: row.link,
          favicon_url: row.favicon_url,
          github_repo_url: row.github_repo_url,
          pinned: !!row.pinned,
          date_string: row.date_string,
        } as Project,
      })),
      ...books.map((row) => ({
        type: 'book' as const,
        data: {
          id: row.id,
          title: row.title,
          author: row.author,
          slug: row.slug,
        } as Book,
      })),
      ...publications.map((row) => ({
        type: 'publication' as const,
        data: { id: row.id, title: row.title, slug: row.slug } as Publication,
      })),
    ];

    return results;
  } catch {
    return [];
  }
}
