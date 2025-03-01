import React, { useState } from 'react';
import { Project } from '~/types/project';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import { modal } from '~/components/Modal';
import { Button } from '~/components/UI';
import { ProjectCard } from '~/components/Card/Project';
import { toast } from '~/components/Toast';
import { addProject, updateProject, deleteProject } from '~/functions/projects';

const ProjectForm = ({ projectToEdit }: { projectToEdit?: Project }) => {
  const { user } = useAuth();

  const [name, setName] = useState(projectToEdit?.name || '');
  const [image, setImage] = useState(projectToEdit?.image || '');
  const [description, setDescription] = useState(
    projectToEdit?.description || '',
  );
  const [tools, setTools] = useState(projectToEdit?.tools.join(', ') || '');
  const [date, setDate] = useState(projectToEdit?.date || '');
  const [link, setLink] = useState(projectToEdit?.link || '');
  const [favicon, setFavicon] = useState(projectToEdit?.favicon || '');

  const generateId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.show('Project name is required.');
      return false;
    }
    if (!image.trim()) {
      toast.show('Image URL is required.');
      return false;
    }
    if (!description.trim()) {
      toast.show('Description is required.');
      return false;
    }
    if (!tools.trim()) {
      toast.show('Tools are required.');
      return false;
    }
    if (!date.trim()) {
      toast.show('Date are required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !validateForm()) return;

    const projectData = {
      id: projectToEdit?.id || generateId(name),
      name,
      image: image || '/images/placeholder.png',
      description,
      tools: tools.split(',').map((tool) => tool.trim()),
      link: link || '',
      favicon: favicon || '',
      date,
    };

    try {
      let result;
      if (projectToEdit) {
        result = await updateProject(projectData);
      } else {
        result = await addProject(projectData);
      }

      if (result.success) {
        drawer.close();
        toast.show(
          projectToEdit
            ? 'Project updated successfully!'
            : 'Project added successfully!',
        );
      } else {
        throw new Error(result.error || 'Failed to save project');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error saving project: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while saving the project.');
      }
    }
  };

  const handleDelete = async () => {
    if (!projectToEdit || !user) return;

    try {
      const result = await deleteProject(projectToEdit.id);

      if (result.success) {
        drawer.close();
        toast.show('Project deleted successfully!');
      } else {
        throw new Error(result.error || 'Failed to delete project');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error deleting project: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while deleting the project.');
      }
    }
  };

  const confirmDelete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6'>
          Are you sure you want to delete this project? This action cannot be
          undone.
        </p>
        <div className='flex justify-end space-x-4'>
          <Button type='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            type='destructive'
            onClick={() => {
              handleDelete();
              modal.close();
            }}
          >
            Delete
          </Button>
        </div>
      </div>,
    );
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>
            {projectToEdit ? 'Edit Project' : 'Add New Project'}
          </h1>
          <Button type='default' onClick={() => drawer.close()}>
            Close
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {/* Project Preview */}
          <div className='flex justify-center'>
            <ProjectCard
              id='preview'
              name={name || 'Project Name'}
              image={image || '/images/placeholder.png'}
              description={description || 'Project Description'}
              tools={
                tools
                  ? tools.split(',').map((tool) => tool.trim())
                  : ['Project Tools']
              }
              link={link || '#'}
              date={
                projectToEdit?.date || new Date().toISOString().split('T')[0]
              }
              isInDrawer
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Project name'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Image URL <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder='https://project-image-url.com'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Description <span className='text-red-500'>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Project description'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Tools (Comma-separated) <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={tools}
                onChange={(e) => setTools(e.target.value)}
                placeholder='Project, Tools'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Date (String) <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder='Jan 2021'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Link</label>
              <input
                type='text'
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder='https://project-link.com'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Favicon URL
              </label>
              <input
                type='text'
                value={favicon}
                onChange={(e) => setFavicon(e.target.value)}
                placeholder='https://project-favicon.com'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
            <div className='flex justify-end space-x-4'>
              {projectToEdit && (
                <Button type='destructive' onClick={confirmDelete}>
                  Delete
                </Button>
              )}
              <Button type='primary' onClick={handleSubmit}>
                {projectToEdit ? 'Save Changes' : 'Add Project'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;
