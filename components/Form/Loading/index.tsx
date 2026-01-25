'use client';

import React from 'react';
import { Skeleton } from '@/components/UI';
import { Separator } from '@/components/UI/Separator';

interface FormSkeletonProps {
  fields?: number;
  hasPreview?: boolean;
}

const FormSkeleton: React.FC<FormSkeletonProps> = ({ 
  fields = 5,
  hasPreview = true 
}) => {
  return (
    <div className='space-y-6'>
      {hasPreview && (
        <>
          <div className='flex justify-center'>
            <Skeleton width='100%' height={120} className='max-w-md' />
          </div>
          <Separator margin='5' />
        </>
      )}

      <div className='space-y-4'>
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className='space-y-2'>
            <Skeleton width={100} height={20} />
            <Skeleton width='100%' height={40} />
          </div>
        ))}
      </div>

      <Separator margin='5' />
      
      <div className='flex gap-4'>
        <Skeleton width='100%' height={40} />
      </div>
    </div>
  );
};

export { FormSkeleton };
