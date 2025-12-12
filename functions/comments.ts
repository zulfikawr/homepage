import {
  database,
  ref,
  get,
  onValue,
  set,
  remove,
  update,
} from '@/lib/firebase';
import { Comment } from '@/types/comment';

/**
 * Normalizes the nested comments structure for the frontend.
 */
const normalizeReplies = (
  repliesObj: any,
  parentPath: string,
): Record<string, Comment> => {
  const out: Record<string, Comment> = {};
  if (!repliesObj) return out;

  Object.keys(repliesObj).forEach((key) => {
    const raw = repliesObj[key];
    const currentPath = `${parentPath}/${key}/replies`;

    // Construct the comment object
    const comment: any = {
      id: key,
      ...raw,
      // Store the path to this comment's replies for direct access later
      path: currentPath,
    };

    // Safe defaulting
    if (!comment.createdAt || typeof comment.createdAt !== 'number') {
      comment.createdAt = Date.now();
    }
    if (comment.likedBy) comment.likes = Object.keys(comment.likedBy).length;

    // Recursively normalize children
    if (comment.replies) {
      comment.replies = normalizeReplies(comment.replies, currentPath);
    }

    out[key] = comment;
  });

  return out;
};

/**
 * Generates a unique key based on the username.
 * Checks `username`, `username_2`, `username_3`, etc.
 */
const generateUniqueKey = async (
  basePath: string,
  username: string,
): Promise<string> => {
  // Sanitize username slightly to be safe as a key (remove invalid chars if any)
  // Firebase keys cannot contain . $ # [ ] / or ASCII control characters
  const safeUsername = username.replace(/[.#$/\[\]]/g, '_');

  let candidate = safeUsername;
  let attempt = 1;

  while (true) {
    const targetRef = ref(database, `${basePath}/${candidate}`);
    const snapshot = await get(targetRef);

    if (!snapshot.exists()) {
      return candidate;
    }

    attempt++;
    candidate = `${safeUsername}_${attempt}`;
  }
};

/**
 * Adds a comment or reply.
 * @param path - The full database path to add the comment to (e.g. `posts/123/comments` or `posts/123/comments/abc/replies`)
 */
export const addComment = async (
  path: string,
  author: string,
  content: string,
  avatarUrl?: string,
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const commentId = await generateUniqueKey(path, author);

    // Extract postId from path (format: posts/{postId}/comments/...)
    const postId = path.split('/')[1];

    const commentData: Omit<Comment, 'id'> = {
      postId,
      author: author || 'Anonymous',
      content,
      createdAt: timestamp,
      likes: 0,
      ...(avatarUrl && { avatarUrl }),
    };

    const commentRef = ref(database, `${path}/${commentId}`);
    await set(commentRef, commentData);

    return commentId;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Fetches comments once.
 */
export const fetchComments = async (postId: string): Promise<Comment[]> => {
  try {
    const commentsRef = ref(database, `posts/${postId}/comments`);
    const snapshot = await get(commentsRef);

    if (!snapshot.exists()) return [];

    const commentsData = snapshot.val();
    const comments: Comment[] = [];

    // Keys are usernames (or username_N)
    Object.keys(commentsData).forEach((key) => {
      const raw = commentsData[key];
      // Root comment path: posts/{postId}/comments/{key}/replies
      const replyPath = `posts/${postId}/comments/${key}/replies`;

      const comment: any = { id: key, ...raw, path: replyPath };

      if (comment.likedBy) comment.likes = Object.keys(comment.likedBy).length;
      if (comment.replies)
        comment.replies = normalizeReplies(comment.replies, replyPath);

      comments.push(comment);
    });

    return comments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

/**
 * Subscribes to comments for realtime updates.
 * Compatible with useRealtimeData hook by returning the unsubscribe function.
 */
export const subscribeToComments = (
  postId: string,
  callback: (comments: Comment[]) => void,
) => {
  try {
    const commentsRef = ref(database, `posts/${postId}/comments`);

    const unsubscribe = onValue(commentsRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const commentsData = snapshot.val();
      const comments: Comment[] = [];

      Object.keys(commentsData).forEach((key) => {
        const raw = commentsData[key];
        const replyPath = `posts/${postId}/comments/${key}/replies`;

        const comment: any = { id: key, ...raw, path: replyPath };

        if (comment.likedBy)
          comment.likes = Object.keys(comment.likedBy).length;
        if (comment.replies)
          comment.replies = normalizeReplies(comment.replies, replyPath);

        comments.push(comment);
      });

      callback(
        comments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
      );
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to comments:', error);
    // Return empty fn to avoid crash if error occurs during setup
    return () => {};
  }
};

export const likeComment = async (
  commentPath: string, // Full path to the comment (e.g. posts/123/comments/user_1)
  userId: string,
): Promise<void> => {
  try {
    if (!userId) throw new Error('User must be logged in to like');

    // The 'commentPath' passed in should be the path to the comment OBJECT.
    // The likes are stored in `.../likedBy/{userId}`
    const likedRef = ref(database, `${commentPath}/likedBy/${userId}`);
    const snapshot = await get(likedRef);

    if (snapshot.exists()) {
      await remove(likedRef);
    } else {
      await set(likedRef, true);
    }
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentPath: string): Promise<void> => {
  try {
    const commentRef = ref(database, commentPath);
    await remove(commentRef);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const updateComment = async (
  commentPath: string,
  newContent: string,
): Promise<void> => {
  try {
    const contentRef = ref(database, `${commentPath}/content`);
    await set(contentRef, newContent);
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};
