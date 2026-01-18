import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';

export type SearchResult = {
  id: string;
  type: 'post' | 'project' | 'book' | 'publication';
  title: string;
  description: string;
  url: string;
  date?: string;
};

export async function searchDatabase(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const searchTerms = query.toLowerCase().trim();
  const filter = `title ~ "${searchTerms}" || content ~ "${searchTerms}" || excerpt ~ "${searchTerms}"`;
  const projectFilter = `name ~ "${searchTerms}" || description ~ "${searchTerms}" || readme ~ "${searchTerms}"`;
  const bookFilter = `title ~ "${searchTerms}" || author ~ "${searchTerms}"`;
  const publicationFilter = `title ~ "${searchTerms}" || excerpt ~ "${searchTerms}" || publisher ~ "${searchTerms}"`;

  try {
    const [posts, projects, books, publications] = await Promise.all([
      pb
        .collection('posts')
        .getList<RecordModel>(1, 5, { filter, sort: '-created' }),
      pb
        .collection('projects')
        .getList<RecordModel>(1, 5, {
          filter: projectFilter,
          sort: '-created',
        }),
      pb
        .collection('reading_list')
        .getList<RecordModel>(1, 5, { filter: bookFilter, sort: '-created' }),
      pb
        .collection('publications')
        .getList<RecordModel>(1, 5, {
          filter: publicationFilter,
          sort: '-created',
        }),
    ]);

    const results: SearchResult[] = [
      ...posts.items.map((item) => ({
        id: item.id,
        type: 'post' as const,
        title: item.title,
        description:
          item.excerpt ||
          (item.content ? item.content.substring(0, 100) + '...' : ''),
        url: `/post/${item.slug || item.id}`,
        date: item.dateString,
      })),
      ...projects.items.map((item) => ({
        id: item.id,
        type: 'project' as const,
        title: item.name,
        description:
          item.description ||
          (item.readme ? item.readme.substring(0, 100) + '...' : ''),
        url: `/projects#${item.slug || item.id}`,
        date: item.dateString,
      })),
      ...books.items.map((item) => ({
        id: item.id,
        type: 'book' as const,
        title: item.title,
        description: `By ${item.author}`,
        url: `/reading-list`,
      })),
      ...publications.items.map((item) => ({
        id: item.id,
        type: 'publication' as const,
        title: item.title,
        description: item.excerpt || `Published by ${item.publisher}`,
        url: `/publications`,
      })),
    ];

    return results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
