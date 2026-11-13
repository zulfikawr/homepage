'use client';

import React from 'react';

import { Shimmer } from '@/components/ui/shimmer';

interface FormSkeletonProps {
  children: React.ReactNode;
}

/**
 * Shimmer fallback for route-level form loading.
 *
 * It renders the real form component underneath so the skeleton is measured
 * from the actual fields instead of hand-maintained placeholder blocks.
 */
const FormSkeleton: React.FC<FormSkeletonProps> = ({ children }) => {
  return <Shimmer loading>{children}</Shimmer>;
};

export { FormSkeleton };
