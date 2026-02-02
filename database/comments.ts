'use server';

import { revalidatePath } from 'next/cache';

import { getDB } from '@/lib/cloudflare';
import { Comment } from '@/types/comment';

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
    postId: row.post_id,
    author: row.author,
    content: row.content,
    avatarUrl: row.avatar_url,
    parentId: row.parent_id,
    createdAt: row.created_at * 1000, // Convert unix epoch to ms
    likes: row.likes,
  };
}

export const addComment = async (
  postId: string,
  author: string,
  content: string,
  avatarUrl?: string,
  parentId?: string,
): Promise<string> => {
  try {
    const db = getDB();
    const id = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO comments (id, post_id, author, content, avatar_url, parent_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, postId, author, content, avatarUrl || null, parentId || null)
      .run();

    revalidatePath(`/post/${postId}`);
    revalidatePath('/database/comments');
    return id;
  } catch {
    return '';
  }
};

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  try {
    const db = getDB();
    const { results } = await db
      .prepare(
        'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC',
      )
      .bind(postId)
      .all<CommentRow>();
    return results.map(mapRowToComment);
  } catch {
    return [];
  }
};

export const likeComment = async (commentId: string): Promise<void> => {
  try {
    const db = getDB();
    await db
      .prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?')
      .bind(commentId)
      .run();
    // In a real app, you'd track WHO liked it in a separate table
  } catch {}
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    const db = getDB();
    const comment = await db
      .prepare('SELECT post_id FROM comments WHERE id = ?')
      .bind(commentId)
      .first<{ post_id: string }>();
    await db.prepare('DELETE FROM comments WHERE id = ?').bind(commentId).run();
    if (comment) revalidatePath(`/post/${comment.post_id}`);
    revalidatePath('/database/comments');
  } catch {}
};

export const updateComment = async (
  commentId: string,
  newContent: string,
): Promise<void> => {
  try {
    const db = getDB();
    const comment = await db
      .prepare('SELECT post_id FROM comments WHERE id = ?')
      .bind(commentId)
      .first<{ post_id: string }>();
    await db
      .prepare('UPDATE comments SET content = ? WHERE id = ?')
      .bind(newContent, commentId)
      .run();
    if (comment) revalidatePath(`/post/${comment.post_id}`);
  } catch {}
};
