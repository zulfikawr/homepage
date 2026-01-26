'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { RecordModel } from 'pocketbase';

import pb from '@/lib/pocketbase';
import { Comment } from '@/types/comment';

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

/**
 * Adds a new comment to a post.
 */
export const addComment = async (
  postId: string,
  author: string,
  content: string,
  avatarUrl?: string,
  parentId?: string,
): Promise<string> => {
  await ensureAuth();
  try {
    const data = {
      postId,
      author,
      content,
      avatarUrl,
      parentId,
      likedBy: [],
    };
    const record = await pb.collection('comments').create(data);

    revalidatePath(`/post/${postId}`);
    revalidatePath('/database/comments');

    return record.id;
  } catch {
    return '';
  }
};

/**
 * Fetches all comments for a specific post.
 */
export const fetchComments = async (postId: string): Promise<Comment[]> => {
  try {
    const records = await pb.collection('comments').getFullList<RecordModel>({
      filter: `postId = "${postId}"`,
      sort: '-created',
    });

    return records.map((record) => ({
      id: record.id,
      postId: record.postId,
      author: record.author,
      content: record.content,
      avatarUrl: record.avatarUrl,
      parentId: record.parentId,
      createdAt: new Date(record.created).getTime(),
      likes: Array.isArray(record.likedBy) ? record.likedBy.length : 0,
    }));
  } catch {
    return [];
  }
};

/**
 * Toggles a like on a comment for a user.
 */
export const likeComment = async (
  commentId: string,
  userId: string,
): Promise<void> => {
  await ensureAuth();
  try {
    const record = await pb
      .collection('comments')
      .getOne<RecordModel>(commentId);
    let likedBy = Array.isArray(record.likedBy) ? record.likedBy : [];

    if (likedBy.includes(userId)) {
      likedBy = likedBy.filter((id: string) => id !== userId);
    } else {
      likedBy.push(userId);
    }

    await pb.collection('comments').update(commentId, { likedBy });

    if (record.postId) {
      revalidatePath(`/post/${record.postId}`);
    }
  } catch {
    // Silent fail
  }
};

/**
 * Deletes a comment.
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  await ensureAuth();
  try {
    const record = await pb
      .collection('comments')
      .getOne<RecordModel>(commentId);
    await pb.collection('comments').delete(commentId);

    if (record.postId) {
      revalidatePath(`/post/${record.postId}`);
    }
    revalidatePath('/database/comments');
  } catch {
    // Silent fail
  }
};

/**
 * Updates the content of a comment.
 */
export const updateComment = async (
  commentId: string,
  newContent: string,
): Promise<void> => {
  await ensureAuth();
  try {
    const record = await pb
      .collection('comments')
      .update<RecordModel>(commentId, { content: newContent });

    if (record.postId) {
      revalidatePath(`/post/${record.postId}`);
    }
  } catch {
    // Silent fail
  }
};
