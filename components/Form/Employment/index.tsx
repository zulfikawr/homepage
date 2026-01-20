import React, { useState, useEffect } from 'react';
import { Employment } from '@/types/employment';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  FormLabel,
  Icon,
  Input,
} from '@/components/UI';
import { EmploymentCard } from '@/components/Card/Employment';
import { toast } from '@/components/Toast';
import {
  addEmployment,
  updateEmployment,
  deleteEmployment,
} from '@/database/employments';
import { generateSlug } from '@/utilities/generateSlug';
import { formatDateRange } from '@/utilities/formatDate';
import { modal } from '@/components/Modal';
import { Separator } from '@/components/UI/Separator';
import DateSelect from '@/components/DateSelect';
import { useRouter } from 'next/navigation';

interface EmploymentFormProps {
  employmentToEdit?: Employment;
}

const initialEmploymentState: Employment = {
  id: '',
  slug: '',
  organization: '',
  organizationIndustry: '',
  jobTitle: '',
  jobType: 'fullTime',
  responsibilities: [],
  dateString: '',
  orgLogoSrc: '',
  organizationLocation: '',
};

const EmploymentForm: React.FC<EmploymentFormProps> = ({
  employmentToEdit,
}) => {
  const [employment, setEmployment] = useState<Employment>(
    employmentToEdit || initialEmploymentState,
  );
  const [isPresent, setIsPresent] = useState(
    employmentToEdit?.dateString?.includes('Present') || false,
  );
  const [newResponsibility, setNewResponsibility] = useState('');

  const [startDate, setStartDate] = useState<Date>(() => {
    if (employmentToEdit?.dateString) {
      const [startStr] = employmentToEdit.dateString.split(' - ');
      return new Date(startStr);
    }
    return new Date('2025-01-01');
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    if (employmentToEdit?.dateString) {
      const [, endStr] = employmentToEdit.dateString.split(' - ');
      return endStr === 'Present' ? new Date() : new Date(endStr);
    }
    return new Date('2025-01-01');
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (employmentToEdit?.dateString) {
        const [startStr, endStr] = employmentToEdit.dateString.split(' - ');
        setStartDate(new Date(startStr));
        setEndDate(endStr === 'Present' ? new Date() : new Date(endStr));
      } else {
        const now = new Date();
        setStartDate(now);
        setEndDate(now);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [employmentToEdit]);

  const currentPreviewEmployment: Employment = {
    id: employment.id || 'preview',
    slug: employment.slug || 'preview',
    organization: employment.organization || 'Organization Name',
    organizationIndustry:
      employment.organizationIndustry || 'Organization Industry',
    jobTitle: employment.jobTitle || 'Job Title',
    jobType: employment.jobType || 'fullTime',
    responsibilities: employment.responsibilities || [
      'Responsibility 1',
      'Responsibility 2',
    ],
    dateString: employment.dateString || formatDateRange(startDate, endDate),
    orgLogoSrc: employment.orgLogoSrc || '/images/placeholder-square.png',
    organizationLocation:
      employment.organizationLocation || 'Organization Location',
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
    { key: 'orgLogoSrc', label: 'Organization logo' },
    { key: 'jobTitle', label: 'Job title' },
    { key: 'jobType', label: 'Job type' },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const employmentData = {
      ...employment,
      id: employmentToEdit?.id || generateSlug(employment.organization),
      dateString: formatDateRange(startDate, endDate, isPresent),
    };

    try {
      const result = employmentToEdit
        ? await updateEmployment(employmentData)
        : await addEmployment(employmentData);

      if (result.success) {
        toast.success(
          employmentToEdit
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

  const handleDelete = async () => {
    if (!employmentToEdit) return;

    try {
      const result = await deleteEmployment(employmentToEdit.id);

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

  const confirmDelete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-neutral-800 dark:text-neutral-300'>
          Are you sure you want to delete the following employment? This action
          cannot be undone.
        </p>
        <div className='mb-6'>
          <EmploymentCard employment={currentPreviewEmployment} isInForm />
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
    { key: 'fullTime', label: 'Full-time' },
    { key: 'partTime', label: 'Part-time' },
    { key: 'contract', label: 'Contract' },
    { key: 'freelance', label: 'Freelance' },
    { key: 'internship', label: 'Internship' },
  ];

  const currentJobType = jobTypeOptions.find(
    (opt) => opt.key === employment.jobType,
  );

  return (
    <>
      <div className='space-y-6'>
        {/* Employment Preview */}
        <div className='flex justify-center'>
          <EmploymentCard employment={currentPreviewEmployment} isInForm />
        </div>

        <Separator margin='5' />

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='jobTitle' required>
              Job Title
            </FormLabel>
            <Input
              type='text'
              value={employment.jobTitle}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              placeholder='Web Developer'
              required
            />
          </div>

          <div>
            <FormLabel htmlFor='jobType' required>
              Job Type
            </FormLabel>
            <Dropdown
              trigger={
                <Button className='flex items-center justify-between w-full px-2 text-sm md:text-md text-foreground'>
                  {currentJobType?.label}
                  <Icon name='caretDown' className='size-3' />
                </Button>
              }
              className='w-full'
              matchTriggerWidth
            >
              <div className='flex flex-col p-1 space-y-1 w-full'>
                {jobTypeOptions.map((option) => (
                  <DropdownItem
                    key={option.key}
                    onClick={() => handleChange('jobType', option.key)}
                    isActive={option.key === employment.jobType}
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
                    value={responsibility}
                    onChange={(e) => {
                      const updatedResponsibilities = [
                        ...employment.responsibilities,
                      ];
                      updatedResponsibilities[index] = e.target.value;
                      handleChange('responsibilities', updatedResponsibilities);
                    }}
                  />
                  <Button
                    type='destructive'
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
                  type='primary'
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
                }}
                mode='day-month-year'
              />
            </div>
            <div>
              <FormLabel>End Date</FormLabel>
              <DateSelect
                value={endDate}
                onChange={setEndDate}
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
              value={employment.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              placeholder='Organization name'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='organizationIndustry'>
              Organization Industry
            </FormLabel>
            <Input
              type='text'
              value={employment.organizationIndustry}
              onChange={(e) =>
                handleChange('organizationIndustry', e.target.value)
              }
              placeholder='Artificial Intelligence'
            />
          </div>
          <div>
            <FormLabel htmlFor='organizationLocation'>
              Organization Location
            </FormLabel>
            <Input
              type='text'
              value={employment.organizationLocation}
              onChange={(e) =>
                handleChange('organizationLocation', e.target.value)
              }
              placeholder='Organization location'
            />
          </div>
          <div>
            <FormLabel htmlFor='organizationLogoUrl' required>
              Organization Logo URL
            </FormLabel>
            <Input
              type='text'
              value={employment.orgLogoSrc}
              onChange={(e) => handleChange('orgLogoSrc', e.target.value)}
              placeholder='https://organization-logo.com'
              required
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {employmentToEdit ? (
        <div className='flex space-x-4'>
          <Button
            type='destructive'
            icon='trash'
            onClick={confirmDelete}
            className='w-full'
          >
            Delete
          </Button>
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

export default EmploymentForm;
