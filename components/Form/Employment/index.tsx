import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DateSelect from '@/components/DateSelect';
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
} from '@/components/UI';
import { EmploymentCard } from '@/components/UI/Card/variants/Employment';
import { Separator } from '@/components/UI/Separator';
import {
  addEmployment,
  deleteEmployment,
  updateEmployment,
} from '@/database/employments';
import { Employment } from '@/types/employment';
import { formatDateRange } from '@/utilities/formatDate';
import { generateSlug } from '@/utilities/generateSlug';

interface EmploymentFormProps {
  employment_to_edit?: Employment;
}

const initial_employment_state: Employment = {
  id: '',
  slug: '',
  organization: '',
  organization_industry: '',
  job_title: '',
  job_type: 'full_time',
  responsibilities: [],
  date_string: '',
  organization_logo: '',
  organization_logo_url: '',
  organization_location: '',
};

const EmploymentForm: React.FC<EmploymentFormProps> = ({
  employment_to_edit,
}) => {
  const [employment, set_employment] = useState<Employment>(
    employment_to_edit || initial_employment_state,
  );
  const [is_present, set_is_present] = useState(
    employment_to_edit?.date_string?.includes('Present') || false,
  );
  const [new_responsibility, set_new_responsibility] = useState('');
  const [logo_file, set_logo_file] = useState<File | null>(null);

  const [start_date, set_start_date] = useState<Date>(() => {
    if (employment_to_edit?.date_string) {
      const [start_str] = employment_to_edit.date_string.split(' - ');
      return new Date(start_str);
    }
    return new Date('2025-01-01');
  });
  const [end_date, set_end_date] = useState<Date>(() => {
    if (employment_to_edit?.date_string) {
      const [, end_str] = employment_to_edit.date_string.split(' - ');
      return end_str === 'Present' ? new Date() : new Date(end_str);
    }
    return new Date('2025-01-01');
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (employment_to_edit?.date_string) {
        const [start_str, end_str] =
          employment_to_edit.date_string.split(' - ');
        set_start_date(new Date(start_str));
        set_end_date(end_str === 'Present' ? new Date() : new Date(end_str));
      } else {
        const now = new Date();
        set_start_date(now);
        set_end_date(now);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [employment_to_edit]);

  const current_preview_employment: Employment = {
    id: employment.id || 'preview',
    slug: employment.slug || 'preview',
    organization: employment.organization || 'Organization Name',
    organization_industry:
      employment.organization_industry || 'Organization Industry',
    job_title: employment.job_title || 'Job Title',
    job_type: employment.job_type || 'full_time',
    responsibilities: employment.responsibilities || [
      'Responsibility 1',
      'Responsibility 2',
    ],
    date_string:
      employment.date_string || formatDateRange(start_date, end_date),
    organization_logo:
      employment.organization_logo_url || '/images/placeholder-square.png',
    organization_location:
      employment.organization_location || 'Organization Location',
  };

  const handle_change = (field: keyof Employment, value: string | string[]) => {
    set_employment((prev) => ({ ...prev, [field]: value }));
  };

  const required_employment_fields: {
    key: keyof typeof employment | 'date_range';
    label: string;
    check?: (value: (typeof employment)[keyof typeof employment]) => boolean;
  }[] = [
    { key: 'organization', label: 'Organization name' },
    { key: 'job_title', label: 'Job title' },
    { key: 'job_type', label: 'Job type' },
    {
      key: 'responsibilities',
      label: 'At least one responsibility',
      check: (val) => Array.isArray(val) && val.length > 0,
    },
    {
      key: 'date_range',
      label: 'Date range',
      check: () => !!start_date && !!end_date,
    },
  ];

  const validate_form = () => {
    for (const field of required_employment_fields) {
      const value =
        field.key === 'date_range'
          ? null
          : employment[field.key as keyof typeof employment];
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

    const employment_data = {
      ...employment,
      id: employment_to_edit?.id || '',
      slug: employment.slug || generateSlug(employment.organization),
      date_string: formatDateRange(start_date, end_date, is_present),
    };

    try {
      let result;

      if (logo_file) {
        const form_data = new FormData();
        Object.entries(employment_data).forEach(([key, value]) => {
          if (key === 'responsibilities' && Array.isArray(value)) {
            form_data.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            form_data.append(key, value.toString());
          }
        });
        form_data.append('organization_logo', logo_file);

        result = employment_to_edit
          ? await updateEmployment(form_data)
          : await addEmployment(form_data);
      } else {
        result = employment_to_edit
          ? await updateEmployment(employment_data)
          : await addEmployment(employment_data);
      }

      if (result.success) {
        toast.success(
          employment_to_edit
            ? 'Employment updated successfully!'
            : 'Employment added successfully!',
        );
        router.push('/database/employments');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error saving the employment: ${error.message}`
          : 'An unknown error occurred while saving the employment.',
      );
    }
  };

  const handle_delete = async () => {
    if (!employment_to_edit) return;

    try {
      const result = await deleteEmployment(employment_to_edit.id);

      if (result.success) {
        toast.success('Employment deleted successfully!');
        router.push('/database/employments');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error deleting the employment: ${error.message}`
          : 'An unknown error occurred while deleting the employment.',
      );
    }
  };

  const confirm_delete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete the following employment? This action
          cannot be undone.
        </p>
        <div className='mb-6'>
          <EmploymentCard employment={current_preview_employment} isPreview />
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

  const handle_add_responsibility = () => {
    if (new_responsibility.trim()) {
      handle_change('responsibilities', [
        ...employment.responsibilities,
        new_responsibility.trim(),
      ]);
      set_new_responsibility('');
    }
  };

  const handle_remove_responsibility = (index: number) => {
    const updated_responsibilities = employment.responsibilities.filter(
      (_, i) => i !== index,
    );
    handle_change('responsibilities', updated_responsibilities);
  };

  const job_type_options = [
    { key: 'full_time', label: 'Full-time' },
    { key: 'part_time', label: 'Part-time' },
    { key: 'contract', label: 'Contract' },
    { key: 'freelance', label: 'Freelance' },
    { key: 'internship', label: 'Internship' },
  ];

  const current_job_type = job_type_options.find(
    (opt) => opt.key === employment.job_type,
  );

  return (
    <>
      <div className='space-y-6'>
        {/* Employment Preview */}
        <div className='flex justify-center'>
          <EmploymentCard employment={current_preview_employment} isPreview />
        </div>

        <Separator margin='5' />

        {/* Form */}
        <form onSubmit={handle_submit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='job_title' required>
              Job Title
            </FormLabel>
            <Input
              type='text'
              value={employment.job_title || ''}
              onChange={(e) => handle_change('job_title', e.target.value)}
              placeholder='Web Developer'
              required
            />
          </div>

          <div>
            <FormLabel htmlFor='job_type' required>
              Job Type
            </FormLabel>
            <Dropdown
              trigger={
                <Button className='flex items-center justify-between w-full text-base'>
                  {current_job_type?.label}
                  <Icon name='caretDown' className='size-4' />
                </Button>
              }
              className='w-full'
              matchTriggerWidth
            >
              <div className='flex flex-col p-1 space-y-1 w-full'>
                {job_type_options.map((option) => (
                  <DropdownItem
                    key={option.key}
                    onClick={() => handle_change('job_type', option.key)}
                    isActive={option.key === employment.job_type}
                  >
                    {option.label}
                  </DropdownItem>
                ))}
              </div>
            </Dropdown>
          </div>
          <div>
            <FormLabel htmlFor='responsibilities' required>
              Responsibilities
            </FormLabel>
            <div className='space-y-2'>
              {employment.responsibilities.map((responsibility, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    type='text'
                    value={responsibility || ''}
                    onChange={(e) => {
                      const updated_responsibilities = [
                        ...employment.responsibilities,
                      ];
                      updated_responsibilities[index] = e.target.value;
                      handle_change(
                        'responsibilities',
                        updated_responsibilities,
                      );
                    }}
                  />
                  <Button
                    variant='destructive'
                    icon='trashSimple'
                    className='h-9'
                    onClick={() => handle_remove_responsibility(index)}
                  />
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <Input
                  type='text'
                  value={new_responsibility}
                  onChange={(e) => set_new_responsibility(e.target.value)}
                  placeholder='Add a responsibility'
                />
                <Button
                  variant='primary'
                  icon='plus'
                  className='h-9'
                  onClick={handle_add_responsibility}
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
                mode='day-month-year'
              />
            </div>
            <div>
              <FormLabel>End Date</FormLabel>
              <DateSelect
                value={end_date}
                onChange={set_end_date}
                mode='day-month-year'
                className={is_present ? 'opacity-50' : ''}
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
              label='I currently working on this organization'
            />
          </div>
          <div>
            <FormLabel htmlFor='organization' required>
              Organization
            </FormLabel>
            <Input
              type='text'
              value={employment.organization || ''}
              onChange={(e) => {
                const new_org = e.target.value;
                set_employment((prev) => ({
                  ...prev,
                  organization: new_org,
                  slug:
                    prev.slug || !employment_to_edit
                      ? generateSlug(new_org)
                      : prev.slug,
                }));
              }}
              placeholder='Organization name'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='slug' required>
              Slug
            </FormLabel>
            <Input
              type='text'
              value={employment.slug || ''}
              onChange={(e) => handle_change('slug', e.target.value)}
              placeholder='organization-name'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='organization_logo_url' required>
              Organization Logo
            </FormLabel>
            <div className='flex gap-2'>
              <Input
                type='text'
                value={employment.organization_logo_url || ''}
                onChange={(e) =>
                  handle_change('organization_logo_url', e.target.value)
                }
                placeholder='https://organization-logo.com'
              />
              <FileUpload
                collectionName='employments'
                recordId={employment_to_edit?.id}
                fieldName='organization_logo'
                existingValue={employment.organization_logo_url}
                onUploadSuccess={(url) =>
                  handle_change('organization_logo_url', url)
                }
                onFileSelect={set_logo_file}
              />
            </div>
          </div>
          <div>
            <FormLabel htmlFor='organization_industry'>
              Organization Industry
            </FormLabel>
            <Input
              type='text'
              value={employment.organization_industry || ''}
              onChange={(e) =>
                handle_change('organization_industry', e.target.value)
              }
              placeholder='Artificial Intelligence'
            />
          </div>
          <div>
            <FormLabel htmlFor='organization_location'>
              Organization Location
            </FormLabel>
            <Input
              type='text'
              value={employment.organization_location || ''}
              onChange={(e) =>
                handle_change('organization_location', e.target.value)
              }
              placeholder='Organization location'
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {employment_to_edit ? (
        <div className='flex space-x-4'>
          <Button
            variant='destructive'
            icon='trash'
            onClick={confirm_delete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            variant='primary'
            icon='floppyDisk'
            onClick={handle_submit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant='primary'
          icon='plus'
          onClick={handle_submit}
          className='w-full'
        >
          Add
        </Button>
      )}
    </>
  );
};

export default EmploymentForm;
