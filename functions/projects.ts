import { database, ref, get, set, remove } from '@/lib/firebase';
import { Project } from '@/types/project';

/**
 * Fetch all projects from Firebase
 * @returns Promise with array of project data
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const projectsRef = ref(database, 'projects');
    const snapshot = await get(projectsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const projects = Object.entries(data).map(
        ([id, project]: [string, Omit<Project, 'id'>]) => ({
          id,
          ...project,
        }),
      );
      return projects;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Add a new project to Firebase
 * @param data Project data to add
 * @returns Promise with operation result
 */
export async function addProject(
  data: Project,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const { id, name, description, tools, status, pinned } = data;

    if (!id || !name || !description || !tools || !status) {
      return {
        success: false,
        error: 'Missing required fields',
      };
    }

    const newProject: Project = {
      ...data,
      pinned: pinned ?? false,
    };

    const newProjectRef = ref(database, `projects/${id}`);
    await set(newProjectRef, newProject);

    return {
      success: true,
      project: newProject,
    };
  } catch (error) {
    console.error('Error adding project:', error);
    return {
      success: false,
      error: 'Failed to add project',
    };
  }
}

/**
 * Update an existing project in Firebase
 * @param data Updated project data
 * @returns Promise with operation result
 */
export async function updateProject(
  data: Project,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const { id, name, description, tools, status, pinned } = data;

    if (!id || !name || !description || !tools || !status) {
      return {
        success: false,
        error: 'Missing required fields',
      };
    }

    const updatedProject: Project = {
      ...data,
      pinned: pinned ?? false,
    };

    const projectRef = ref(database, `projects/${id}`);
    await set(projectRef, updatedProject);

    return {
      success: true,
      project: updatedProject,
    };
  } catch (error) {
    console.error('Error updating project:', error);
    return {
      success: false,
      error: 'Failed to update project',
    };
  }
}

/**
 * Delete a project from Firebase
 * @param id ID of the project to delete
 * @returns Promise with operation result
 */
export async function deleteProject(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Project ID is required',
      };
    }

    const projectRef = ref(database, `projects/${id}`);
    await remove(projectRef);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      success: false,
      error: 'Failed to delete project',
    };
  }
}
