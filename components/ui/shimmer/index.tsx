'use client';

import {
  Shimmer as StructureShimmer,
  type ShimmerProps,
} from 'shimmer-from-structure';

import { useRadius } from '@/contexts/radius-context';

interface AppShimmerProps extends ShimmerProps {
  /**
   * Optional layout wrapper used only while loading. Useful when the shimmer
   * replaces a flex/grid child that needs to keep its parent's height.
   */
  containerClassName?: string;
}

/**
 * App-wide shimmer wrapper.
 *
 * The colors come from the same `--muted` token the old skeleton used, exposed
 * through `--skeleton-bg` / `--skeleton-shimmer` in styles/themes.css so every
 * theme (including the non-`.dark` dark themes) stays in sync automatically.
 */
export const Shimmer = ({
  backgroundColor = 'var(--skeleton-bg, var(--muted))',
  shimmerColor = 'var(--skeleton-shimmer, rgba(255, 255, 255, 0.15))',
  fallbackBorderRadius,
  duration = 1.5,
  loading = true,
  containerClassName,
  ...props
}: AppShimmerProps) => {
  const { radius } = useRadius();

  const shimmer = (
    <StructureShimmer
      {...props}
      loading={loading}
      backgroundColor={backgroundColor}
      shimmerColor={shimmerColor}
      fallbackBorderRadius={fallbackBorderRadius ?? radius ?? 4}
      duration={duration}
    />
  );

  if (loading && containerClassName) {
    return <div className={containerClassName}>{shimmer}</div>;
  }

  return shimmer;
};

export type { ShimmerProps };
