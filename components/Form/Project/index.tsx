'use client';

import React, { useState, useMemo } from 'react';
import { Project } from '@/types/project';
import { modal } from '@/components/Modal';
import {
  Button,
  Checkbox,
  Dropdown,
  FormLabel,
  Icon,
  Input,
  Textarea,
  FileUpload,
} from '@/components/UI';
import { Editor } from '@/components/Editor';
import { ProjectCard } from '@/components/Card/Project';
import { toast } from '@/components/Toast';
import { addProject, updateProject, deleteProject } from '@/database/projects';
import { generateId } from '@/utilities/generateId';
import { formatDateRange } from '@/utilities/formatDate';
import DateSelect from '@/components/DateSelect';
import Separator from '@/components/UI/Separator';
import { useRouter } from 'next/navigation';
import { IconName } from '@/components/UI/Icon';

interface ProjectFormProps {
  projectToEdit?: Project;
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
  readme: '',
  status: 'inProgress',
  pinned: false,
};

const ProjectForm: React.FC<ProjectFormProps> = ({ projectToEdit }) => {
  const [project, setProject] = useState<Project>(
    projectToEdit || initialProjectState,
  );
  const [isPresent, setIsPresent] = useState(
    projectToEdit?.dateString?.includes('Present') || false,
  );

  const [newTool, setNewTool] = useState('');

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

  const [startDate, setStartDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);

  const currentPreviewProject: Project = {
    id: project.id || 'preview',
    name: project.name || 'Project Name',
    image: project.image || '/images/placeholder.png',
    description: project.description || 'Project Description',
    tools: project.tools.length ? project.tools : ['Project Tools'],
    link: project.link || '#',
    favicon: project.favicon || '',
    dateString: project.dateString || formatDateRange(startDate, endDate),
    readme: project.readme || '',
    status: project.status || 'inProgress',
    pinned: project.pinned || false,
  };

  const handleChange = (
    field: keyof Project,
    value: string | string[] | Date,
  ) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTool = () => {
    const trimmed = newTool.trim();
    if (trimmed && !project.tools.includes(trimmed)) {
      handleChange('tools', [...project.tools, trimmed]);
      setNewTool('');
    }
  };

  const handleRemoveTool = (index: number) => {
    const updated = project.tools.filter((_, i) => i !== index);
    handleChange('tools', updated);
  };

  const handleToolChange = (index: number, value: string) => {
    const updated = [...project.tools];
    updated[index] = value;
    handleChange('tools', updated);
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

  const requiredProjectFields: {
    key: keyof Project | 'dateRange';
    label: string;
    check?: (value: (typeof project)[keyof typeof project]) => boolean;
  }[] = [
    { key: 'name', label: 'Project name' },
    { key: 'image', label: 'Image URL' },
    { key: 'description', label: 'Description' },
    {
      key: 'tools',
      label: 'Tools',
      check: (val) => Array.isArray(val) && val.length > 0,
    },
    {
      key: 'dateRange',
      label: 'Date range',
      check: () => !!startDate && !!endDate,
    },
  ];

  const validateForm = () => {
    for (const field of requiredProjectFields) {
      const value =
        field.key === 'dateRange' ? null : project[field.key as keyof Project];
      const isEmpty = field.check
        ? !field.check(value)
        : typeof value === 'string'
          ? !value.trim()
          : !value;

      if (isEmpty) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const projectData = {
      ...project,
      id: projectToEdit?.id || generateId(project.name),
      dateString: formatDateRange(startDate, endDate, isPresent),
      readme: project.readme || '',
    };

    try {
      const result = projectToEdit
        ? await updateProject(projectData)
        : await addProject(projectData);

      if (result.success) {
        toast.success(
          projectToEdit
            ? 'Project updated successfully!'
            : 'Project added successfully!',
        );
        router.push('/database/projects');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error saving the project: ${error.message}`
          : 'An unknown error occurred while saving the project.',
      );
    }
  };

  const handleDelete = async () => {
    if (!projectToEdit) return;

    try {
      const result = await deleteProject(projectToEdit.id);

      if (result.success) {
        toast.success('Project deleted successfully!');
        router.push('/database/projects');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error deleting the project: ${error.message}`
          : 'An unknown error occurred while deleting the project.',
      );
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
          <ProjectCard project={currentPreviewProject} isInForm />
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

  const statusOptions: { key: string; label: string; icon: IconName }[] = [
    { key: 'inProgress', label: 'Work in Progress', icon: 'gear' },
    { key: 'completed', label: 'Completed', icon: 'checkCircle' },
    { key: 'upcoming', label: 'Upcoming', icon: 'clock' },
  ];

  const currentStatus = statusOptions.find((opt) => opt.key === project.status);

  return (
    <>
      <div className='space-y-6'>
        {/* Project Preview */}
        <div className='flex justify-center'>
          <ProjectCard project={currentPreviewProject} isInForm />
        </div>

        <Separator margin='5' />

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
            <div className='flex gap-2'>
              <Input
                type='text'
                value={project.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder='https://project-image-url.com'
                required
              />
              {project.id && project.id !== 'preview' && (
                <FileUpload
                  collectionName='projects'
                  recordId={project.id}
                  fieldName='image'
                  onUploadSuccess={(url) => handleChange('image', url)}
                />
              )}
            </div>
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
              Tools
            </FormLabel>
            <div className='space-y-2'>
              {project.tools.map((tool, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    type='text'
                    value={tool}
                    onChange={(e) => handleToolChange(index, e.target.value)}
                  />
                  <Button
                    type='destructive'
                    icon='trashSimple'
                    onClick={() => handleRemoveTool(index)}
                  />
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <Input
                  type='text'
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  placeholder='Add a keyword'
                />
                <Button type='primary' icon='plus' onClick={handleAddTool} />
              </div>
            </div>
          </div>
          <div className='space-y-2'>
            <div>
              <FormLabel required>Start Date</FormLabel>
              <DateSelect
                value={startDate}
                onChange={(newDate) => {
                  setStartDate(newDate);
                  if (isPresent) {
                    setEndDate(newDate);
                  }
                }}
                mode='month-year'
              />
            </div>
            <div>
              <FormLabel>End Date</FormLabel>
              <DateSelect
                value={endDate}
                onChange={setEndDate}
                mode='month-year'
                disabled={isPresent}
              />
            </div>

            <Checkbox
              id='isPresent'
              checked={isPresent}
              onChange={(checked) => {
                setIsPresent(checked);
                if (checked) {
                  setEndDate(new Date());
                }
              }}
              label='I currently working on this project'
            />
          </div>
          <div>
            <FormLabel htmlFor='status' required>
              Status
            </FormLabel>
            <Dropdown
              trigger={
                <Button
                  icon={currentStatus?.icon}
                  className='w-full flex items-center justify-start gap-2 px-1 text-sm md:text-md text-black dark:text-white'
                >
                  {currentStatus?.label}
                </Button>
              }
              className='w-full'
              matchTriggerWidth
            >
              <div className='flex flex-col p-1 space-y-1 w-full'>
                {statusOptions.map((option) => (
                  <div
                    key={option.key}
                    onClick={() => handleChange('status', option.key)}
                    className={`flex items-center gap-3 px-4 py-2 text-sm rounded-md cursor-pointer transition-colors
                      ${
                        option.key === project.status
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }`}
                  >
                    <Icon name={option.icon} className='w-4 h-4' />
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </Dropdown>
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
          <div>
            <FormLabel htmlFor='readme'>Readme (optional)</FormLabel>
            <Editor
              content={project.readme || ''}
              onUpdate={(content) => handleChange('readme', content)}
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {projectToEdit ? (
        <div className='flex space-x-4'>
          <Button
            type='destructive'
            icon='trash'
            onClick={confirmDelete}
            className='w-full'
          >
            Delete
          </Button>

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
              <Button icon='pushPin' onClick={togglePin} className='w-full'>
                <span>Pin</span>
              </Button>
            ))}

          <Button
            type='primary'
            icon='floppyDisk'
            onClick={handleSubmit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          type='primary'
          icon='plus'
          onClick={handleSubmit}
          className='w-full'
        >
          Add
        </Button>
      )}
    </>
  );
};

export default ProjectForm;
