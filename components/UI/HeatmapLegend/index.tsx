'use client';

import React from 'react';

export const getHeatmapIntensityClass = (intensity: number) => {
  switch (intensity) {
    case 1:
      return 'bg-heatmap-1';
    case 2:
      return 'bg-heatmap-2';
    case 3:
      return 'bg-heatmap-3';
    case 4:
      return 'bg-heatmap-4';
    case 5:
      return 'bg-heatmap-5';
    case 6:
      return 'bg-heatmap-6';
    default:
      return 'bg-heatmap-0';
  }
};

const HeatmapLegend = () => {
  return (
    <div className='flex items-center justify-end gap-1 text-xs text-muted-foreground'>
      <span>Less</span>
      {[0, 1, 2, 3, 4, 5, 6].map((intensity) => (
        <div
          key={intensity}
          className={`w-3 h-3 rounded-sm ${getHeatmapIntensityClass(intensity)}`}
        />
      ))}
      <span>More</span>
    </div>
  );
};

export default HeatmapLegend;
