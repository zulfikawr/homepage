import type { NextApiRequest, NextApiResponse } from 'next';
import { database, ref, get, set } from '~/lib/firebase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'PUT':
      return handlePut(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Handle GET requests (fetch personalInfo)
async function handleGet(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const personalInfoRef = ref(database, 'personalInfo');
    const snapshot = await get(personalInfoRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return res.status(200).json({ personalInfo: data });
    } else {
      // Return default data if no data exists
      const defaultData = {
        name: 'Zulfikar',
        title: 'IR student, journalist, and web developer.',
        avatarUrl: '/tony.png',
      };
      await set(personalInfoRef, defaultData);
      return res.status(200).json({ personalInfo: defaultData });
    }
  } catch (error) {
    console.error('Error fetching personalInfo:', error);
    return res.status(500).json({ error: 'Failed to fetch personalInfo' });
  }
}

// Handle PUT requests (update personalInfo)
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, title, avatarUrl } = req.body;

    if (!name || !title || !avatarUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedData = {
      name,
      title,
      avatarUrl,
    };

    const personalInfoRef = ref(database, 'personalInfo');
    await set(personalInfoRef, updatedData);

    return res.status(200).json({
      message: 'Personal info updated successfully',
      data: { personalInfo: updatedData },
    });
  } catch (error) {
    console.error('Error updating personalInfo:', error);
    return res.status(500).json({ error: 'Failed to update personalInfo' });
  }
}
