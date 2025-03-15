'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Project } from '@/types/project';
import { drawer } from '@/components/Drawer';
import { modal } from '@/components/Modal';
import {
  Button,
  Checkbox,
  Dropdown,
  FormLabel,
  Input,
  Textarea,
} from '@/components/UI';
import { ProjectCard } from '@/components/Card/Project';
import { toast } from '@/components/Toast';
import { addProject, updateProject, deleteProject } from '@/functions/projects';
import { generateId } from '@/utilities/generateId';
import DatePicker from '@/components/DatePicker';
import Tabs from '@/components/Tabs';
import Separator from '@/components/UI/Separator';

interface ProjectFormProps {
  projectToEdit?: Project;
  onUpdate: () => Promise<void>;
}

const initialProjectState: Project = {
  id: '',
  name: '',
  image: '',
  description: '',
  tools: [],
  link: '',
  favicon: '',
  dateString: '',
  status: 'inProgress',
  pinned: false,
};

const ProjectForm: React.FC<ProjectFormProps> = ({
  projectToEdit,
  onUpdate,
}) => {
  const [project, setProject] = useState<Project>(
    projectToEdit || initialProjectState,
  );
  const [isPresent, setIsPresent] = useState(
    projectToEdit?.dateString?.includes('Present') || false,
  );

  const initialDates = useMemo(() => {
    if (!projectToEdit?.dateString) {
      return {
        start: new Date(),
        end: new Date(),
      };
    }

    const [startStr, endStr] = projectToEdit.dateString.split(' - ');
    const start = new Date(startStr);
    const end = endStr === 'Present' ? new Date() : new Date(endStr);

    return {
      start,
      end,
    };
  }, [projectToEdit]);

  const [dateRange, setDateRange] = useState(initialDates);

  const handleChange = (
    field: keyof Project,
    value: string | string[] | Date,
  ) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (range: { start: Date; end: Date }) => {
    setDateRange(range);
  };

  const togglePin = async () => {
    const newPinnedStatus = !project.pinned;

    try {
      const result = await updateProject({
        ...project,
        pinned: newPinnedStatus,
      });

      if (result.success) {
        setProject((prevProject) => ({
          ...prevProject,
          pinned: newPinnedStatus,
        }));
        await onUpdate();
        toast.show(
          `Project ${newPinnedStatus ? 'pinned' : 'unpinned'} successfully!`,
        );
      } else {
        throw new Error(result.error || 'Failed to update pinned status');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error: ${error.message}`);
      } else {
        toast.show(
          'An unknown error occurred while updating the pinned status.',
        );
      }
    }
  };

  const validateForm = () => {
    if (!project.name.trim()) {
      toast.show('Project name is required.');
      return false;
    }
    if (!project.image.trim()) {
      toast.show('Image URL is required.');
      return false;
    }
    if (!project.description.trim()) {
      toast.show('Description is required.');
      return false;
    }
    if (!project.tools.length) {
      toast.show('Tools are required.');
      return false;
    }
    if (!dateRange.start || !dateRange.end) {
      toast.show('Date range is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const startDate = dateRange.start.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });
    const endDate = isPresent
      ? 'Present'
      : dateRange.end.toLocaleDateString('en-GB', {
          month: 'short',
          year: 'numeric',
        });
    const formattedDate = `${startDate} - ${endDate}`;

    const projectData = {
      ...project,
      id: projectToEdit?.id || generateId(project.name),
      dateString: formattedDate,
    };

    try {
      const result = projectToEdit
        ? await updateProject(projectData)
        : await addProject(projectData);

      if (result.success) {
        await onUpdate();
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
    if (!projectToEdit) return;

    try {
      const result = await deleteProject(projectToEdit.id);

      if (result.success) {
        await onUpdate();
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
        <p className='mb-6 text-neutral-800 dark:text-neutral-300'>
          Are you sure you want to delete the following project? This action
          cannot be undone.
        </p>
        <div className='mb-6'>
          <ProjectCard
            id='preview'
            name={project.name || 'Project Name'}
            image={project.image || '/images/placeholder.png'}
            description={project.description || 'Project Description'}
            tools={project.tools.length ? project.tools : ['Project Tools']}
            link={project.link || '#'}
            dateString={
              project.dateString ||
              `${dateRange.start.toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric',
              })} - ${
                isPresent
                  ? 'Present'
                  : dateRange.end.toLocaleDateString('en-GB', {
                      month: 'short',
                      year: 'numeric',
                    })
              }`
            }
            status={project.status}
            isInDrawer
          />
        </div>
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

  const openStatusModal = () => {
    modal.open(
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Select Project Status</h2>
          <Button icon='close' onClick={() => modal.close()} />
        </div>
        <Separator margin='4' />
        <Tabs
          items={[
            {
              key: 'inProgress',
              label: 'Work in Progress',
              action: () => {
                handleChange('status', 'inProgress');
                modal.close();
              },
            },
            {
              key: 'completed',
              label: 'Completed',
              action: () => {
                handleChange('status', 'completed');
                modal.close();
              },
            },
            {
              key: 'upcoming',
              label: 'Upcoming',
              action: () => {
                handleChange('status', 'upcoming');
                modal.close();
              },
            },
          ]}
          direction='vertical'
        />
      </div>,
    );
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-xl md:text-2xl font-medium whitespace-nowrap overflow-hidden text-ellipsis'>
            {projectToEdit ? (
              <div className='flex items-center'>
                {project.favicon && (
                  <span className='mr-3 inline-block'>
                    <Image
                      src={project.favicon}
                      height={30}
                      width={30}
                      alt={project.name}
                    />
                  </span>
                )}
                {project.name}
              </div>
            ) : (
              'New Project'
            )}
          </h1>

          <div className='flex justify-end space-x-4'>
            <Dropdown trigger={<Button icon='dotsThree' />} position='bottom'>
              <div className='flex flex-col p-2 space-y-2'>
                {projectToEdit && (
                  <Button
                    type='destructive'
                    icon='trash'
                    onClick={confirmDelete}
                    className='w-full'
                  >
                    <span>Delete</span>
                  </Button>
                )}

                {projectToEdit &&
                  (project.pinned ? (
                    <Button
                      icon='pushPinSlash'
                      onClick={togglePin}
                      className='w-full'
                    >
                      <span>Unpin</span>
                    </Button>
                  ) : (
                    <Button
                      icon='pushPin'
                      onClick={togglePin}
                      className='w-full'
                    >
                      <span>Pin</span>
                    </Button>
                  ))}

                {projectToEdit ? (
                  <Button
                    type='primary'
                    icon='floppyDisk'
                    onClick={handleSubmit}
                    className='w-full'
                  >
                    <span>Save</span>
                  </Button>
                ) : (
                  <Button
                    type='primary'
                    icon='plus'
                    onClick={handleSubmit}
                    className='w-full'
                  >
                    <span>Add</span>
                  </Button>
                )}
              </div>
            </Dropdown>

            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-6'>
          {/* Project Preview */}
          <div className='flex justify-center'>
            <ProjectCard
              id='preview'
              name={project.name || 'Project Name'}
              image={project.image || '/images/placeholder.png'}
              description={project.description || 'Project Description'}
              tools={project.tools.length ? project.tools : ['Project Tools']}
              link={project.link || '#'}
              dateString={
                project.dateString ||
                `${dateRange.start.toLocaleDateString('en-GB', {
                  month: 'short',
                  year: 'numeric',
                })} - ${
                  isPresent
                    ? 'Present'
                    : dateRange.end.toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric',
                      })
                }`
              }
              status={project.status}
              isInDrawer
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <FormLabel htmlFor='name' required>
                Name
              </FormLabel>
              <Input
                type='text'
                value={project.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder='Project name'
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='imageUrl' required>
                Image URL
              </FormLabel>
              <Input
                type='text'
                value={project.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder='https://project-image-url.com'
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='description' required>
                Description
              </FormLabel>
              <Textarea
                value={project.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder='Project description'
                rows={4}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='tools' required>
                Tools (Comma-Separated)
              </FormLabel>
              <Input
                type='text'
                value={project.tools.join(', ')}
                onChange={(e) =>
                  handleChange(
                    'tools',
                    e.target.value.split(',').map((tool) => tool.trim()),
                  )
                }
                placeholder='Tools 1, Tools 2'
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='dateRange' required>
                Date Range
              </FormLabel>
              <div className='space-y-2'>
                <DatePicker
                  isRange
                  value={dateRange}
                  onChange={handleDateChange}
                  disabled={isPresent}
                />
                <Checkbox
                  id='isPresent'
                  checked={isPresent}
                  onChange={(checked) => {
                    setIsPresent(checked);
                    if (checked) {
                      setDateRange((prev) => ({ ...prev, end: new Date() }));
                    }
                  }}
                  label='Still working on this project'
                />
              </div>
            </div>
            <div>
              <FormLabel htmlFor='status' required>
                Status
              </FormLabel>
              <Input
                type='button'
                onClick={openStatusModal}
                value={
                  project.status === 'inProgress'
                    ? 'Work in Progress'
                    : project.status === 'completed'
                      ? 'Completed'
                      : 'Upcoming'
                }
                className='text-left cursor-pointer'
              />
            </div>
            <div>
              <FormLabel htmlFor='link'>Link</FormLabel>
              <Input
                type='text'
                value={project.link}
                onChange={(e) => handleChange('link', e.target.value)}
                placeholder='https://project-link.com'
              />
            </div>
            <div>
              <FormLabel htmlFor='faviconUrl'>Favicon URL</FormLabel>
              <Input
                type='text'
                value={project.favicon}
                onChange={(e) => handleChange('favicon', e.target.value)}
                placeholder='https://project-favicon.com'
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;
