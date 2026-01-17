import pb from '@/lib/pocketbase';
import { Comment } from '@/types/comment';
import { RecordModel } from 'pocketbase';

/**
 * Adds a new comment to a post.
 * @param postId The ID of the post.
 * @param author The name of the commenter.
 * @param content The comment text.
 * @param avatarUrl Optional avatar URL.
 * @param parentId Optional parent comment ID for replies.
 * @returns Promise with the new comment ID.
 */
export const addComment = async (
  postId: string,
  author: string,
  content: string,
  avatarUrl?: string,
  parentId?: string,
): Promise<string> => {
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
    return record.id;
  } catch {
    return '';
  }
};

/**
 * Fetches all comments for a specific post.
 * @param postId The ID of the post.
 * @returns Promise with array of comments.
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
 * Subscribes to comment changes for a post.
 * @param postId The ID of the post.
 * @param callback Function to call when comments change.
 * @returns Unsubscribe function.
 */
export const subscribeToComments = (
  postId: string,
  callback: (comments: Comment[]) => void,
) => {
  fetchComments(postId).then(callback);

  pb.collection('comments').subscribe(
    '*',
    async () => {
      const comments = await fetchComments(postId);
      callback(comments);
    },
    { filter: `postId = "${postId}"` },
  );

  return () => pb.collection('comments').unsubscribe();
};

/**
 * Toggles a like on a comment for a user.
 * @param commentId The ID of the comment.
 * @param userId The ID of the user.
 */
export const likeComment = async (
  commentId: string,
  userId: string,
): Promise<void> => {
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
  } catch {
    // Silent fail
  }
};

/**
 * Deletes a comment.
 * @param commentId The ID of the comment to delete.
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    await pb.collection('comments').delete(commentId);
  } catch {
    // Silent fail
  }
};

/**
 * Updates the content of a comment.
 * @param commentId The ID of the comment.
 * @param newContent The new text content.
 */
export const updateComment = async (
  commentId: string,
  newContent: string,
): Promise<void> => {
  try {
    await pb.collection('comments').update(commentId, { content: newContent });
  } catch {
    // Silent fail
  }
};
