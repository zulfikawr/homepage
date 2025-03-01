import { database, ref, get, set, remove } from '~/lib/firebase';
import { Post } from '~/types/post';

/**
 * Fetch all posts from Firebase
 * @returns Promise with array of posts
 */
export async function getPosts(): Promise<Post[]> {
  try {
    const postsRef = ref(database, 'posts');
    const snapshot = await get(postsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const posts = Object.entries(data).map(
        ([id, post]: [string, Omit<Post, 'id'>]) => ({
          id,
          ...post,
        }),
      );
      return posts;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

/**
 * Fetch a single post by ID from Firebase
 * @param id ID of the post to fetch
 * @returns Promise with the post data or null if not found
 */
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const postRef = ref(database, `posts/${id}`);
    const snapshot = await get(postRef);

    if (snapshot.exists()) {
      return { id, ...snapshot.val() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }
}

/**
 * Add a new post to Firebase
 * @param data Post data to add
 * @returns Promise with operation result
 */
export async function addPost(
  data: Omit<Post, 'date'>,
): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    const {
      id,
      type,
      title,
      slug,
      excerpt,
      categories,
      content,
      img,
      audioUrl,
    } = data;

    // Validate required fields
    if (!type || !slug) {
      return { success: false, error: 'Type and slug are required fields' };
    }

    const newPost: Post = {
      id,
      type,
      slug,
      title: title || '',
      excerpt: excerpt || '',
      categories: categories || [],
      img: img || '',
      audioUrl: audioUrl || '',
      content: content || '',
      date: new Date().toISOString(),
    };

    const newPostRef = ref(database, `posts/${newPost.id}`);
    await set(newPostRef, newPost);

    return { success: true, post: newPost };
  } catch (error) {
    console.error('Error adding post:', error);
    return { success: false, error: 'Failed to add post' };
  }
}

/**
 * Update an existing post in Firebase
 * @param data Updated post data
 * @returns Promise with operation result
 */
export async function updatePost(
  data: Post,
): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    const {
      id,
      type,
      title,
      slug,
      excerpt,
      categories,
      content,
      img,
      audioUrl,
    } = data;

    // Validate required fields
    if (!id || !type || !slug) {
      return {
        success: false,
        error: 'ID, type, and slug are required fields',
      };
    }

    const updatedPost: Post = {
      id,
      type,
      slug,
      title: title || '',
      excerpt: excerpt || '',
      categories: categories || [],
      img: img || '',
      audioUrl: audioUrl || '',
      content: content || '',
      date: new Date().toISOString().split('T')[0],
    };

    const postRef = ref(database, `posts/${id}`);
    await set(postRef, updatedPost);

    return { success: true, post: updatedPost };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, error: 'Failed to update post' };
  }
}

/**
 * Delete a post from Firebase
 * @param id ID of the post to delete
 * @returns Promise with operation result
 */
export async function deletePost(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) {
      return { success: false, error: 'Post ID is required' };
    }

    const postRef = ref(database, `posts/${id}`);
    await remove(postRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}
