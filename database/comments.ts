'use server';

import { revalidatePath } from 'next/cache';

import { Comment } from '@/types/comment';

import { executeQuery, executeQueryFirst, executeUpdate } from './base';

interface CommentRow {
  id: string;
  post_id: string;
  author: string;
  content: string;
  likes: number;
  parent_id: string;
  path: string;
  created_at: number;
  avatar_url?: string;
}

function mapRowToComment(row: CommentRow): Comment {
  return {
    id: row.id,
    post_id: row.post_id,
    author: row.author,
    content: row.content,
    avatar_url: row.avatar_url,
    parent_id: row.parent_id,
    created_at: row.created_at * 1000,
    likes: row.likes,
  };
}

export const getComments = async (post_id: string): Promise<Comment[]> => {
  try {
    const results = await executeQuery<CommentRow>(
      'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC',
      [post_id],
    );
    return results.map(mapRowToComment);
  } catch {
    return [];
  }
};

export const createComment = async (
  post_id: string,
  author: string,
  content: string,
  avatar_url?: string,
  parent_id?: string,
): Promise<string> => {
  try {
    const id = crypto.randomUUID();
    await executeUpdate(
      `INSERT INTO comments (id, post_id, author, content, avatar_url, parent_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, post_id, author, content, avatar_url || null, parent_id || null],
    );

    revalidatePath(`/post/${post_id}`);
    revalidatePath('/database/comments');
    return id;
  } catch {
    return '';
  }
};

export const updateComment = async (
  commentId: string,
  newContent: string,
): Promise<void> => {
  try {
    const comment = await executeQueryFirst<{ post_id: string }>(
      'SELECT post_id FROM comments WHERE id = ?',
      [commentId],
    );
    await executeUpdate('UPDATE comments SET content = ? WHERE id = ?', [
      newContent,
      commentId,
    ]);
    if (comment) revalidatePath(`/post/${comment.post_id}`);
  } catch {}
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    const comment = await executeQueryFirst<{ post_id: string }>(
      'SELECT post_id FROM comments WHERE id = ?',
      [commentId],
    );
    await executeUpdate('DELETE FROM comments WHERE id = ?', [commentId]);
    if (comment) revalidatePath(`/post/${comment.post_id}`);
    revalidatePath('/database/comments');
  } catch {}
};

export const likeComment = async (commentId: string): Promise<void> => {
  try {
    await executeUpdate('UPDATE comments SET likes = likes + 1 WHERE id = ?', [
      commentId,
    ]);
  } catch {}
};
