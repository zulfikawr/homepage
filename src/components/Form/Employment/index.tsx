import React, { useState } from 'react';
import { Employment } from '~/types/employment';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import { Button } from '~/components/UI';
import { EmploymentCard } from '~/components/Card/Employment';
import { toast } from '~/components/Toast';
import {
  addEmployment,
  updateEmployment,
  deleteEmployment,
} from '~/functions/employments';

const EmploymentForm = ({
  employmentToEdit,
}: {
  employmentToEdit?: Employment;
}) => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState(
    employmentToEdit?.organization || '',
  );
  const [organizationIndustry, setOrganizationIndustry] = useState(
    employmentToEdit?.organizationIndustry || '',
  );
  const [jobTitle, setJobTitle] = useState(employmentToEdit?.jobTitle || '');
  const [jobType, setJobType] = useState(employmentToEdit?.jobType || '');
  const [responsibilities, setResponsibilities] = useState<string[]>(
    employmentToEdit?.responsibilities || [],
  );
  const [newResponsibility, setNewResponsibility] = useState('');
  const [dateString, setDateString] = useState(
    employmentToEdit?.dateString || '',
  );
  const [orgLogoSrc, setOrgLogoSrc] = useState(
    employmentToEdit?.orgLogoSrc || '',
  );
  const [organizationLocation, setOrganizationLocation] = useState(
    employmentToEdit?.organizationLocation || '',
  );

  const generateId = (organization: string) => {
    return organization
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const validateForm = () => {
    if (!organization.trim()) {
      toast.show('Organization name is required.');
      return false;
    }
    if (!jobTitle.trim()) {
      toast.show('Job title is required.');
      return false;
    }
    if (!jobType.trim()) {
      toast.show('Job type is required.');
      return false;
    }
    if (!dateString.trim()) {
      toast.show('Date string is required.');
      return false;
    }
    if (responsibilities.length === 0) {
      toast.show('At least one responsibility is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !validateForm()) return;

    const employmentData = {
      id: employmentToEdit?.id || generateId(organization),
      organization,
      organizationIndustry,
      jobTitle,
      jobType,
      responsibilities,
      dateString,
      orgLogoSrc: orgLogoSrc || '/images/placeholder.png',
      organizationLocation,
    };

    try {
      let result;
      if (employmentToEdit) {
        result = await updateEmployment(employmentData);
      } else {
        result = await addEmployment(employmentData);
      }

      if (result.success) {
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
    if (!employmentToEdit || !user) return;

    try {
      const result = await deleteEmployment(employmentToEdit.id);

      if (result.success) {
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

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      setResponsibilities([...responsibilities, newResponsibility.trim()]);
      setNewResponsibility('');
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    const updatedResponsibilities = responsibilities.filter(
      (_, i) => i !== index,
    );
    setResponsibilities(updatedResponsibilities);
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>
            {employmentToEdit ? 'Edit Employment' : 'Add New Employment'}
          </h1>
          <Button icon='close' onClick={() => drawer.close()}>
            <span className='hidden md:block md:ml-2'>Close</span>
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {/* Employment Preview */}
          <div className='flex justify-center'>
            <EmploymentCard
              id='preview'
              organization={organization || 'Organization Name'}
              organizationIndustry={
                organizationIndustry || 'Organization Industry'
              }
              organizationLocation={
                organizationLocation || 'Organization Location'
              }
              orgLogoSrc={orgLogoSrc || '/images/placeholder.png'}
              jobTitle={jobTitle || 'Job Title'}
              jobType={jobType || 'Job Type'}
              responsibilities={responsibilities}
              dateString={
                employmentToEdit?.dateString ||
                new Date().toISOString().split('T')[0]
              }
              isInDrawer
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Organization <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder='Organization name'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Organization Industry
              </label>
              <input
                type='text'
                value={organizationIndustry}
                onChange={(e) => setOrganizationIndustry(e.target.value)}
                placeholder='Organization industry'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Job Title <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder='Job title'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Job Type <span className='text-red-500'>*</span>
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
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
              <label className='block text-sm font-medium mb-2'>
                Responsibilities <span className='text-red-500'>*</span>
              </label>
              <div className='space-y-2'>
                {responsibilities.map((responsibility, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <input
                      type='text'
                      value={responsibility}
                      onChange={(e) => {
                        const updatedResponsibilities = [...responsibilities];
                        updatedResponsibilities[index] = e.target.value;
                        setResponsibilities(updatedResponsibilities);
                      }}
                      className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    />
                    <Button
                      type='destructive'
                      icon='trashSimple'
                      onClick={() => handleRemoveResponsibility(index)}
                    >
                      <span className='hidden md:block md:ml-2'>Remove</span>
                    </Button>
                  </div>
                ))}
                <div className='flex items-center gap-2'>
                  <input
                    type='text'
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder='Add a responsibility'
                    className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  />
                  <Button
                    type='primary'
                    icon='plus'
                    onClick={handleAddResponsibility}
                  >
                    <span className='hidden md:block md:ml-2'>Add</span>
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Date String <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={dateString}
                onChange={(e) => setDateString(e.target.value)}
                placeholder='Jan 2021 - Present'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Organization Logo URL
              </label>
              <input
                type='text'
                value={orgLogoSrc}
                onChange={(e) => setOrgLogoSrc(e.target.value)}
                placeholder='https://organization-logo.com'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Organization Location
              </label>
              <input
                type='text'
                value={organizationLocation}
                onChange={(e) => setOrganizationLocation(e.target.value)}
                placeholder='Organization location'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
            <div className='flex justify-end space-x-4'>
              {employmentToEdit && (
                <Button type='destructive' icon='trash' onClick={handleDelete}>
                  <span className='hidden md:block md:ml-2'>
                    Delete Employment
                  </span>
                </Button>
              )}
              <Button type='primary' icon='floppyDisk' onClick={handleSubmit}>
                <span className='hidden md:block md:ml-2'>
                  {employmentToEdit ? 'Save Changes' : 'Add Employment'}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmploymentForm;
