import React from 'react';
import Image from 'next/image';
import { Button } from '~/components/UI';
import { Employment } from '~/types/employment';
import { drawer } from '~/components/Drawer';
import { useAuth } from '~/contexts/authContext';
import EmploymentForm from '~/components/Form/Employment';

const EmploymentViewer = ({ employment }: { employment: Employment }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center gap-4'>
          <div className='flex-1 items-center'>
            <h1 className='flex items-center text-2xl font-medium tracking-wide text-black dark:text-white'>
              <span className='mr-3 inline-block'>
                {employment.orgLogoSrc && (
                  <Image
                    src={employment.orgLogoSrc}
                    alt={employment.organization}
                    width={30}
                    height={30}
                    className='rounded-full border bg-white dark:border-gray-700'
                  />
                )}
              </span>
              {employment.organization}
            </h1>
          </div>
          {user && (
            <Button
              onClick={() =>
                drawer.open(<EmploymentForm employmentToEdit={employment} />)
              }
            >
              Edit
            </Button>
          )}
          <Button type='default' onClick={() => drawer.close()}>
            Close
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-8'>
          {/* Organization Details */}
          <section>
            <div className='flex items-center gap-4'>
              {employment.orgLogoSrc && (
                <Image
                  src={employment.orgLogoSrc}
                  alt={employment.organization}
                  width={64}
                  height={64}
                  className='rounded-full border bg-white dark:border-gray-700'
                />
              )}
              <div>
                <h2 className='text-2xl font-medium'>{employment.jobTitle}</h2>
                <p className='text-gray-600 dark:text-gray-300'>
                  {employment.organizationIndustry}
                </p>
                <p className='text-gray-500 dark:text-gray-400'>
                  {employment.organizationLocation}
                </p>
              </div>
            </div>
          </section>

          {/* Job Details */}
          <section>
            <h2 className='text-2xl font-medium mb-4'>Job Details</h2>
            <div className='space-y-2'>
              <p>
                <strong>Job Type:</strong> {employment.jobType}
              </p>
              <p>
                <strong>Duration:</strong> {employment.dateString}
              </p>
            </div>
          </section>

          {/* Responsibilities */}
          <section>
            <h2 className='text-2xl font-medium mb-4'>Responsibilities</h2>
            <ul className='list-disc list-inside prose dark:prose-invert max-w-none'>
              {employment.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default EmploymentViewer;
