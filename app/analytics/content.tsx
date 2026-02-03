'use client';

import { useMemo } from 'react';

import VisitorGeographyBanner from '@/components/banners/visitor-geography';
import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Card } from '@/components/ui';
import { Icon, Skeleton } from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import { AnalyticsEvent } from '@/types/analytics-event';

export function AnalyticsSkeleton() {
  return (
    <div className='pb-10'>
      <PageTitle
        emoji='📊'
        title='Analytics'
        subtitle='Real-time insights into website traffic and visitor behavior.'
      />

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        {[
          'text-gruv-aqua',
          'text-gruv-green',
          'text-gruv-yellow',
          'text-gruv-blue',
        ].map((color, i) => (
          <Card
            key={i}
            isPreview
            className='p-5 flex flex-col justify-between h-32'
          >
            <div className='flex items-center justify-between'>
              <Skeleton width={80} height={12} as='span' />
              <Skeleton
                width={18}
                height={18}
                variant='circle'
                className={color}
              />
            </div>
            <Skeleton width={100} height={32} />
          </Card>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-8'>
          <Card isPreview className='h-[450px]'>
            <div className='p-4 border-b border-border bg-muted/30 flex items-center justify-between'>
              <Skeleton width={120} height={16} />
            </div>
            <div className='p-8'>
              <Skeleton width='100%' height={300} />
            </div>
          </Card>
          <Card isPreview className='p-6'>
            <Skeleton width={150} height={20} className='mb-6' as='span' />
            <div className='space-y-5'>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='space-y-2'>
                  <div className='flex justify-between'>
                    <Skeleton width={100} height={14} as='span' />
                    <Skeleton width={40} height={14} as='span' />
                  </div>
                  <Skeleton width='100%' height={8} className='rounded-full' />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className='space-y-8'>
          <Card isPreview className='p-6'>
            <Skeleton width={120} height={20} className='mb-6' as='span' />
            <div className='space-y-4'>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='space-y-2'>
                  <div className='flex justify-between'>
                    <Skeleton width={120} height={14} as='span' />
                    <Skeleton width={30} height={14} as='span' />
                  </div>
                  <Skeleton width='100%' height={6} className='rounded-full' />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsContent({
  events,
}: {
  events: AnalyticsEvent[];
}) {
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
        <StaggerContainer>
          {[
            {
              label: 'Total Views',
              value: stats.totalViews.toLocaleString(),
              icon: 'eye' as const,
              color: 'text-gruv-aqua',
            },
            {
              label: 'Unique Visitors',
              value: stats.uniqueVisitors.toLocaleString(),
              icon: 'users' as const,
              color: 'text-gruv-green',
            },
            {
              label: 'Real-time',
              value: 'Active Now',
              icon: 'clock' as const,
              color: 'text-gruv-yellow',
            },
            {
              label: 'Status',
              value: 'Healthy',
              icon: 'checkCircle' as const,
              color: 'text-gruv-blue',
            },
          ].map((stat, i) => (
            <ViewTransition key={i}>
              <Card
                isPreview
                className='p-5 flex flex-col justify-between h-32'
              >
                <div className='flex items-center justify-between text-muted-foreground'>
                  <span className='text-xs font-medium uppercase tracking-wider'>
                    {stat.label}
                  </span>
                  <Icon name={stat.icon} size={18} className={stat.color} />
                </div>
                <div className='text-2xl font-semibold tracking-tight text-foreground'>
                  {stat.value}
                </div>
              </Card>
            </ViewTransition>
          ))}
        </StaggerContainer>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-8'>
          <StaggerContainer>
            <ViewTransition>
              <VisitorGeographyBanner />
            </ViewTransition>

            <ViewTransition>
              {/* Countries List */}
              <Card isPreview className='p-6'>
                <h3 className='text-md font-semibold mb-6 flex items-center gap-2 text-foreground'>
                  <Icon name='mapPin' size={18} className='text-gruv-yellow' />
                  Top Countries
                </h3>
                <div className='space-y-5'>
                  {stats.countries.slice(0, 5).map((country) => {
                    const ratio = country.count / (maxCountryCount || 1);
                    // Interpolate between light cream (#f9f5d7) and dark orange (#af3a03)
                    const r = Math.round(249 + (175 - 249) * ratio);
                    const g = Math.round(245 + (58 - 245) * ratio);
                    const b = Math.round(215 + (3 - 215) * ratio);
                    const barColor = `rgb(${r}, ${g}, ${b})`;

                    return (
                      <div key={country.code} className='space-y-1.5'>
                        <div className='flex justify-between text-sm font-medium'>
                          <div className='flex items-center gap-2 text-foreground'>
                            <span className='text-muted-foreground'>
                              {country.code}
                            </span>
                            <span>{country.name}</span>
                          </div>
                          <span className='text-foreground'>
                            {country.count.toLocaleString()}
                          </span>
                        </div>
                        <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
                          <div
                            className='h-full rounded-full transition-all duration-1000'
                            style={{
                              width: `${ratio * 100}%`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </ViewTransition>
          </StaggerContainer>
        </div>

        <div className='space-y-8'>
          <StaggerContainer>
            <ViewTransition>
              {/* Top Routes */}
              <Card isPreview className='p-6'>
                <h3 className='text-md font-semibold mb-6 flex items-center gap-2 text-foreground'>
                  <Icon name='article' size={18} className='text-gruv-blue' />
                  Top Pages
                </h3>
                <div className='space-y-4'>
                  {stats.topRoutes.map((route) => {
                    const ratio = route.views / (maxViews || 1);
                    const r = Math.round(249 + (175 - 249) * ratio);
                    const g = Math.round(245 + (58 - 245) * ratio);
                    const b = Math.round(215 + (3 - 215) * ratio);
                    const barColor = `rgb(${r}, ${g}, ${b})`;

                    return (
                      <div key={route.path} className='group'>
                        <div className='flex justify-between text-sm mb-1.5'>
                          <span
                            className='text-muted-foreground truncate max-w-[180px]'
                            title={route.path}
                          >
                            {route.path}
                          </span>
                          <span className='font-medium text-foreground'>
                            {route.views.toLocaleString()}
                          </span>
                        </div>
                        <div className='h-1.5 w-full bg-muted rounded-full overflow-hidden'>
                          <div
                            className='h-full rounded-full transition-all duration-500'
                            style={{
                              width: `${ratio * 100}%`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </ViewTransition>

            <ViewTransition>
              {/* Device Distribution */}
              <Card isPreview className='p-6'>
                <h3 className='text-md font-semibold mb-6 flex items-center gap-2 text-foreground'>
                  <Icon name='monitor' size={18} className='text-primary' />
                  Devices
                </h3>
                <div className='space-y-6'>
                  {stats.devices.map((device) => {
                    const ratio = device.percentage / 100;
                    const r = Math.round(249 + (175 - 249) * ratio);
                    const g = Math.round(245 + (58 - 245) * ratio);
                    const b = Math.round(215 + (3 - 215) * ratio);
                    const barColor = `rgb(${r}, ${g}, ${b})`;

                    return (
                      <div
                        key={device.type}
                        className='flex items-center gap-4'
                      >
                        <div className='p-2 bg-muted rounded-lg'>
                          <Icon
                            name={device.icon}
                            size={20}
                            className={
                              device.type === 'Desktop'
                                ? 'text-gruv-blue'
                                : 'text-gruv-aqua'
                            }
                          />
                        </div>
                        <div className='flex-1'>
                          <div className='flex justify-between text-sm font-medium mb-1 text-foreground'>
                            <span>{device.type}</span>
                            <span>{device.percentage}%</span>
                          </div>
                          <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
                            <div
                              className='h-full rounded-full transition-all duration-1000'
                              style={{
                                width: `${device.percentage}%`,
                                backgroundColor: barColor,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </ViewTransition>

            <ViewTransition>
              {/* Referrers */}
              <Card isPreview className='p-6'>
                <h3 className='text-md font-semibold mb-6 flex items-center gap-2 text-foreground'>
                  <Icon
                    name='shareNetwork'
                    size={18}
                    className='text-gruv-green'
                  />
                  Top Referrers
                </h3>
                <div className='space-y-4'>
                  {stats.referrers.map((referrer) => (
                    <div
                      key={referrer.name}
                      className='flex justify-between items-center text-sm group'
                    >
                      <span className='text-muted-foreground'>
                        {referrer.name}
                      </span>
                      <span className='font-medium py-1 px-2 bg-muted rounded text-xs text-foreground dark:text-gruv-fg'>
                        {referrer.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </ViewTransition>
          </StaggerContainer>
        </div>
      </div>
    </div>
  );
}
