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

// Handle GET requests (fetch interestsAndObjectives)
async function handleGet(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const interestsAndObjectivesRef = ref(database, 'interestsAndObjectives');
    const snapshot = await get(interestsAndObjectivesRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return res.status(200).json({ interestsAndObjectives: data });
    } else {
      // Return default data if no data exists
      const defaultData = {
        description:
          'This is a default description about my interests and objectives.',
        objectives: [
          'Achieve excellence in my field of work.',
          'Contribute to meaningful projects that make a difference.',
          'Continuously learn and grow both personally and professionally.',
        ],
        conclusion:
          'In conclusion, my interests and objectives drive me to pursue excellence and make a positive impact.',
      };
      await set(interestsAndObjectivesRef, defaultData);
      return res.status(200).json({ interestsAndObjectives: defaultData });
    }
  } catch (error) {
    console.error('Error fetching interestsAndObjectives:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch interestsAndObjectives' });
  }
}

// Handle PUT requests (update interestsAndObjectives)
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { description, objectives, conclusion } = req.body;

    if (!description || !objectives || !conclusion) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedData = {
      description,
      objectives,
      conclusion,
    };

    const interestsAndObjectivesRef = ref(database, 'interestsAndObjectives');
    await set(interestsAndObjectivesRef, updatedData);

    return res.status(200).json({
      message: 'Interests and objectives updated successfully',
      data: { interestsAndObjectives: updatedData },
    });
  } catch (error) {
    console.error('Error updating interestsAndObjectives:', error);
    return res
      .status(500)
      .json({ error: 'Failed to update interestsAndObjectives' });
  }
}
