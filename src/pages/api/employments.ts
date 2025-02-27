import type { NextApiRequest, NextApiResponse } from 'next';
import { database, ref, get, set, remove } from '~/lib/firebase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Handle GET requests (fetch employments)
async function handleGet(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const employmentsRef = ref(database, 'employments');
    const snapshot = await get(employmentsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const employments = Object.entries(data).map(
        ([id, employment]: [string, any]) => ({
          id,
          ...employment,
        }),
      );

      return res.status(200).json({ employments });
    } else {
      return res.status(200).json({ employments: [] });
    }
  } catch (error) {
    console.error('Error fetching employments:', error);
    return res.status(500).json({ error: 'Failed to fetch employments' });
  }
}

// Handle POST requests (add a new employment)
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      id,
      organization,
      organizationIndustry,
      jobTitle,
      jobType,
      responsibilities,
      dateString,
      orgLogoSrc,
      organizationLocation,
    } = req.body;

    if (
      !id ||
      !organization ||
      !jobTitle ||
      !jobType ||
      !dateString ||
      !responsibilities
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newEmployment = {
      id,
      organization,
      organizationIndustry,
      jobTitle,
      jobType,
      responsibilities,
      dateString,
      orgLogoSrc: orgLogoSrc || '/images/placeholder.png',
      organizationLocation,
    };

    const newEmploymentRef = ref(database, `employments/${id}`);
    await set(newEmploymentRef, newEmployment);

    return res.status(201).json({
      message: 'Employment added successfully',
      employment: newEmployment,
    });
  } catch (error) {
    console.error('Error adding employment:', error);
    return res.status(500).json({ error: 'Failed to add employment' });
  }
}

// Handle PUT requests (edit an employment)
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      id,
      organization,
      organizationIndustry,
      jobTitle,
      jobType,
      responsibilities,
      dateString,
      orgLogoSrc,
      organizationLocation,
    } = req.body;

    if (
      !id ||
      !organization ||
      !jobTitle ||
      !jobType ||
      !dateString ||
      !responsibilities
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedEmployment = {
      id,
      organization,
      organizationIndustry,
      jobTitle,
      jobType,
      responsibilities,
      dateString,
      orgLogoSrc: orgLogoSrc || '/images/placeholder.png',
      organizationLocation,
    };

    const employmentRef = ref(database, `employments/${id}`);
    await set(employmentRef, updatedEmployment);

    return res.status(200).json({
      message: 'Employment updated successfully',
      employment: updatedEmployment,
    });
  } catch (error) {
    console.error('Error updating employment:', error);
    return res.status(500).json({ error: 'Failed to update employment' });
  }
}

// Handle DELETE requests (delete an employment)
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Employment ID is required' });
    }

    const employmentRef = ref(database, `employments/${id}`);
    await remove(employmentRef);

    return res.status(200).json({ message: 'Employment deleted successfully' });
  } catch (error) {
    console.error('Error deleting employment:', error);
    return res.status(500).json({ error: 'Failed to delete employment' });
  }
}
