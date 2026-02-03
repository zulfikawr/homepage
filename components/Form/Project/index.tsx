'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DateSelect from '@/components/DateSelect';
import { Editor } from '@/components/Editor';
import { modal } from '@/components/UI';
import { toast } from '@/components/UI';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  FileUpload,
  FormLabel,
  Icon,
  Input,
  Textarea,
} from '@/components/UI';
import { ProjectCard } from '@/components/UI/Card/variants/Project';
import { IconName } from '@/components/UI/Icon';
import { Separator } from '@/components/UI/Separator';
import { addProject, deleteProject, updateProject } from '@/database/projects';
import { Project } from '@/types/project';
import { formatDateRange } from '@/utilities/formatDate';
import { generateSlug } from '@/utilities/generateSlug';

interface ProjectFormProps {
  project_to_edit?: Project;
}

const initial_project_state: Project = {
  id: '',
  name: '',
  image: '',
  description: '',
  tools: [],
  link: '',
  favicon: '',
  date_string: '',
  readme: '',
  status: 'in_progress',
  pinned: false,
  slug: '',
  github_repo_url: '',
};

const ProjectForm: React.FC<ProjectFormProps> = ({ project_to_edit }) => {
  const [project, set_project] = useState<Project>(
    project_to_edit || initial_project_state,
  );
  const [is_present, set_is_present] = useState(
    project_to_edit?.date_string?.includes('Present') || false,
  );

  const [new_tool, set_new_tool] = useState('');
  const [image_file, set_image_file] = useState<File | null>(null);
  const [favicon_file, set_favicon_file] = useState<File | null>(null);

  // Use a stable mounted state to handle hydration safely
  const [mounted, set_mounted] = useState(false);

  // Debounced image for preview
  const [display_image, set_display_image] = useState(project.image);
  useEffect(() => {
    set_mounted(true);
    const timer = setTimeout(() => {
      set_display_image(project.image);
    }, 2000); // 2 second debounce for better UX
    return () => clearTimeout(timer);
  }, [project.image]);

  const [start_date, set_start_date] = useState<Date>(new Date('2025-01-01'));
  const [end_date, set_end_date] = useState<Date>(new Date('2025-01-01'));

  useEffect(() => {
    if (!mounted) return;

    if (project_to_edit?.date_string) {
      const [start_str, end_str] = project_to_edit.date_string.split(' - ');
      set_start_date(new Date(start_str));
      set_end_date(end_str === 'Present' ? new Date() : new Date(end_str));
    } else {
      const now = new Date();
      set_start_date(now);
      set_end_date(now);
    }
  }, [project_to_edit, mounted]);

  // GitHub fetch states
  const [github_url, set_github_url] = useState('');
  const [github_loading, set_github_loading] = useState(false);
  const [github_error, set_github_error] = useState<string | null>(null);

  const fetch_github_data = async () => {
    if (!github_url || !github_url.includes('github.com/')) return;

    set_github_loading(true);
    set_github_error(null);

    try {
      // Extract owner and repo from URL
      const parts = github_url.replace(/\/$/, '').split('/');
      const repo = parts.pop();
      const owner = parts.pop();

      if (!owner || !repo) throw new Error('Invalid GitHub URL');

      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

      interface GitHubRepoResponse {
        name: string;
        description: string;
        homepage: string;
        html_url: string;
        language: string;
        languages_url: string;
      }
      const data = (await res.json()) as GitHubRepoResponse;

      // Update project state with GitHub data
      set_project((prev) => ({
        ...prev,
        name: data.name || prev.name,
        description: data.description || prev.description,
        link: data.homepage || data.html_url || prev.link,
        github_repo_url: data.html_url || prev.github_repo_url,
        tools: data.language ? [data.language] : prev.tools,
        image: prev.image, // Keep existing image by default
      }));

      // Try to fetch languages for more tools
      const lang_res = await fetch(data.languages_url);
      if (lang_res.ok) {
        const langs = (await lang_res.json()) as Record<string, number>;
        const top_langs = Object.keys(langs).slice(0, 5);
        if (top_langs.length > 0) {
          handle_change('tools', top_langs);
        }
      }

      // Try to fetch README
      const readme_res = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
      );
      if (readme_res.ok) {
        const readme_text = await readme_res.text();
        handle_change('readme', readme_text);

        // Try to find an image in the README (markdown or html)
        const md_image_regex = /!\[.*?\]\((.*?)\)/;
        const html_image_regex = /<img.*?src=["'](.*?)["']/;
        const match =
          readme_text.match(md_image_regex) ||
          readme_text.match(html_image_regex);

        if (match && match[1]) {
          let image_url = match[1];
          // Handle relative paths
          if (!image_url.startsWith('http')) {
            image_url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${image_url.replace(/^\.\//, '')}`;
          }
          handle_change('image', image_url);
        }
      }

      toast.success('GitHub data fetched successfully!');
      set_github_url('');
    } catch (err) {
      set_github_error(err instanceof Error ? err.message : String(err));
      toast.error('Failed to fetch GitHub data');
    } finally {
      set_github_loading(false);
    }
  };

  const current_preview_project: Project = {
    id: project.id || 'preview',
    name: project.name || 'Project Name',
    image: display_image || '/images/placeholder.png',
    image_url: display_image || '/images/placeholder.png',
    description: project.description || 'Project Description',
    tools: project.tools.length ? project.tools : ['Project Tools'],
    link: project.link || '#',
    favicon: project.favicon || '',
    favicon_url: project.favicon || '',
    date_string: project.date_string || formatDateRange(start_date, end_date),
    readme: project.readme || '',
    status: project.status || 'in_progress',
    pinned: project.pinned || false,
    slug: project.slug || 'preview',
  };

  const handle_change = (
    field: keyof Project,
    value: string | string[] | Date,
  ) => {
    set_project((prev) => ({ ...prev, [field]: value }));
  };

  const handle_add_tool = () => {
    const trimmed = new_tool.trim();
    if (trimmed && !project.tools.includes(trimmed)) {
      handle_change('tools', [...project.tools, trimmed]);
      set_new_tool('');
    }
  };

  const handle_remove_tool = (index: number) => {
    const updated = project.tools.filter((_, i) => i !== index);
    handle_change('tools', updated);
  };

  const handle_tool_change = (index: number, value: string) => {
    const updated = [...project.tools];
    updated[index] = value;
    handle_change('tools', updated);
  };

  const toggle_pin = () => {
    const new_pinned_status = !project.pinned;
    set_project((prev_project) => ({
      ...prev_project,
      pinned: new_pinned_status,
    }));
  };

  const required_project_fields: {
    key: keyof Project | 'date_range';
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
      key: 'date_range',
      label: 'Date range',
      check: () => !!start_date && !!end_date,
    },
  ];

  const validate_form = () => {
    for (const field of required_project_fields) {
      const value =
        field.key === 'date_range' ? null : project[field.key as keyof Project];
      const is_empty = field.check
        ? !field.check(value)
        : typeof value === 'string'
          ? !value.trim()
          : !value;

      if (is_empty) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const router = useRouter();

  const handle_submit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!validate_form()) return;

    const project_data = {
      ...project,
      id: project_to_edit?.id || generateSlug(project.name),
      date_string: formatDateRange(start_date, end_date, is_present),
      readme: project.readme || '',
    };

    try {
      let result;

      if (image_file || favicon_file) {
        const form_data = new FormData();
        // Append all project fields
        Object.entries(project_data).forEach(([key, value]) => {
          if (key === 'tools' && Array.isArray(value)) {
            form_data.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            form_data.append(key, value.toString());
          }
        });

        // Append files
        if (image_file) form_data.append('image', image_file);
        if (favicon_file) form_data.append('favicon', favicon_file);

        result = project_to_edit
          ? await updateProject(form_data)
          : await addProject(form_data);
      } else {
        result = project_to_edit
          ? await updateProject(project_data)
          : await addProject(project_data);
      }

      if (result.success) {
        toast.success(
          project_to_edit
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

  const handle_delete = async () => {
    if (!project_to_edit) return;

    try {
      const result = await deleteProject(project_to_edit.id);

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

  const confirm_delete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete the following project? This action
          cannot be undone.
        </p>
        <div className='mb-6'>
          <ProjectCard project={current_preview_project} isPreview />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              handle_delete();
              modal.close();
            }}
          >
            Delete
          </Button>
        </div>
      </div>,
    );
  };

  const status_options: { key: string; label: string; icon: IconName }[] = [
    { key: 'in_progress', label: 'Work in Progress', icon: 'gear' },
    { key: 'completed', label: 'Completed', icon: 'checkCircle' },
    { key: 'upcoming', label: 'Upcoming', icon: 'clock' },
  ];

  const current_status = status_options.find(
    (opt) => opt.key === project.status,
  );

  return (
    <>
      <div className='space-y-6'>
        {/* Project Preview */}
        <div className='flex justify-center'>
          <ProjectCard project={current_preview_project} isPreview />
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
              value={github_url || ''}
              onChange={(e) => set_github_url(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e?.preventDefault();
                  fetch_github_data();
                }
              }}
            />
            <Button
              variant='primary'
              onClick={fetch_github_data}
              disabled={github_loading}
            >
              {github_loading ? 'Fetching...' : 'Fetch'}
            </Button>
          </div>
          {github_error && (
            <p className='text-xs text-destructive'>{github_error}</p>
          )}
        </div>

        <Separator margin='5' />

        {/* Form */}
        <form onSubmit={handle_submit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='name' required>
              Name
            </FormLabel>
            <Input
              type='text'
              value={project.name || ''}
              onChange={(e) => handle_change('name', e.target.value)}
              placeholder='Project name'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='image' required>
              Project Image
            </FormLabel>
            <Input
              type='text'
              value={project.image || ''}
              onChange={(e) => handle_change('image', e.target.value)}
              placeholder='Image URL or select file below'
              className='mb-2'
            />
            <FileUpload
              collectionName='projects'
              fieldName='image'
              existingValue={project.image}
              onFileSelect={set_image_file}
              onUploadSuccess={(url) => handle_change('image', url)}
              accept='image/*'
            />
          </div>
          <div>
            <FormLabel htmlFor='description' required>
              Description
            </FormLabel>
            <Textarea
              value={project.description || ''}
              onChange={(e) => handle_change('description', e.target.value)}
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
                    value={tool || ''}
                    onChange={(e) => handle_tool_change(index, e.target.value)}
                  />
                  <Button
                    variant='destructive'
                    icon='trashSimple'
                    onClick={() => handle_remove_tool(index)}
                  />
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <Input
                  type='text'
                  value={new_tool || ''}
                  onChange={(e) => set_new_tool(e.target.value)}
                  placeholder='Add a keyword'
                />
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handle_add_tool}
                />
              </div>
            </div>
          </div>
          <div className='space-y-2'>
            <div>
              <FormLabel required>Start Date</FormLabel>
              <DateSelect
                value={start_date}
                onChange={(new_date) => {
                  set_start_date(new_date);
                  if (is_present) {
                    set_end_date(new_date);
                  }
                }}
                mode='month-year'
              />
            </div>
            <div>
              <FormLabel>End Date</FormLabel>
              <DateSelect
                value={end_date}
                onChange={set_end_date}
                mode='month-year'
                disabled={is_present}
              />
            </div>

            <Checkbox
              id='is_present'
              checked={is_present}
              onChange={(checked) => {
                set_is_present(checked);
                if (checked) {
                  set_end_date(new Date());
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
                <Button className='w-full flex items-center justify-between gap-2 text-sm md:text-md text-foreground px-2'>
                  <div className='flex items-center gap-2'>
                    {current_status?.icon && (
                      <Icon name={current_status.icon} className='size-4.5' />
                    )}
                    <span>{current_status?.label}</span>
                  </div>
                  <Icon name='caretDown' className='size-3' />
                </Button>
              }
              className='w-full'
              matchTriggerWidth
            >
              <div className='flex flex-col p-1 space-y-1 w-full'>
                {status_options.map((option) => (
                  <DropdownItem
                    key={option.key}
                    onClick={() => handle_change('status', option.key)}
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
              value={project.link || ''}
              onChange={(e) => handle_change('link', e.target.value)}
              placeholder='https://project-link.com'
            />
          </div>
          <div>
            <FormLabel htmlFor='github_repo_url'>
              GitHub Repository URL
            </FormLabel>
            <Input
              type='text'
              value={project.github_repo_url || ''}
              onChange={(e) => handle_change('github_repo_url', e.target.value)}
              placeholder='https://github.com/username/repo'
            />
          </div>
          <div>
            <FormLabel htmlFor='favicon_url'>Favicon</FormLabel>
            <Input
              type='text'
              value={project.favicon || ''}
              onChange={(e) => handle_change('favicon', e.target.value)}
              placeholder='Favicon URL or select file below'
              className='mb-2'
            />
            <FileUpload
              collectionName='projects'
              fieldName='favicon'
              existingValue={project.favicon}
              onFileSelect={set_favicon_file}
              onUploadSuccess={(url) => handle_change('favicon', url)}
              accept='image/*'
            />
          </div>
          <div>
            <FormLabel htmlFor='readme'>Readme (optional)</FormLabel>
            <Editor
              content={project.readme || ''}
              onUpdate={(content) => handle_change('readme', content)}
            />
          </div>

          <Separator margin='5' />

          {project_to_edit ? (
            <div className='flex space-x-4'>
              <Button
                variant='destructive'
                icon='trash'
                onClick={(e) => {
                  e?.preventDefault();
                  confirm_delete();
                }}
                className='w-full'
              >
                Delete
              </Button>

              {project.pinned ? (
                <Button
                  icon='pushPinSlash'
                  onClick={(e) => {
                    e?.preventDefault();
                    toggle_pin();
                  }}
                  className='w-full'
                >
                  <span>Unpin</span>
                </Button>
              ) : (
                <Button
                  icon='pushPin'
                  onClick={(e) => {
                    e?.preventDefault();
                    toggle_pin();
                  }}
                  className='w-full'
                >
                  <span>Pin</span>
                </Button>
              )}

              <Button
                variant='primary'
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
                    e?.preventDefault();
                    toggle_pin();
                  }}
                  className='w-full'
                >
                  <span>Unpin</span>
                </Button>
              ) : (
                <Button
                  icon='pushPin'
                  onClick={(e) => {
                    e?.preventDefault();
                    toggle_pin();
                  }}
                  className='w-full'
                >
                  <span>Pin</span>
                </Button>
              )}
              <Button
                variant='primary'
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
