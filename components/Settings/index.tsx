'use client';
import { useTheme } from 'next-themes';

import { Button, Icon, Slider, Switch, ToggleGroup } from '@/components/UI';
import { Dropdown, DropdownItem } from '@/components/UI/Dropdown';
import type { IconName } from '@/components/UI/Icon';
import { useBackground } from '@/contexts/backgroundContext';
import { useEffectToggle } from '@/contexts/effectContext';
import { useLoadingToggle } from '@/contexts/loadingContext';
import { useRadius } from '@/contexts/radiusContext';

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

export default function Settings() {
  const { setTheme, theme } = useTheme();
  const { background, setBackground } = useBackground();
  const { effectEnabled, toggleEffect } = useEffectToggle();
  const { radius, setRadius } = useRadius();
  const { forceLoading, toggleForceLoading, forceEmpty, toggleForceEmpty } =
    useLoadingToggle();

  const sectionTitleClass = 'text-left text-md text-muted-foreground';

  const selectedBackground = backgroundOptions.find(
    (option) => option.value === background,
  );

  return (
    <Dropdown
      trigger={
        <Button
          type='default'
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
      <div className='p-3 space-y-3'>
        <div className={sectionTitleClass}>Background</div>
        <Dropdown
          trigger={
            <Button
              type='default'
              aria-label='Select background'
              className='w-full flex items-center justify-between gap-2 px-4 h-8'
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

        <div className={sectionTitleClass}>Transparency</div>
        <Switch
          id='effect-switch'
          checked={effectEnabled}
          onChange={toggleEffect}
          label={effectEnabled ? 'Disable Transparency' : 'Enable Transparency'}
        />

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
          </>
        )}
      </div>
    </Dropdown>
  );
}
