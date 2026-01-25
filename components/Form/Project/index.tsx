'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { modal } from '@/components/Modal';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  FormLabel,
  Icon,
  Input,
  Textarea,
  Dropzone,
} from '@/components/UI';
import { Editor } from '@/components/Editor';
import { ProjectCard } from '@/components/Card/Project';
import { toast } from '@/components/Toast';
import { addProject, updateProject, deleteProject } from '@/database/projects';
import { generateSlug } from '@/utilities/generateSlug';
import { formatDateRange } from '@/utilities/formatDate';
import DateSelect from '@/components/DateSelect';
import { Separator } from '@/components/UI/Separator';
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
  slug: '',
};

const ProjectForm: React.FC<ProjectFormProps> = ({ projectToEdit }) => {
  const [project, setProject] = useState<Project>(
    projectToEdit || initialProjectState,
  );
  const [isPresent, setIsPresent] = useState(
    projectToEdit?.dateString?.includes('Present') || false,
  );

  const [newTool, setNewTool] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  // Use a stable mounted state to handle hydration safely
  const [mounted, setMounted] = useState(false);

  // Debounced image for preview
  const [displayImage, setDisplayImage] = useState(project.image);
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setDisplayImage(project.image);
    }, 2000); // 2 second debounce for better UX
    return () => clearTimeout(timer);
  }, [project.image]);

  const [startDate, setStartDate] = useState<Date>(new Date('2025-01-01'));
  const [endDate, setEndDate] = useState<Date>(new Date('2025-01-01'));

  useEffect(() => {
    if (!mounted) return;

    if (projectToEdit?.dateString) {
      const [startStr, endStr] = projectToEdit.dateString.split(' - ');
      setStartDate(new Date(startStr));
      setEndDate(endStr === 'Present' ? new Date() : new Date(endStr));
    } else {
      const now = new Date();
      setStartDate(now);
      setEndDate(now);
    }
  }, [projectToEdit, mounted]);

  // GitHub fetch states
  const [githubUrl, setGithubUrl] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);

  const fetchGitHubData = async () => {
    if (!githubUrl || !githubUrl.includes('github.com/')) return;

    setGithubLoading(true);
    setGithubError(null);

    try {
      // Extract owner and repo from URL
      const parts = githubUrl.replace(/\/$/, '').split('/');
      const repo = parts.pop();
      const owner = parts.pop();

      if (!owner || !repo) throw new Error('Invalid GitHub URL');

      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

      const data = await res.json();

      // Update project state with GitHub data
      setProject((prev) => ({
        ...prev,
        name: data.name || prev.name,
        description: data.description || prev.description,
        link: data.homepage || data.html_url || prev.link,
        tools: data.language ? [data.language] : prev.tools,
        image: prev.image, // Keep existing image by default
      }));

      // Try to fetch languages for more tools
      const langRes = await fetch(data.languages_url);
      if (langRes.ok) {
        const langs = await langRes.json();
        const topLangs = Object.keys(langs).slice(0, 5);
        if (topLangs.length > 0) {
          handleChange('tools', topLangs);
        }
      }

      // Try to fetch README
      const readmeRes = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
      );
      if (readmeRes.ok) {
        const readmeText = await readmeRes.text();
        handleChange('readme', readmeText);

        // Try to find an image in the README (markdown or html)
        const mdImageRegex = /!\[.*?\]\((.*?)\)/;
        const htmlImageRegex = /<img.*?src=["'](.*?)["']/;
        const match =
          readmeText.match(mdImageRegex) || readmeText.match(htmlImageRegex);

        if (match && match[1]) {
          let imageUrl = match[1];
          // Handle relative paths
          if (!imageUrl.startsWith('http')) {
            imageUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${imageUrl.replace(/^\.\//, '')}`;
          }
          handleChange('image', imageUrl);
        }
      }

      toast.success('GitHub data fetched successfully!');
      setGithubUrl('');
    } catch (err) {
      setGithubError(err instanceof Error ? err.message : String(err));
      toast.error('Failed to fetch GitHub data');
    } finally {
      setGithubLoading(false);
    }
  };

  const currentPreviewProject: Project = {
    id: project.id || 'preview',
    name: project.name || 'Project Name',
    image: displayImage || '/images/placeholder.png',
    description: project.description || 'Project Description',
    tools: project.tools.length ? project.tools : ['Project Tools'],
    link: project.link || '#',
    favicon: project.favicon || '',
    dateString: project.dateString || formatDateRange(startDate, endDate),
    readme: project.readme || '',
    status: project.status || 'inProgress',
    pinned: project.pinned || false,
    slug: project.slug || 'preview',
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

  const togglePin = () => {
    const newPinnedStatus = !project.pinned;
    setProject((prevProject) => ({
      ...prevProject,
      pinned: newPinnedStatus,
    }));
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
    console.log('Validating form...', project);
    for (const field of requiredProjectFields) {
      const value =
        field.key === 'dateRange' ? null : project[field.key as keyof Project];
      const isEmpty = field.check
        ? !field.check(value)
        : typeof value === 'string'
          ? !value.trim()
          : !value;

      if (isEmpty) {
        console.log(`Validation failed for field: ${field.label}`);
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    console.log('Validation passed');
    return true;
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit triggered');

    if (!validateForm()) return;

    const projectData = {
      ...project,
      id: projectToEdit?.id || generateSlug(project.name),
      dateString: formatDateRange(startDate, endDate, isPresent),
      readme: project.readme || '',
    };
    console.log('Submitting project data:', projectData);

    try {
      let result;

      if (imageFile || faviconFile) {
        const formData = new FormData();
        // Append all project fields
        Object.entries(projectData).forEach(([key, value]) => {
          if (key === 'tools' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        // Append files
        if (imageFile) formData.append('image', imageFile);
        if (faviconFile) formData.append('favicon', faviconFile);

        result = projectToEdit
          ? await updateProject(formData)
          : await addProject(formData);
      } else {
        result = projectToEdit
          ? await updateProject(projectData)
          : await addProject(projectData);
      }

      if (result.success) {
        toast.success(
          projectToEdit
            ? 'Project updated successfully!'
            : 'Project added successfully!',
        );
        router.push('/database/projects');
      } else {
        console.error('Save failed:', result.error);
        toast.error(result.error || 'Failed to save the project.');
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
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
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

        {/* GitHub Fetch */}
        <div className='space-y-3'>
          <FormLabel htmlFor='github-fetch'>Fetch from GitHub</FormLabel>
          <div className='flex gap-2'>
            <Input
              id='github-fetch'
              type='text'
              placeholder='https://github.com/username/repo'
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  fetchGitHubData();
                }
              }}
            />
            <Button
              type='primary'
              onClick={fetchGitHubData}
              disabled={githubLoading}
            >
              {githubLoading ? 'Fetching...' : 'Fetch'}
            </Button>
          </div>
          {githubError && (
            <p className='text-xs text-destructive'>{githubError}</p>
          )}
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
            <FormLabel htmlFor='image' required>
              Project Image
            </FormLabel>
            <Dropzone
              value={project.image}
              onUrlChange={(url) => handleChange('image', url)}
              onFileSelect={setImageFile}
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
                <Button className='w-full flex items-center justify-between gap-2 text-sm md:text-md text-foreground'>
                  <div className='flex items-center gap-2'>
                    {currentStatus?.icon && (
                      <Icon name={currentStatus.icon} className='size-4.5' />
                    )}
                    <span>{currentStatus?.label}</span>
                  </div>
                  <Icon name='caretDown' className='size-3' />
                </Button>
              }
              className='w-full'
              matchTriggerWidth
            >
              <div className='flex flex-col p-1 space-y-1 w-full'>
                {statusOptions.map((option) => (
                  <DropdownItem
                    key={option.key}
                    onClick={() => handleChange('status', option.key)}
                    isActive={option.key === project.status}
                    icon={option.icon}
                  >
                    {option.label}
                  </DropdownItem>
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
            <FormLabel htmlFor='faviconUrl'>Favicon</FormLabel>
            <Dropzone
              value={project.favicon || ''}
              onUrlChange={(url) => handleChange('favicon', url)}
              onFileSelect={setFaviconFile}
              placeholder='Paste favicon URL here...'
              aspectRatio='square'
            />
          </div>
          <div>
            <FormLabel htmlFor='readme'>Readme (optional)</FormLabel>
            <Editor
              content={project.readme || ''}
              onUpdate={(content) => handleChange('readme', content)}
            />
          </div>

          <Separator margin='5' />

          {projectToEdit ? (
            <div className='flex space-x-4'>
              <Button
                type='destructive'
                icon='trash'
                onClick={(e) => {
                  e.preventDefault();
                  confirmDelete();
                }}
                className='w-full'
              >
                Delete
              </Button>

              {project.pinned ? (
                <Button
                  icon='pushPinSlash'
                  onClick={(e) => {
                    e.preventDefault();
                    togglePin();
                  }}
                  className='w-full'
                >
                  <span>Unpin</span>
                </Button>
              ) : (
                <Button
                  icon='pushPin'
                  onClick={(e) => {
                    e.preventDefault();
                    togglePin();
                  }}
                  className='w-full'
                >
                  <span>Pin</span>
                </Button>
              )}

              <Button
                type='primary'
                nativeType='submit'
                icon='floppyDisk'
                className='w-full'
              >
                Save
              </Button>
            </div>
          ) : (
            <div className='flex space-x-4'>
              {project.pinned ? (
                <Button
                  icon='pushPinSlash'
                  onClick={(e) => {
                    e.preventDefault();
                    togglePin();
                  }}
                  className='w-full'
                >
                  <span>Unpin</span>
                </Button>
              ) : (
                <Button
                  icon='pushPin'
                  onClick={(e) => {
                    e.preventDefault();
                    togglePin();
                  }}
                  className='w-full'
                >
                  <span>Pin</span>
                </Button>
              )}
              <Button
                type='primary'
                nativeType='submit'
                icon='plus'
                className='w-full'
              >
                Add
              </Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ProjectForm;
