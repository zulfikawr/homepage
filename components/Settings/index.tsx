'use client';
import { useState } from 'react';
import { useTheme } from 'next-themes';

import { toast } from '@/components/UI';
import { Button, Icon, Slider, Switch, ToggleGroup } from '@/components/UI';
import { Dropdown, DropdownItem } from '@/components/UI/Dropdown';
import type { IconName } from '@/components/UI/Icon';
import { useAuth } from '@/contexts/authContext';
import { useBackground } from '@/contexts/backgroundContext';
import { useLoadingToggle } from '@/contexts/loadingContext';
import { useRadius } from '@/contexts/radiusContext';
import { useWeather, WeatherType } from '@/contexts/weatherContext';
import { getSpotifyAuthUrl } from '@/lib/spotify';

const themeOptions: { label: string; value: string; icon: IconName }[] = [
  { label: 'System', value: 'system', icon: 'desktop' },
  { label: 'Light', value: 'light', icon: 'sun' },
  { label: 'Dark', value: 'dark', icon: 'moon' },
];

const backgroundOptions: { label: string; value: string; icon: IconName }[] = [
  { label: 'None', value: 'none', icon: 'prohibit' },
  { label: 'Waves', value: 'waves', icon: 'waves' },
  { label: 'Tetris', value: 'tetris', icon: 'wall' },
  { label: 'Stars', value: 'stars', icon: 'asterisk' },
  { label: 'Matrix', value: 'matrix', icon: 'bracketsSquare' },
  { label: 'Network', value: 'network', icon: 'network' },
];

const weatherOptions: { label: string; value: WeatherType; icon: IconName }[] =
  [
    { label: 'Auto', value: 'auto', icon: 'cloud' },
    { label: 'Clear', value: 'clear', icon: 'sun' },
    { label: 'Clouds', value: 'clouds', icon: 'cloudSun' },
    { label: 'Drizzle', value: 'drizzle', icon: 'cloudRain' },
    { label: 'Rain', value: 'rain', icon: 'cloudRain' },
    { label: 'Storm', value: 'storm', icon: 'cloudLightning' },
    { label: 'Snow', value: 'snow', icon: 'cloudSnow' },
    { label: 'Fog', value: 'fog', icon: 'cloudFog' },
  ];

const dayNightOptions: {
  label: string;
  value: 'auto' | 'day' | 'night';
  icon: IconName;
}[] = [
  { label: 'Auto', value: 'auto', icon: 'clock' },
  { label: 'Day', value: 'day', icon: 'sun' },
  { label: 'Night', value: 'night', icon: 'moon' },
];

export default function Settings() {
  const { setTheme, theme } = useTheme();
  const { background, setBackground } = useBackground();
  const { radius, setRadius } = useRadius();
  const {
    weatherOverride,
    setWeatherOverride,
    isDaytimeOverride,
    setIsDaytimeOverride,
  } = useWeather();
  const { forceLoading, toggleForceLoading, forceEmpty, toggleForceEmpty } =
    useLoadingToggle();
  const { isAdmin } = useAuth();
  const [resettingSpotify, setResettingSpotify] = useState(false);

  const handleResetSpotify = async () => {
    setResettingSpotify(true);
    try {
      const response = await fetch('/api/spotify/reset', { method: 'POST' });
      if (response.ok) {
        toast.success('Spotify data reset successfully');
      } else {
        toast.error('Failed to reset Spotify data');
      }
    } catch {
      toast.error('Error resetting Spotify data');
    } finally {
      setResettingSpotify(false);
    }
  };

  const sectionTitleClass = 'text-left text-md text-muted-foreground';

  const selectedBackground = backgroundOptions.find(
    (option) => option.value === background,
  );

  const selectedWeather = weatherOptions.find(
    (option) => option.value === weatherOverride,
  );

  return (
    <Dropdown
      trigger={
        <Button
          variant='default'
          aria-label='Open settings'
          className='bg-card w-10 h-10 p-0 transition-colors group/btn'
        >
          <Icon
            name='gear'
            size={20}
            className='text-primary group-hover/btn:text-accent-foreground transition-colors'
          />
        </Button>
      }
    >
      <div className='p-3 space-y-3 max-h-[68vh] overflow-auto'>
        <div className={sectionTitleClass}>Background</div>
        <Dropdown
          trigger={
            <Button
              variant='default'
              aria-label='Select background'
              className='w-full flex items-center justify-between gap-2 px-4'
            >
              <div className='flex items-center gap-2'>
                {selectedBackground && (
                  <Icon name={selectedBackground.icon} className='size-4.5' />
                )}
                <span>{selectedBackground?.label}</span>
              </div>
              <Icon name='caretDown' className='size-4.5' />
            </Button>
          }
          className='w-full'
          matchTriggerWidth
        >
          {backgroundOptions.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={() => setBackground(option.value)}
              isActive={background === option.value}
              className='flex items-center gap-2'
            >
              <Icon name={option.icon} className='size-4.5' />
              <span>{option.label}</span>
            </DropdownItem>
          ))}
        </Dropdown>

        <div className={sectionTitleClass}>Border Radius</div>
        <Slider
          id='border-radius-slider'
          min={0}
          max={16}
          step={1}
          value={radius}
          onChange={(v) => setRadius(v)}
        />

        <div className={sectionTitleClass}>Theme</div>
        <ToggleGroup value={theme} onChange={setTheme} options={themeOptions} />

        {process.env.NODE_ENV === 'development' && (
          <>
            <div className={sectionTitleClass}>Development</div>
            <div className='space-y-2'>
              <Switch
                id='force-loading-switch'
                checked={forceLoading}
                onChange={toggleForceLoading}
                label={forceLoading ? 'Disable Skeleton' : 'Enable Skeleton'}
              />
              <Switch
                id='force-empty-switch'
                checked={forceEmpty}
                onChange={toggleForceEmpty}
                label={forceEmpty ? 'Disable Empty' : 'Enable Empty'}
              />
            </div>

            <div className={sectionTitleClass}>Weather Mode</div>
            <ToggleGroup
              value={isDaytimeOverride}
              onChange={(v) =>
                setIsDaytimeOverride(v as 'auto' | 'day' | 'night')
              }
              options={dayNightOptions}
            />

            <div className={sectionTitleClass}>Weather Type</div>
            <Dropdown
              trigger={
                <Button
                  variant='default'
                  aria-label='Select weather'
                  className='w-full flex items-center justify-between gap-2 px-4'
                >
                  <div className='flex items-center gap-2'>
                    {selectedWeather && (
                      <Icon name={selectedWeather.icon} className='size-4.5' />
                    )}
                    <span>{selectedWeather?.label}</span>
                  </div>
                  <Icon name='caretDown' className='size-4.5' />
                </Button>
              }
              className='w-full'
              matchTriggerWidth
            >
              {weatherOptions.map((option) => (
                <DropdownItem
                  key={option.value}
                  onClick={() => setWeatherOverride(option.value)}
                  isActive={weatherOverride === option.value}
                  className='flex items-center gap-2'
                >
                  <Icon name={option.icon} className='size-4.5' />
                  <span>{option.label}</span>
                </DropdownItem>
              ))}
            </Dropdown>

            {isAdmin && (
              <>
                <div className={sectionTitleClass}>Spotify</div>
                <Button
                  icon='spotifyLogo'
                  className='bg-[#1DB954] text-gruv-bg font-bold hover:bg-[#1ed760] w-full mb-2'
                  onClick={() => {
                    const url = getSpotifyAuthUrl();
                    window.location.href = url;
                  }}
                >
                  Connect with Spotify
                </Button>
                <Button
                  onClick={handleResetSpotify}
                  disabled={resettingSpotify}
                  className='w-full'
                  variant='default'
                >
                  {resettingSpotify ? 'Resetting...' : 'Reset Spotify Data'}
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </Dropdown>
  );
}
