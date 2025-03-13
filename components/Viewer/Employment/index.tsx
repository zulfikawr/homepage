import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/UI';
import { Employment } from '@/types/employment';
import { drawer } from '@/components/Drawer';
import Separator from '@/components/UI/Separator';

const EmploymentViewer = ({ employment }: { employment: Employment }) => {
  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center gap-4'>
          <div className='flex-1 items-center'>
            <h1 className='flex items-center text-xl sm:text-2xl font-medium tracking-wide'>
              <span className='mr-3 inline-block'>
                {employment.orgLogoSrc && (
                  <Image
                    src={employment.orgLogoSrc}
                    alt={employment.organization}
                    width={30}
                    height={30}
                    className='rounded-full border bg-white dark:border-neutral-700'
                  />
                )}
              </span>
              {employment.organization}
            </h1>
          </div>
          <Button icon='close' onClick={() => drawer.close()} />
        </div>
      </div>

      <Separator margin='0' />

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-8'>
          {/* Employment Details */}
          <section>
            <h2 className='text-2xl font-medium mb-6'>Employment Details</h2>
            <div className='overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700'>
              <table className='w-full border-collapse bg-white dark:bg-neutral-800'>
                <tbody>
                  <tr className='border-b border-neutral-200 dark:border-neutral-800'>
                    <td className='py-4 px-6 bg-neutral-50 dark:bg-neutral-700 font-medium border-r border-neutral-200 dark:border-neutral-700 w-1/3'>
                      Organization
                    </td>
                    <td className='py-4 px-6 border-b border-neutral-200 dark:border-neutral-700'>
                      <div className='flex items-center gap-3'>
                        {employment.orgLogoSrc && (
                          <Image
                            src={employment.orgLogoSrc}
                            alt={employment.organization}
                            width={24}
                            height={24}
                            className='rounded-full border bg-white dark:border-neutral-700'
                          />
                        )}
                        {employment.organization}
                      </div>
                    </td>
                  </tr>
                  <tr className='border-b border-neutral-200 dark:border-neutral-800'>
                    <td className='py-4 px-6 bg-neutral-50 dark:bg-neutral-700 font-medium border-r border-neutral-200 dark:border-neutral-700'>
                      Position
                    </td>
                    <td className='py-4 px-6 border-b border-neutral-200 dark:border-neutral-700'>
                      {employment.jobTitle}
                    </td>
                  </tr>
                  <tr className='border-b border-neutral-200 dark:border-neutral-800'>
                    <td className='py-4 px-6 bg-neutral-50 dark:bg-neutral-700 font-medium border-r border-neutral-200 dark:border-neutral-700'>
                      Type
                    </td>
                    <td className='py-4 px-6 border-b border-neutral-200 dark:border-neutral-700'>
                      {employment.jobType}
                    </td>
                  </tr>
                  <tr className='border-b border-neutral-200 dark:border-neutral-800'>
                    <td className='py-4 px-6 bg-neutral-50 dark:bg-neutral-700 font-medium border-r border-neutral-200 dark:border-neutral-700'>
                      Location
                    </td>
                    <td className='py-4 px-6 border-b border-neutral-200 dark:border-neutral-700'>
                      {employment.organizationLocation}
                    </td>
                  </tr>
                  <tr className='border-b border-neutral-200 dark:border-neutral-800'>
                    <td className='py-4 px-6 bg-neutral-50 dark:bg-neutral-700 font-medium border-r border-neutral-200 dark:border-neutral-700'>
                      Duration
                    </td>
                    <td className='py-4 px-6 border-b border-neutral-200 dark:border-neutral-700'>
                      {employment.dateString}
                    </td>
                  </tr>
                  <tr>
                    <td className='py-4 px-6 bg-neutral-50 dark:bg-neutral-700 font-medium border-r border-neutral-200 dark:border-neutral-700'>
                      Industry
                    </td>
                    <td className='py-4 px-6'>
                      {employment.organizationIndustry}
                    </td>
                  </tr>
                </tbody>
              </table>
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
