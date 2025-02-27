import type { NextApiRequest, NextApiResponse } from 'next';
import { database, ref, get } from '~/lib/firebase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests allowed' });
  }

  try {
    const scheduleRef = ref(database, 'schedule');
    const snapshot = await get(scheduleRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const appointments = Object.entries(data).map(
        ([id, appointment]: [string, any]) => ({
          id,
          ...appointment,
        }),
      );

      return res.status(200).json({ appointments });
    } else {
      return res.status(200).json({ appointments: [] });
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ error: 'Failed to fetch appointments' });
  }
}
