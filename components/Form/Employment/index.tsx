'use client';

import React, { useState, useMemo } from 'react';
import { Employment } from 'types/employment';
import { drawer } from 'components/Drawer';
import { Button, Checkbox, FormLabel, Input } from 'components/UI';
import { EmploymentCard } from 'components/Card/Employment';
import { toast } from 'components/Toast';
import {
  addEmployment,
  updateEmployment,
  deleteEmployment,
} from 'functions/employments';
import { generateId } from 'utilities/generateId';
import DatePicker from '@/components/DatePicker';
import { modal } from '@/components/Modal';

interface EmploymentFormProps {
  employmentToEdit?: Employment;
  onUpdate: () => Promise<void>;
}

const initialEmploymentState: Employment = {
  id: '',
  organization: '',
  organizationIndustry: '',
  jobTitle: '',
  jobType: '',
  responsibilities: [],
  dateString: '',
  orgLogoSrc: '',
  organizationLocation: '',
};

const EmploymentForm: React.FC<EmploymentFormProps> = ({
  employmentToEdit,
  onUpdate,
}) => {
  const [employment, setEmployment] = useState<Employment>(
    employmentToEdit || initialEmploymentState,
  );
  const [isPresent, setIsPresent] = useState(
    employmentToEdit?.dateString?.includes('Present') || false,
  );
  const [newResponsibility, setNewResponsibility] = useState('');

  const initialDates = useMemo(() => {
    if (!employmentToEdit?.dateString) {
      return {
        start: new Date(),
        end: new Date(),
      };
    }

    const [startStr, endStr] = employmentToEdit.dateString.split(' - ');
    const start = new Date(startStr);
    const end = endStr === 'Present' ? new Date() : new Date(endStr);

    return {
      start,
      end,
    };
  }, [employmentToEdit]);

  const [dateRange, setDateRange] = useState(initialDates);

  const handleChange = (field: keyof Employment, value: string | string[]) => {
    setEmployment((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (range: { start: Date; end: Date }) => {
    setDateRange(range);
  };

  const validateForm = () => {
    if (!employment.organization.trim()) {
      toast.show('Organization name is required.');
      return false;
    }
    if (!employment.orgLogoSrc.trim()) {
      toast.show('Organization logo is required.');
      return false;
    }
    if (!employment.jobTitle.trim()) {
      toast.show('Job title is required.');
      return false;
    }
    if (!employment.jobType.trim()) {
      toast.show('Job type is required.');
      return false;
    }
    if (!dateRange.start || !dateRange.end) {
      toast.show('Date range is required.');
      return false;
    }
    if (employment.responsibilities.length === 0) {
      toast.show('At least one responsibility is required.');
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

    const employmentData = {
      ...employment,
      id: employmentToEdit?.id || generateId(employment.organization),
      dateString: formattedDate,
    };

    try {
      const result = employmentToEdit
        ? await updateEmployment(employmentData)
        : await addEmployment(employmentData);

      if (result.success) {
        await onUpdate();
        drawer.close();
        toast.show(
          employmentToEdit
            ? 'Employment updated successfully!'
            : 'Employment added successfully!',
        );
      } else {
        throw new Error(result.error || 'Failed to save employment');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error saving employment: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while saving the employment.');
      }
    }
  };

  const handleDelete = async () => {
    if (!employmentToEdit) return;

    try {
      const result = await deleteEmployment(employmentToEdit.id);

      if (result.success) {
        await onUpdate();
        drawer.close();
        toast.show('Employment deleted successfully!');
      } else {
        throw new Error(result.error || 'Failed to delete employment');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error deleting employment: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while deleting the employment.');
      }
    }
  };

  const confirmDelete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-gray-800 dark:text-gray-300'>
          Are you sure you want to delete the following employment? This action
          cannot be undone.
        </p>
        <div className='mb-6'>
          <EmploymentCard
            id='preview'
            organization={employment.organization || 'Organization Name'}
            organizationIndustry={
              employment.organizationIndustry || 'Organization Industry'
            }
            organizationLocation={
              employment.organizationLocation || 'Organization Location'
            }
            orgLogoSrc={
              employment.orgLogoSrc || '/images/placeholder-square.png'
            }
            jobTitle={employment.jobTitle || 'Job Title'}
            jobType={employment.jobType || 'Job Type'}
            responsibilities={employment.responsibilities}
            dateString={employmentToEdit?.dateString || 'Date Range'}
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

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>
            {employmentToEdit ? 'Edit Employment' : 'Add New Employment'}
          </h1>
          <Button icon='close' onClick={() => drawer.close()} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {/* Employment Preview */}
          <div className='flex justify-center'>
            <EmploymentCard
              id='preview'
              organization={employment.organization || 'Organization Name'}
              organizationIndustry={
                employment.organizationIndustry || 'Organization Industry'
              }
              organizationLocation={
                employment.organizationLocation || 'Organization Location'
              }
              orgLogoSrc={
                employment.orgLogoSrc || '/images/placeholder-square.png'
              }
              jobTitle={employment.jobTitle || 'Job Title'}
              jobType={employment.jobType || 'Job Type'}
              responsibilities={employment.responsibilities}
              dateString={`${dateRange.start.toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric',
              })} - ${
                isPresent
                  ? 'Present'
                  : dateRange.end.toLocaleDateString('en-GB', {
                      month: 'short',
                      year: 'numeric',
                    })
              }`}
              isInDrawer
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
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
              <select
                value={employment.jobType}
                onChange={(e) => handleChange('jobType', e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              >
                <option value='Full-time'>Full-time</option>
                <option value='Part-time'>Part-time</option>
                <option value='Contract'>Contract</option>
                <option value='Freelance'>Freelance</option>
                <option value='Internship'>Internship</option>
              </select>
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
                        handleChange(
                          'responsibilities',
                          updatedResponsibilities,
                        );
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
              <FormLabel htmlFor='period' required>
                Period
              </FormLabel>
              <DatePicker
                isRange
                value={dateRange}
                onChange={handleDateChange}
                minDate={new Date(2000, 0, 1)}
                maxDate={new Date()}
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
                label='I currently work here'
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
            <div className='flex justify-end space-x-4 pt-4'>
              {employmentToEdit && (
                <Button type='destructive' icon='trash' onClick={confirmDelete}>
                  Delete
                </Button>
              )}
              <Button type='primary' icon='floppyDisk' onClick={handleSubmit}>
                {employmentToEdit ? 'Save Changes' : 'Add Employment'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmploymentForm;
