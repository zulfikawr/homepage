'use client';

import MetricCard from './Card';
import { useEffect, useState } from 'react';
import { getAllPageViews } from '@/functions/analytics';
import { commaNumber } from '@/utilities/commaNumber';

export default function PageViewsMetric() {
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    const fetchAllPageViews = async () => {
      try {
        const views = await getAllPageViews();
        const total = Object.values(views).reduce(
          (acc, count) => acc + count,
          0,
        );
        setTotalViews(total);
      } catch (error) {
        console.error('Error fetching all page views:', error);
        setTotalViews(null);
      }
    };

    fetchAllPageViews();
  }, []);

  const link = '/analytics';

  return (
    <MetricCard
      icon='chartBar'
      value={commaNumber(totalViews)}
      description='Total Page Views'
      link={link}
      colorHex='#9CA3AF'
    />
  );
}
