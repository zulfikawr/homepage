'use client';

import MetricCard from './Card';
import { commaNumber } from '@/utilities/commaNumber';
import { useRealtimeData } from '@/hooks';
import { getAllPageViews } from '@/functions/analytics';

export default function PageViewsMetric() {
  const { data: views, loading } = useRealtimeData(getAllPageViews);

  const totalViews = views
    ? Object.values(views).reduce((acc, count) => acc + count, 0)
    : 0;

  const link = '/analytics';

  return (
    <MetricCard
      icon='chartBar'
      value={loading ? '...' : commaNumber(totalViews)}
      description='Total Page Views'
      link={link}
      colorHex='#9CA3AF'
    />
  );
}
