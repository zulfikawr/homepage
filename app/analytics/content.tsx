'use client';

import { useMemo } from 'react';
import PageTitle from '@/components/PageTitle';
import { Card } from '@/components/Card';
import { Icon } from '@/components/UI';
import { useRealtimeData } from '@/hooks';
import { getAnalyticsEvents } from '@/database/analytics_events';
import CardEmpty from '@/components/Card/Empty';

export default function AnalyticsContent() {
  const { data: events, loading, error } = useRealtimeData(getAnalyticsEvents);

  const stats = useMemo(() => {
    if (!events) return null;

    const totalViews = events.length;
    if (totalViews === 0)
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        topRoutes: [],
        countries: [],
        devices: [],
        referrers: [],
      };

    const uniqueVisitors = new Set(events.map((e) => e.user_agent + e.country))
      .size;

    // Top Routes
    const routeCounts: Record<string, number> = {};
    events.forEach((e) => {
      routeCounts[e.path] = (routeCounts[e.path] || 0) + 1;
    });
    const topRoutes = Object.entries(routeCounts)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Top Countries
    const countryCounts: Record<string, { count: number; name: string }> = {};
    events.forEach((e) => {
      const countryCode = e.country || 'Unknown';
      if (!countryCounts[countryCode]) {
        countryCounts[countryCode] = { count: 0, name: countryCode };
      }
      countryCounts[countryCode].count++;
    });
    const countries = Object.entries(countryCounts)
      .map(([code, data]) => ({ code, name: data.name, count: data.count }))
      .sort((a, b) => b.count - a.count);

    // Devices
    const devices = [
      {
        type: 'Desktop',
        count: events.filter(
          (e) => !/mobile|android|iphone|ipad/i.test(e.user_agent),
        ).length,
        icon: 'desktop' as const,
      },
      {
        type: 'Mobile',
        count: events.filter((e) => /mobile|android|iphone/i.test(e.user_agent))
          .length,
        icon: 'deviceMobile' as const,
      },
    ].map((d) => ({
      ...d,
      percentage: Math.round((d.count / totalViews) * 100) || 0,
    }));

    // Referrers
    const referrerCounts: Record<string, number> = {};
    events.forEach((e) => {
      let ref = 'Direct';
      try {
        if (
          e.referrer &&
          e.referrer !== 'Direct' &&
          e.referrer.startsWith('http')
        ) {
          ref = new URL(e.referrer).hostname;
        }
      } catch {
        ref = e.referrer || 'Direct';
      }
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    });
    const referrers = Object.entries(referrerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    console.log('Analytics Stats:', { totalViews, uniqueVisitors });
    return {
      totalViews,
      uniqueVisitors,
      topRoutes,
      countries,
      devices,
      referrers,
    };
  }, [events]);

  const maxViews = useMemo(
    () =>
      stats && stats.topRoutes.length > 0
        ? Math.max(...stats.topRoutes.map((r) => r.views))
        : 0,
    [stats],
  );
  const maxCountryCount = useMemo(
    () =>
      stats && stats.countries.length > 0
        ? Math.max(...stats.countries.map((c) => c.count))
        : 0,
    [stats],
  );

  if (loading) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (error) return <CardEmpty message={`Error: ${error}`} />;
  if (!stats) return <CardEmpty message='Initializing analytics...' />;

  if (stats.totalViews === 0) {
    return (
      <div>
        <PageTitle
          emoji='📊'
          title='Analytics'
          subtitle='Real-time insights into website traffic and visitor behavior.'
        />
        <div className='mt-10'>
          <CardEmpty message='No visitor data recorded yet. Browse the site to generate activity!' />
        </div>
      </div>
    );
  }

  return (
    <div className='pb-10'>
      <PageTitle
        emoji='📊'
        title='Analytics'
        subtitle='Real-time insights into website traffic and visitor behavior.'
      />

      {/* Summary Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        {[
          {
            label: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            icon: 'eye' as const,
          },
          {
            label: 'Unique Visitors',
            value: stats.uniqueVisitors.toLocaleString(),
            icon: 'users' as const,
          },
          { label: 'Real-time', value: 'Active Now', icon: 'clock' as const },
          { label: 'Status', value: 'Healthy', icon: 'checkCircle' as const },
        ].map((stat, i) => (
          <Card
            key={i}
            isPreview
            className='p-5 flex flex-col justify-between h-32'
          >
            <div className='flex items-center justify-between text-muted-foreground'>
              <span className='text-xs font-medium uppercase tracking-wider'>
                {stat.label}
              </span>
              <Icon name={stat.icon} size={18} />
            </div>
            <div className='text-2xl font-semibold tracking-tight'>
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column: Map & Countries */}
        <div className='lg:col-span-2 space-y-8'>
          {/* World Map */}
          <Card isPreview className='overflow-hidden'>
            <div className='p-4 border-b border-border bg-muted/30 flex items-center justify-between'>
              <h3 className='text-sm font-semibold flex items-center gap-2'>
                <Icon name='globe' size={16} />
                Visitor Geography
              </h3>
            </div>
            <div className='h-[400px] w-full relative'></div>
          </Card>

          {/* Countries List */}
          <Card isPreview className='p-6'>
            <h3 className='text-md font-semibold mb-6 flex items-center gap-2'>
              <Icon name='mapPin' size={18} />
              Top Countries
            </h3>
            <div className='space-y-5'>
              {stats.countries.slice(0, 5).map((country) => (
                <div key={country.code} className='space-y-1.5'>
                  <div className='flex justify-between text-sm font-medium'>
                    <div className='flex items-center gap-2'>
                      <span className='text-muted-foreground'>
                        {country.code}
                      </span>
                      <span>{country.name}</span>
                    </div>
                    <span>{country.count.toLocaleString()}</span>
                  </div>
                  <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-primary/60 rounded-full transition-all duration-1000'
                      style={{
                        width: `${(country.count / maxCountryCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Routes & Referrers */}
        <div className='space-y-8'>
          {/* Top Routes */}
          <Card isPreview className='p-6'>
            <h3 className='text-md font-semibold mb-6 flex items-center gap-2'>
              <Icon name='article' size={18} />
              Top Pages
            </h3>
            <div className='space-y-4'>
              {stats.topRoutes.map((route) => (
                <div key={route.path} className='group'>
                  <div className='flex justify-between text-sm mb-1.5'>
                    <span
                      className='text-muted-foreground truncate max-w-[180px]'
                      title={route.path}
                    >
                      {route.path}
                    </span>
                    <span className='font-medium'>
                      {route.views.toLocaleString()}
                    </span>
                  </div>
                  <div className='h-1.5 w-full bg-muted rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-blue-500/60 rounded-full group-hover:bg-blue-500 transition-all duration-500'
                      style={{ width: `${(route.views / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Device Distribution */}
          <Card isPreview className='p-6'>
            <h3 className='text-md font-semibold mb-6 flex items-center gap-2'>
              <Icon name='monitor' size={18} />
              Devices
            </h3>
            <div className='space-y-6'>
              {stats.devices.map((device) => (
                <div key={device.type} className='flex items-center gap-4'>
                  <div className='p-2 bg-muted rounded-lg'>
                    <Icon
                      name={device.icon}
                      size={20}
                      className='text-primary'
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='flex justify-between text-sm font-medium mb-1'>
                      <span>{device.type}</span>
                      <span>{device.percentage}%</span>
                    </div>
                    <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-purple-500/60 rounded-full'
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Referrers */}
          <Card isPreview className='p-6'>
            <h3 className='text-md font-semibold mb-6 flex items-center gap-2'>
              <Icon name='shareNetwork' size={18} />
              Top Referrers
            </h3>
            <div className='space-y-4'>
              {stats.referrers.map((referrer) => (
                <div
                  key={referrer.name}
                  className='flex justify-between items-center text-sm'
                >
                  <span className='text-muted-foreground'>{referrer.name}</span>
                  <span className='font-medium py-1 px-2 bg-muted rounded text-xs'>
                    {referrer.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
