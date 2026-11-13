'use client';

import { useMemo } from 'react';

import VisitorGeographyBanner from '@/components/banners/visitor-geography';
import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Card } from '@/components/ui';
import { Icon } from '@/components/ui';
import { Shimmer } from '@/components/ui/shimmer';
import CardEmpty from '@/components/ui/card/variants/empty';
import { AnalyticsSummary } from '@/types/analytics-summary';

const ANALYTICS_TEMPLATE: AnalyticsSummary = {
  totalViews: 1280,
  uniqueVisitors: 412,
  topRoutes: [
    { path: '/', views: 520 },
    { path: '/projects', views: 280 },
    { path: '/posts', views: 210 },
    { path: '/about', views: 140 },
    { path: '/reading-list', views: 90 },
  ],
  countries: [
    { code: 'US', name: 'United States', count: 120 },
    { code: 'ID', name: 'Indonesia', count: 86 },
    { code: 'DE', name: 'Germany', count: 54 },
    { code: 'JP', name: 'Japan', count: 32 },
    { code: 'BR', name: 'Brazil', count: 18 },
  ],
  devices: [
    { type: 'Desktop', count: 260, icon: 'desktop', percentage: 63 },
    { type: 'Mobile', count: 152, icon: 'deviceMobile', percentage: 37 },
  ],
  referrers: [
    { name: 'Google', count: 180 },
    { name: 'Direct', count: 120 },
    { name: 'GitHub', count: 72 },
    { name: 'Twitter / X', count: 44 },
  ],
};

export function AnalyticsSkeleton() {
  return (
    <Shimmer loading>
      <AnalyticsContent stats={ANALYTICS_TEMPLATE} />
    </Shimmer>
  );
}

export default function AnalyticsContent({
  stats,
}: {
  stats: AnalyticsSummary;
}) {
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
          subtitle='Website traffic and visitor behavior, refreshed every five minutes.'
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
        subtitle='Website traffic and visitor behavior, refreshed every five minutes.'
      />

      {/* Summary Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <StaggerContainer>
          {[
            {
              label: 'Total Views',
              value: stats.totalViews.toLocaleString(),
              icon: 'eye' as const,
              color: 'text-theme-aqua',
            },
            {
              label: 'Unique Visitors',
              value: stats.uniqueVisitors.toLocaleString(),
              icon: 'users' as const,
              color: 'text-theme-green',
            },
            {
              label: 'Refresh cadence',
              value: '5 minutes',
              icon: 'clock' as const,
              color: 'text-theme-yellow',
            },
            {
              label: 'Status',
              value: 'Healthy',
              icon: 'checkCircle' as const,
              color: 'text-theme-blue',
            },
          ].map((stat, i) => (
            <ViewTransition key={i}>
              <Card isPreview className='p-4 flex flex-col h-32'>
                <div className='flex items-center justify-between text-muted-foreground'>
                  <span className='text-xs font-medium uppercase tracking-wider'>
                    {stat.label}
                  </span>
                  <Icon name={stat.icon} size={18} className={stat.color} />
                </div>
                <div className='flex-1 flex items-center'>
                  <div className='text-2xl font-semibold tracking-tight text-foreground'>
                    {stat.value}
                  </div>
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
              <VisitorGeographyBanner
                data={stats.countries}
                showMoreButton={false}
              />
            </ViewTransition>

            <ViewTransition>
              {/* Countries List */}
              <Card isPreview className='p-6'>
                <h3 className='text-md font-semibold mb-6 flex items-center gap-2 text-foreground'>
                  <Icon name='mapPin' size={18} className='text-theme-yellow' />
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
                  <Icon name='article' size={18} className='text-theme-blue' />
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
                                ? 'text-theme-blue'
                                : 'text-theme-aqua'
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
                    className='text-theme-green'
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
                      <span className='font-medium py-1 px-2 bg-muted rounded text-xs text-foreground dark:text-theme-fg'>
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
