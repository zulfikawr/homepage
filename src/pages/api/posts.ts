import type { NextApiRequest, NextApiResponse } from 'next';
import { database, ref, get } from '~/lib/firebase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  if (method === 'GET') {
    try {
      const postsRef = ref(database, 'posts');
      const snapshot = await get(postsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const posts = Object.entries(data).map(([id, post]: [string, any]) => ({
          id,
          ...post,
        }));

        return res.status(200).json({ posts });
      } else {
        return res.status(200).json({ posts: [] });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
