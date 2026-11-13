'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import DateSelect from '@/components/date-select';
import ImageWithFallback from '@/components/image-with-fallback';
import { FileBrowser } from '@/components/ui/file-browser';
import { modal } from '@/components/ui';
import { toast } from '@/components/ui';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  FormLabel,
  Input,
} from '@/components/ui';
import { EmploymentCard } from '@/components/ui/card/variants/employment';
import { Separator } from '@/components/ui/separator';
import { getFileUrl } from '@/lib/storage';
import { Employment } from '@/types/employment';
import { formatDateRange, parseDateRangeString } from '@/utilities/format-date';
import { generateSlug } from '@/utilities/generate-slug';

interface EmploymentFormProps {
  employmentToEdit?: Employment;
}

const initialEmploymentState: Employment = {
  id: '',
  slug: '',
  organization: '',
  organization_industry: '',
  job_title: '',
  job_type: 'full_time',
  responsibilities: [],
  date_string: '',
  logo: '',
  logo_url: '',
  organization_location: '',
};

const EmploymentForm: React.FC<EmploymentFormProps> = ({
  employmentToEdit,
}) => {
  const [startDate, setStartDate] = useState<Date>(
    () => parseDateRangeString(employmentToEdit?.date_string).start,
  );
  const [endDate, setEndDate] = useState<Date>(
    () => parseDateRangeString(employmentToEdit?.date_string).end,
  );
  const [employment, setEmployment] = useState<Employment>(
    () =>
      employmentToEdit || {
        ...initialEmploymentState,
        date_string: formatDateRange(startDate, endDate),
      },
  );
  const [isPresent, setIsPresent] = useState(
    parseDateRangeString(employmentToEdit?.date_string).isPresent,
  );
  const [newResponsibility, setNewResponsibility] = useState('');

  const currentPreviewEmployment: Employment = {
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
    date_string: employment.date_string || formatDateRange(startDate, endDate),
    logo: getFileUrl({}, employment.logo_url || ''),
    organization_location:
      employment.organization_location || 'Organization Location',
  };

  const handleChange = (field: keyof Employment, value: string | string[]) => {
    setEmployment((prev) => ({ ...prev, [field]: value }));
  };

  const requiredEmploymentFields: {
    key: keyof typeof employment | 'dateRange';
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
      key: 'dateRange',
      label: 'Date range',
      check: () => !!startDate && !!endDate,
    },
  ];

  const validateForm = () => {
    for (const field of requiredEmploymentFields) {
      const value =
        field.key === 'dateRange'
          ? null
          : employment[field.key as keyof typeof employment];
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

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!validateForm()) return;

    const employmentData = {
      ...employment,
      id: employmentToEdit?.id || '',
      slug: employment.slug || generateSlug(employment.organization),
      date_string: formatDateRange(startDate, endDate, isPresent),
    };

    try {
      const formData = new FormData();
      Object.entries(employmentData).forEach(([key, value]) => {
        if (key === 'responsibilities' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch('/api/collection/employments', {
        method: employmentToEdit ? 'PUT' : 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (result.success) {
        toast.success(
          employmentToEdit
            ? 'Employment updated successfully!'
            : 'Employment added successfully!',
        );
        router.push('/database/employments');
      } else {
        toast.error(result.error || 'Failed to save the employment.');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error saving the employment: ${error.message}`
          : 'An unknown error occurred while saving the employment.',
      );
    }
  };

  const handleDelete = async () => {
    if (!employmentToEdit) return;

    try {
      const response = await fetch(
        `/api/collection/employments?id=${employmentToEdit.id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (result.success) {
        toast.success('Employment deleted successfully!');
        router.push('/database/employments');
      } else {
        toast.error(result.error || 'Failed to delete the employment.');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error deleting the employment: ${error.message}`
          : 'An unknown error occurred while deleting the employment.',
      );
    }
  };

  const confirmDelete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete the following employment? This action
          cannot be undone.
        </p>
        <div className='mb-6'>
          <EmploymentCard employment={currentPreviewEmployment} isPreview />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='destructive'
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

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      handleChange('responsibilities', [
        ...employment.responsibilities,
        newResponsibility.trim(),
      ]);
      setNewResponsibility('');
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    const updatedResponsibilities = employment.responsibilities.filter(
      (_, i) => i !== index,
    );
    handleChange('responsibilities', updatedResponsibilities);
  };

  const jobTypeOptions = [
    { key: 'full_time', label: 'Full-time' },
    { key: 'part_time', label: 'Part-time' },
    { key: 'contract', label: 'Contract' },
    { key: 'freelance', label: 'Freelance' },
    { key: 'internship', label: 'Internship' },
  ];

  const currentJobType = jobTypeOptions.find(
    (opt) => opt.key === employment.job_type,
  );

  const openLogoBrowser = () => {
    modal.open(
      <FileBrowser
        onSelect={(key) => handleChange('logo_url', key)}
        onClose={() => modal.close()}
      />,
    );
  };

  return (
    <>
      <div className='space-y-6'>
        {/* Employment Preview */}
        <div className='flex justify-center'>
          <EmploymentCard employment={currentPreviewEmployment} isPreview />
        </div>

        <Separator margin='5' />

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='job_title' required>
              Job Title
            </FormLabel>
            <Input
              type='text'
              value={employment.job_title || ''}
              onChange={(e) => handleChange('job_title', e.target.value)}
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
                <Button className='w-full text-base px-2'>
                  {currentJobType?.label}
                </Button>
              }
              className='w-full'
              matchTriggerWidth
            >
              {jobTypeOptions.map((option) => (
                <DropdownItem
                  key={option.key}
                  onClick={() => handleChange('job_type', option.key)}
                  isActive={option.key === employment.job_type}
                >
                  {option.label}
                </DropdownItem>
              ))}
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
                      const updatedResponsibilities = [
                        ...employment.responsibilities,
                      ];
                      updatedResponsibilities[index] = e.target.value;
                      handleChange('responsibilities', updatedResponsibilities);
                    }}
                  />
                  <Button
                    variant='destructive'
                    icon='trashSimple'
                    onClick={() => handleRemoveResponsibility(index)}
                  />
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <Input
                  type='text'
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  placeholder='Add a responsibility'
                />
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handleAddResponsibility}
                />
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
                  handleChange(
                    'date_string',
                    formatDateRange(
                      newDate,
                      isPresent ? newDate : endDate,
                      isPresent,
                    ),
                  );
                }}
                mode='day-month-year'
              />
            </div>
            <div>
              <FormLabel>End Date</FormLabel>
              <DateSelect
                value={endDate}
                onChange={(newDate) => {
                  setEndDate(newDate);
                  handleChange(
                    'date_string',
                    formatDateRange(startDate, newDate, isPresent),
                  );
                }}
                mode='day-month-year'
                className={isPresent ? 'opacity-50' : ''}
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
                handleChange(
                  'date_string',
                  formatDateRange(
                    startDate,
                    checked ? new Date() : endDate,
                    checked,
                  ),
                );
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
                const newOrg = e.target.value;
                setEmployment((prev) => ({
                  ...prev,
                  organization: newOrg,
                  slug:
                    prev.slug || !employmentToEdit
                      ? generateSlug(newOrg)
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
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder='organization-name'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='logo_url'>Logo</FormLabel>
            <div className='flex items-center gap-3'>
              <div className='relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted'>
                <ImageWithFallback
                  src={getFileUrl({}, employment.logo_url || '')}
                  alt={`${employment.organization || 'Organization'} logo`}
                  width={36}
                  height={36}
                  type='square'
                  className='h-full w-full object-contain'
                />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate font-mono text-[11px] text-muted-foreground'>
                  {employment.logo_url || 'No logo selected'}
                </p>
              </div>
              <Button variant='default' icon='folder' onClick={openLogoBrowser}>
                Select
              </Button>
              {employment.logo_url && (
                <Button
                  variant='destructive'
                  icon='x'
                  onClick={() => handleChange('logo_url', '')}
                  title='Remove logo'
                />
              )}
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
                handleChange('organization_industry', e.target.value)
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
                handleChange('organization_location', e.target.value)
              }
              placeholder='Organization location'
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {employmentToEdit ? (
        <div className='flex space-x-4'>
          <Button
            variant='destructive'
            icon='trash'
            onClick={confirmDelete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            variant='primary'
            icon='floppyDisk'
            onClick={handleSubmit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant='primary'
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

export default EmploymentForm;
