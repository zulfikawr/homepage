'use client';
import { useState } from 'react';
import { useTheme } from 'next-themes';

import { toast } from '@/components/ui';
import { Button, Icon, Slider, Switch, ToggleGroup } from '@/components/ui';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import type { IconName } from '@/components/ui/icon';
import { useAuth } from '@/contexts/auth-context';
import { useBackground } from '@/contexts/background-context';
import { useLoadingToggle } from '@/contexts/loading-context';
import { useRadius } from '@/contexts/radius-context';
import { useWeather, WeatherType } from '@/contexts/weather-context';
import { getSpotifyAuthUrl } from '@/lib/spotify-client';

const themeOptions: { label: string; value: string; icon: IconName }[] = [
  { label: 'System', value: 'system', icon: 'desktop' },
  { label: 'Gruvbox Light', value: 'gruvbox-light', icon: 'palette' },
  { label: 'Gruvbox Dark', value: 'gruvbox-dark', icon: 'palette' },
  { label: 'Monokai', value: 'monokai', icon: 'palette' },
  { label: 'Dracula', value: 'dracula', icon: 'palette' },
  { label: 'Nord', value: 'nord', icon: 'palette' },
  { label: 'Catppuccin', value: 'catppuccin', icon: 'palette' },
  { label: 'Tokyo Night', value: 'tokyo-night', icon: 'palette' },
  { label: 'Solarized', value: 'solarized', icon: 'palette' },
  { label: 'Everforest', value: 'everforest', icon: 'palette' },
  { label: 'Rose Pine', value: 'rose-pine', icon: 'palette' },
  { label: 'One Dark', value: 'one-dark', icon: 'palette' },
  { label: 'Kanagawa', value: 'kanagawa', icon: 'palette' },
  { label: 'Nightfly', value: 'nightfly', icon: 'palette' },
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
          className='bg-card w-10 h-10 p-0 group/btn'
        >
          <Icon
            name='gear'
            size={20}
            className='text-primary group-hover/btn:text-accent-foreground transition-colors'
          />
        </Button>
      }
    >
      <div className='p-3 space-y-3 max-h-[68vh] w-[50vw] md:w-[20vw] overflow-auto'>
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
        <Dropdown
          trigger={
            <Button
              variant='default'
              aria-label='Select theme'
              className='w-full flex items-center justify-between gap-2 px-4'
            >
              <div className='flex items-center gap-2'>
                {themeOptions.find((o) => o.value === theme) && (
                  <Icon
                    name={themeOptions.find((o) => o.value === theme)!.icon}
                    className='size-4.5'
                  />
                )}
                <span>
                  {themeOptions.find((o) => o.value === theme)?.label ||
                    'Select Theme'}
                </span>
              </div>
              <Icon name='caretDown' className='size-4.5' />
            </Button>
          }
          className='w-full'
          matchTriggerWidth
        >
          <div className='max-h-60 overflow-y-auto'>
            {themeOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() => setTheme(option.value)}
                isActive={theme === option.value}
                className='flex items-center gap-2'
              >
                <Icon name={option.icon} className='size-4.5' />
                <span>{option.label}</span>
              </DropdownItem>
            ))}
          </div>
        </Dropdown>

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
                <div className='flex flex-col w-full gap-2'>
                  <Button
                    icon='spotifyLogo'
                    className='bg-[#1DB954] text-theme-bg font-bold hover:bg-[#1ed760] w-full'
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
                    variant='default'
                    className='w-full'
                  >
                    {resettingSpotify ? 'Resetting...' : 'Reset Spotify Data'}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Dropdown>
  );
}
