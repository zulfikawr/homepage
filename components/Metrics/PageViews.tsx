'use client';

import MetricCard from './Card';
import { useEffect, useState } from 'react';
import { getPageViews } from 'functions/analytics';
import { commaNumber } from 'utilities/commaNumber';

export default function PageViewsMetric() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const fetchPageViews = async () => {
      try {
        const totalViews = await getPageViews('/');
        setViews(totalViews);
      } catch (error) {
        console.error('Error fetching page views:', error);
        setViews(null);
      }
    };

    fetchPageViews();
  }, []);

  const link = '/';

  return (
    <MetricCard
      icon='chartBar'
      value={commaNumber(views)}
      description='Page Views'
      link={link}
      colorHex='#9CA3AF'
    />
  );
}
