'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { twMerge } from 'tailwind-merge';

import { toast } from '@/components/ui';
import { Button, FormLabel, Icon } from '@/components/ui';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import type { IconName } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import DynamicBackground from '@/components/visual/background';
import { useBackground } from '@/contexts/background-context';
import { CustomizationSettings } from '@/types/customization';

const themeOptions: { label: string; value: string; icon: IconName }[] = [
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

const ThemePreview = ({ theme }: { theme: string }) => {
  const [colors, setColors] = useState({
    bg: '',
    primary: '',
    muted: '',
    orange: '',
    green: '',
    aqua: '',
    blue: '',
    red: '',
    card: '',
    mutedFg: '',
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!ref.current) return;
      const style = getComputedStyle(ref.current);
      setColors({
        bg: style.getPropertyValue('--background').trim(),
        primary: style.getPropertyValue('--primary').trim(),
        muted: style.getPropertyValue('--muted').trim(),
        orange: style.getPropertyValue('--theme-orange').trim(),
        green: style.getPropertyValue('--theme-green').trim(),
        aqua: style.getPropertyValue('--theme-aqua').trim(),
        blue: style.getPropertyValue('--theme-blue').trim(),
        red: style.getPropertyValue('--theme-red').trim(),
        card: style.getPropertyValue('--card').trim(),
        mutedFg: style.getPropertyValue('--muted-foreground').trim(),
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <div
      ref={ref}
      className={twMerge(
        'w-full h-32 rounded-lg border border-border overflow-hidden shadow-brutalist-sm flex',
        theme,
      )}
    >
      <div
        style={{ backgroundColor: colors.bg }}
        className='flex-1 p-3 flex flex-col justify-center gap-3'
      >
        <div className='flex gap-2 items-center'>
          <div
            style={{ backgroundColor: colors.primary }}
            className='size-4 rounded-sm shadow-sm'
          />
          <div
            style={{ backgroundColor: colors.muted }}
            className='h-2 w-16 rounded-full opacity-50'
          />
        </div>
        <div className='flex gap-1.5'>
          <div
            style={{ backgroundColor: colors.orange }}
            className='size-3 rounded-full shadow-sm'
          />
          <div
            style={{ backgroundColor: colors.green }}
            className='size-3 rounded-full shadow-sm'
          />
          <div
            style={{ backgroundColor: colors.aqua }}
            className='size-3 rounded-full shadow-sm'
          />
          <div
            style={{ backgroundColor: colors.blue }}
            className='size-3 rounded-full shadow-sm'
          />
          <div
            style={{ backgroundColor: colors.red }}
            className='size-3 rounded-full shadow-sm'
          />
        </div>
      </div>
      <div
        style={{ backgroundColor: colors.card, borderColor: colors.muted }}
        className='w-1/3 border-l-2 p-3 flex flex-col gap-2 justify-center'
      >
        <div
          style={{ backgroundColor: colors.mutedFg }}
          className='h-1.5 w-full rounded-full opacity-20'
        />
        <div
          style={{ backgroundColor: colors.mutedFg }}
          className='h-1.5 w-full rounded-full opacity-20'
        />
        <div
          style={{ backgroundColor: colors.mutedFg }}
          className='h-1.5 w-2/3 rounded-full opacity-20'
        />
      </div>
    </div>
  );
};

const BackgroundPreview = ({
  theme,
  background,
}: {
  theme: string;
  background: string;
}) => {
  return (
    <div
      className={twMerge(
        'relative w-full h-32 rounded-lg border border-border overflow-hidden shadow-brutalist-sm',
        theme,
      )}
    >
      <div className='absolute inset-0 bg-background' />
      <div className='absolute inset-0 opacity-60'>
        <DynamicBackground isPreview background={background} theme={theme} />
      </div>
    </div>
  );
};

interface CustomizationFormProps {
  data?: CustomizationSettings;
}

const CustomizationForm: React.FC<CustomizationFormProps> = ({ data }) => {
  const { setTheme } = useTheme();
  const { setBackground } = useBackground();
  const [settings, setSettings] = useState<Partial<CustomizationSettings>>(
    data || { default_theme: 'gruvbox-dark', default_background: 'none' },
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setSettings(data);
    }
  }, [data]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/collection/customization_settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (result.success) {
        // Immediately apply to local storage/current session
        if (settings.default_theme) setTheme(settings.default_theme);
        if (settings.default_background)
          setBackground(settings.default_background);

        toast.success('Customization settings updated and applied!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update settings');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'An error occurred while saving',
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedTheme = themeOptions.find(
    (t) => t.value === settings.default_theme,
  );
  const selectedBackground = backgroundOptions.find(
    (b) => b.value === settings.default_background,
  );

  return (
    <div className='space-y-8'>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <FormLabel>Default Theme</FormLabel>
          <Dropdown
            trigger={
              <Button variant='default' className='w-full px-4'>
                <div className='flex items-center gap-2'>
                  <Icon
                    name={selectedTheme?.icon || 'palette'}
                    className='size-4.5'
                  />
                  <span>{selectedTheme?.label || 'Select Theme'}</span>
                </div>
              </Button>
            }
            className='w-full'
            matchTriggerWidth
          >
            {themeOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    default_theme: option.value,
                  }))
                }
                isActive={settings.default_theme === option.value}
              >
                <Icon name={option.icon} className='size-4.5' />
                <span>{option.label}</span>
              </DropdownItem>
            ))}
          </Dropdown>
        </div>

        <div className='space-y-2'>
          <FormLabel>Default Background</FormLabel>
          <Dropdown
            trigger={
              <Button variant='default' className='w-full px-4'>
                <div className='flex items-center gap-2'>
                  <Icon
                    name={selectedBackground?.icon || 'prohibit'}
                    className='size-4.5'
                  />
                  <span>
                    {selectedBackground?.label || 'Select Background'}
                  </span>
                </div>
              </Button>
            }
            className='w-full'
            matchTriggerWidth
          >
            {backgroundOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    default_background: option.value,
                  }))
                }
                isActive={settings.default_background === option.value}
              >
                <Icon name={option.icon} className='size-4.5' />
                <span>{option.label}</span>
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      </div>

      <div className='space-y-4'>
        <FormLabel>Live Previews</FormLabel>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <ThemePreview
              key={`theme-${settings.default_theme}`}
              theme={settings.default_theme || 'gruvbox-dark'}
            />
          </div>
          <div className='flex-1'>
            <BackgroundPreview
              key={`bg-${settings.default_theme}-${settings.default_background}`}
              theme={settings.default_theme || 'gruvbox-dark'}
              background={settings.default_background || 'none'}
            />
          </div>
        </div>
      </div>

      <p className='text-xs text-primary-dim text-left italic mt-4'>
        Note: These defaults will be applied to all new visitors who
        haven&apos;t set their own preferences.
      </p>

      <Separator margin='5' />

      <Button
        variant='primary'
        icon='floppyDisk'
        onClick={handleSubmit}
        disabled={loading}
        className='w-full'
      >
        {loading ? 'Saving...' : 'Save Defaults'}
      </Button>
    </div>
  );
};

export default CustomizationForm;
