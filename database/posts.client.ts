import pb from '@/lib/pocketbase';
import { Post } from '@/types/post';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Post object with full URLs for files.
 */
export function mapRecordToPost(record: RecordModel): Post {
  // Image logic: prioritize file, fallback to text url
  let image = (record.image as string) || (record.image_url as string) || '';
  if (image) {
    if (image.startsWith('http')) {
      // already a full URL
    } else if (image.startsWith('/')) {
      // local asset
    } else {
      // PocketBase filename
      image = pb.files.getURL(
        { collectionName: 'posts', id: record.id } as unknown as RecordModel,
        image,
      );
    }
  }

  // Audio logic: prioritize file, fallback to text url
  let audio = (record.audio as string) || (record.audio_url as string) || '';
  if (audio) {
    if (audio.startsWith('http')) {
      // already a full URL
    } else if (audio.startsWith('/')) {
      // local asset
    } else {
      // PocketBase filename
      audio = pb.files.getURL(
        { collectionName: 'posts', id: record.id } as unknown as RecordModel,
        audio,
      );
    }
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
 * Fetches and subscribes to posts data.
 */
export function postsData(callback: (data: Post[]) => void) {
  const fetchAndCallback = async () => {
    try {
      const records = await pb
        .collection('posts')
        .getFullList<RecordModel>({ sort: '-created' });
      callback(records.map(mapRecordToPost));
    } catch {
      callback([]);
    }
  };

  fetchAndCallback();
  pb.collection('posts').subscribe('*', fetchAndCallback);
  return () => pb.collection('posts').unsubscribe();
}
