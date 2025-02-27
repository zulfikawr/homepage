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

// Handle GET requests (fetch projects)
async function handleGet(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const projectsRef = ref(database, 'projects');
    const snapshot = await get(projectsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const projects = Object.entries(data).map(
        ([id, project]: [string, any]) => ({
          id,
          ...project,
        }),
      );

      return res.status(200).json({ projects });
    } else {
      return res.status(200).json({ projects: [] });
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

// Handle POST requests (add a new project)
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, name, image, description, tools, date, link, favicon } =
      req.body;

    if (!id || !name || !description || !tools) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProject = {
      id,
      name,
      image,
      description,
      tools,
      link,
      favicon,
      date,
    };

    const newProjectRef = ref(database, `projects/${id}`);
    await set(newProjectRef, newProject);

    return res
      .status(201)
      .json({ message: 'Project added successfully', project: newProject });
  } catch (error) {
    console.error('Error adding project:', error);
    return res.status(500).json({ error: 'Failed to add project' });
  }
}

// Handle PUT requests (edit a project)
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, name, image, description, tools, date, link, favicon } =
      req.body;

    if (!id || !name || !description || !tools) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedProject = {
      id,
      name,
      image,
      description,
      tools,
      link,
      favicon,
      date,
    };

    const projectRef = ref(database, `projects/${id}`);
    await set(projectRef, updatedProject);

    return res.status(200).json({
      message: 'Project updated successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ error: 'Failed to update project' });
  }
}

// Handle DELETE requests (delete a project)
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const projectRef = ref(database, `projects/${id}`);
    await remove(projectRef);

    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
}
