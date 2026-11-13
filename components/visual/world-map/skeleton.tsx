'use client';

import { useId } from 'react';
import { twMerge } from 'tailwind-merge';

import { WORLD_SILHOUETTE_PATH } from './world-silhouette';

/**
 * Lightweight world silhouette used while visitor geography data loads.
 *
 * One static path with a static sheen and a compositor-only opacity pulse.
 * No masks, clip paths, or moving transforms, which keeps macOS from
 * re-rasterizing a large SVG every frame.
 */
export default function WorldMapSkeleton({
  className,
}: {
  className?: string;
}) {
  const shimmerId = `world-skeleton-gradient-${useId().replace(/:/g, '')}`;

  return (
    <div
      className={twMerge(
        'world-skeleton-pulse relative w-full h-full min-h-[200px]',
        className,
      )}
    >
      <style>{`
        @keyframes world-skeleton-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.55;
          }
        }

        .world-skeleton-pulse {
          animation: world-skeleton-pulse 2s ease-in-out infinite;
          will-change: opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .world-skeleton-pulse {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>

      <svg
        className='w-full h-full'
        viewBox='0 0 1000 500'
        preserveAspectRatio='xMidYMid meet'
        aria-busy='true'
        aria-label='Loading visitor geography'
      >
        <defs>
          <linearGradient
            id={shimmerId}
            gradientUnits='userSpaceOnUse'
            x1='0'
            y1='0'
            x2='1000'
            y2='500'
          >
            <stop
              offset='0%'
              stopColor='var(--skeleton-shimmer)'
              stopOpacity='0'
            />
            <stop offset='50%' stopColor='var(--skeleton-shimmer)' />
            <stop
              offset='100%'
              stopColor='var(--skeleton-shimmer)'
              stopOpacity='0'
            />
          </linearGradient>
        </defs>

        <path
          d={WORLD_SILHOUETTE_PATH}
          fill='var(--skeleton-bg)'
          stroke='var(--border)'
          strokeWidth='0.5'
          fillRule='evenodd'
        />
        <path
          d={WORLD_SILHOUETTE_PATH}
          fill={`url(#${shimmerId})`}
          fillRule='evenodd'
          pointerEvents='none'
        />
      </svg>
    </div>
  );
}
