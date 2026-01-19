import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';
import { Post } from '@/types/post';
import { Project } from '@/types/project';
import { Book } from '@/types/book';
import { Publication } from '@/types/publication';

export type SearchResult =
  | { type: 'post'; data: Post }
  | { type: 'project'; data: Project }
  | { type: 'book'; data: Book }
  | { type: 'publication'; data: Publication };

/**
 * Maps a PocketBase record to a Post object with full URLs for files.
 */
function mapRecordToPost(record: RecordModel): Post {
  let image = (record.image as string) || (record.image_url as string) || '';
  if (image && !image.startsWith('http') && !image.startsWith('/')) {
    image = pb.files.getURL(
      { collectionName: 'posts', id: record.id } as unknown as RecordModel,
      image,
    );
  }
  let audio = (record.audio as string) || (record.audio_url as string) || '';
  if (audio && !audio.startsWith('http') && !audio.startsWith('/')) {
    audio = pb.files.getURL(
      { collectionName: 'posts', id: record.id } as unknown as RecordModel,
      audio,
    );
  }
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    excerpt: record.excerpt,
    dateString: record.dateString,
    image,
    image_url: record.image_url,
    audio,
    audio_url: record.audio_url,
    slug: record.slug,
    categories:
      typeof record.categories === 'string'
        ? JSON.parse(record.categories)
        : record.categories,
  };
}

/**
 * Maps a PocketBase record to a Project object.
 */
function mapRecordToProject(record: RecordModel): Project {
  let image = (record.image as string) || (record.image_url as string) || '';
  if (image && !image.startsWith('http') && !image.startsWith('/')) {
    image = pb.files.getURL(
      { collectionName: 'projects', id: record.id } as unknown as RecordModel,
      image,
    );
  }
  let favicon =
    (record.favicon as string) || (record.favicon_url as string) || '';
  if (favicon && !favicon.startsWith('http') && !favicon.startsWith('/')) {
    favicon = pb.files.getURL(
      { collectionName: 'projects', id: record.id } as unknown as RecordModel,
      favicon,
    );
  }
  return {
    id: record.id,
    name: record.name,
    dateString: record.dateString,
    image,
    description: record.description,
    tools:
      typeof record.tools === 'string'
        ? JSON.parse(record.tools)
        : record.tools,
    readme: record.readme,
    status: record.status,
    link: record.link,
    favicon,
    pinned: record.pinned,
    slug: record.slug,
  };
}

/**
 * Maps a PocketBase record to a Book object.
 */
function mapRecordToBook(record: RecordModel): Book {
  return {
    id: record.id,
    slug: record.slug,
    type: record.type,
    title: record.title,
    author: record.author,
    imageURL: record.imageURL,
    link: record.link,
    dateAdded: record.dateAdded,
  };
}

/**
 * Maps a PocketBase record to a Publication object.
 */
function mapRecordToPublication(record: RecordModel): Publication {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    publisher: record.publisher,
    link: record.link,
    openAccess: record.openAccess,
    excerpt: record.excerpt,
    authors:
      typeof record.authors === 'string'
        ? JSON.parse(record.authors)
        : record.authors,
    keywords:
      typeof record.keywords === 'string'
        ? JSON.parse(record.keywords)
        : record.keywords,
  };
}

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
        .getList<RecordModel>(1, 3, { filter, sort: '-created' }),
      pb.collection('projects').getList<RecordModel>(1, 3, {
        filter: projectFilter,
        sort: '-created',
      }),
      pb
        .collection('reading_list')
        .getList<RecordModel>(1, 3, { filter: bookFilter, sort: '-created' }),
      pb.collection('publications').getList<RecordModel>(1, 3, {
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
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
