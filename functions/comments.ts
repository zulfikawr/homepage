import { database, ref, push, get, onValue, update, set } from '@/lib/firebase';
import { Comment } from '@/types/comment';

export const addComment = async (
  postId: string,
  author: string,
  content: string,
  parentId?: string,
): Promise<string> => {
  try {
    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();

    const commentData: Omit<Comment, 'id'> = {
      postId,
      author: author || 'Anonymous',
      content,
      createdAt: timestamp,
      likes: 0,
      ...(parentId && { parentId }),
    };

    if (parentId) {
      // Add reply to parent comment
      const replyRef = ref(
        database,
        `posts/${postId}/comments/${parentId}/replies/${commentId}`,
      );
      await set(replyRef, commentData);
    } else {
      // Add top-level comment
      const commentsRef = ref(
        database,
        `posts/${postId}/comments/${commentId}`,
      );
      await set(commentsRef, commentData);
    }

    return commentId;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  try {
    const commentsRef = ref(database, `posts/${postId}/comments`);
    const snapshot = await get(commentsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const commentsData = snapshot.val();
    const comments: Comment[] = [];

    Object.keys(commentsData).forEach((key) => {
      comments.push({
        id: key,
        ...commentsData[key],
      });
    });

    return comments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

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
        comments.push({
          id: key,
          ...commentsData[key],
        });
      });

      callback(
        comments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
      );
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to comments:', error);
    throw error;
  }
};

export const likeComment = async (
  postId: string,
  commentId: string,
  parentId?: string,
): Promise<void> => {
  try {
    const path = parentId
      ? `posts/${postId}/comments/${parentId}/replies/${commentId}/likes`
      : `posts/${postId}/comments/${commentId}/likes`;

    const likesRef = ref(database, path);
    const snapshot = await get(likesRef);
    const currentLikes = snapshot.val() || 0;

    await update(likesRef.parent!, {
      likes: currentLikes + 1,
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

export const updateCommentAuthor = async (
  postId: string,
  commentId: string,
  newAuthor: string,
  parentId?: string,
): Promise<void> => {
  try {
    const path = parentId
      ? `posts/${postId}/comments/${parentId}/replies/${commentId}/author`
      : `posts/${postId}/comments/${commentId}/author`;

    const authorRef = ref(database, path);
    await update(authorRef.parent!, {
      author: newAuthor,
    });
  } catch (error) {
    console.error('Error updating comment author:', error);
    throw error;
  }
};
