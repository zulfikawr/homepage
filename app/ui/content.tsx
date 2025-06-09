'use client';

import { useState } from 'react';
import { Badge, Button, Checkbox, Dropdown, Icon } from '@/components/UI';
import { drawer } from '@/components/Drawer';
import { toast } from '@/components/Toast';
import { modal } from '@/components/Modal';
import Tooltip from '@/components/UI/Tooltip';
import Toggle from '@/components/UI/Toggle';
import PageTitle from '@/components/PageTitle';
import Separator from '@/components/UI/Separator';

export default function UIComponentsContent() {
  const openDrawer = () => {
    drawer.open(
      <>
        <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
          <div className='flex flex-row justify-between items-center'>
            <h1 className='text-xl md:text-2xl font-semibold'>Drawer</h1>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>

        <Separator margin='0' />

        {/* Scrollable Content */}
        <div className='grid grid-cols-2 gap-4 overflow-y-auto w-fit p-4 md:p-8'>
          This is an example of a drawer component.
        </div>
      </>,
    );
  };

  const openModal = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>This is a modal</h2>
        <p className='mb-6'>This is a modal description</p>
        <div className='flex justify-end space-x-4'>
          <Button type='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button type='primary' onClick={() => modal.close()}>
            Confirm
          </Button>
        </div>
      </div>,
    );
  };

  const HEADING_OPTIONS: { label: string }[] = [
    { label: 'H1' },
    { label: 'H2' },
    { label: 'H3' },
  ];

  const [currentHeading, setCurrentHeading] = useState<string>('H1');

  const handleHeadingSelect = (heading: string) => {
    setCurrentHeading(heading);
  };

  const [isChecked, setIsChecked] = useState(false);

  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const toggleFormat = (format: keyof typeof formats) => {
    setFormats((prev) => ({
      ...prev,
      [format]: !prev[format],
    }));
  };

  return (
    <div>
      <PageTitle
        emoji='🎨'
        title='UI Components'
        subtitle='Explore all available UI components used in this website, in an interactive way.'
        route='/ui'
      />

      <div className='space-y-6'>
        {/* Button Component */}
        <div className='w-full rounded-md border shadow-sm dark:border-neutral-700'>
          <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
            <div className='flex items-center text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
              <span>Buttons</span>
            </div>
          </div>
          <div className='flex flex-wrap justify-center gap-4 my-6 px-4'>
            {/* Top Row - 3 Buttons */}
            <div className='flex gap-4 w-full justify-center'>
              <Button type='primary'>Primary</Button>
              <Button type='default'>Default</Button>
              <Button type='outline'>Outline</Button>
            </div>
            {/* Bottom Row - 3 Buttons */}
            <div className='flex gap-4 w-full justify-center'>
              <Button type='destructive'>Destructive</Button>
              <Button type='ghost'>Ghost</Button>
              <Button type='link'>Link</Button>
            </div>
          </div>
        </div>

        {/* Icon Component */}
        <div className='w-full rounded-md border shadow-sm dark:border-neutral-700'>
          <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
            <div className='flex items-center text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
              <span>Icons</span>
            </div>
          </div>
          <div className='flex justify-center gap-4 my-6'>
            <Tooltip text='addressBook' position='top'>
              <Icon name='addressBook' className='size-5' />
            </Tooltip>
            <Tooltip text='calendarPlus' position='top'>
              <Icon name='calendarPlus' className='size-5' />
            </Tooltip>
            <Tooltip text='file' position='top'>
              <Icon name='file' className='size-5' />
            </Tooltip>
            <Tooltip text='chatCenteredText' position='top'>
              <Icon name='chatCenteredText' className='size-5' />
            </Tooltip>
            <Tooltip text='houseLine' position='top'>
              <Icon name='houseLine' className='size-5' />
            </Tooltip>
            <Tooltip text='info' position='top'>
              <Icon name='info' className='size-5' />
            </Tooltip>
            <Tooltip text='magnifyingGlass' position='top'>
              <Icon name='magnifyingGlass' className='size-5' />
            </Tooltip>
          </div>
        </div>

        {/* Dropdown Component */}
        <div className='w-full rounded-md border shadow-sm dark:border-neutral-700'>
          <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
            <div className='flex items-center text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
              <span>Dropdown</span>
            </div>
          </div>
          <div className='my-6 flex justify-center gap-x-4'>
            <Dropdown trigger={<Button type='ghost'>{currentHeading}</Button>}>
              <div className='p-2'>
                {HEADING_OPTIONS.map((heading) => (
                  <button
                    key={heading.label}
                    type='button'
                    onClick={() => handleHeadingSelect(heading.label)}
                    className='block w-full px-4 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md'
                  >
                    {heading.label}
                  </button>
                ))}
                <button
                  type='button'
                  onClick={() => handleHeadingSelect('Paragraph')}
                  className='block w-full px-4 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md'
                >
                  Paragraph
                </button>
              </div>
            </Dropdown>

            <Dropdown trigger={<Button type='link'>Link</Button>}>
              <div className='p-2'>
                <input
                  type='text'
                  placeholder='Enter URL'
                  className='w-fit p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-md mb-2 focus:outline-none'
                />
                <Button type='primary' className='w-full'>
                  Submit
                </Button>
              </div>
            </Dropdown>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-x-4 lg:gap-x-8'>
          {/* Modal Component */}
          <div className='w-full rounded-md border shadow-sm dark:border-neutral-700'>
            <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
              <div className='flex items-center text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
                <span>Modal</span>
              </div>
            </div>
            <div className='flex justify-center my-6 px-4.5'>
              <Button type='primary' onClick={openModal}>
                Open Modal
              </Button>
            </div>
          </div>

          {/* Drawer Component */}
          <div className='w-full rounded-md border shadow-sm dark:border-neutral-700'>
            <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
              <div className='flex items-center text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
                <span>Drawer</span>
              </div>
            </div>
            <div className='flex justify-center my-6 px-4.5'>
              <Button type='primary' onClick={openDrawer}>
                Open Drawer
              </Button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-x-4 lg:gap-x-8'>
          {/* Badge Component */}
          <div className='w-full rounded-md border shadow-sm dark:border-neutral-700'>
            <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
              <div className='flex items-center text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
                <span>Badge</span>
              </div>
            </div>
            <div className='my-6 px-4.5'>
              <div className='flex items-center justify-center space-x-3'>
                <div className='flex w-auto'>
                  <Badge type='default' icon='nextjs'>
                    Next.js
                  </Badge>
                </div>
                <div className='flex w-auto'>
                  <Badge type='outline' icon='firebase'>
                    Firebase
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Checkbox Component */}
          <div className='w-full rounded-md border shadow-sm dark:border-neutral-700'>
            <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
              <div className='flex items-center text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
                <span>Checkbox</span>
              </div>
            </div>
            <div className='flex justify-center my-6 px-4.5'>
              <Checkbox
                id='sample-checkbox'
                checked={isChecked}
                onChange={setIsChecked}
                label='I agree to the terms and conditions'
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-x-4 lg:gap-x-8'>
          {/* Tooltip Component */}
          <div className='w-full rounded-md border shadow-sm dark:border-neutral-700'>
            <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
              <div className='flex items-center text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
                <span>Tooltip</span>
              </div>
            </div>
            <div className='flex justify-center my-6'>
              <Tooltip text='This is a tooltip' position='top'>
                <Button>Hover Me</Button>
              </Tooltip>
            </div>
          </div>

          {/* Toggle Component */}
          <div className='w-full rounded-md border shadow-sm dark:border-neutral-700'>
            <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
              <div className='flex items-center text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
                <span>
                  Toggle{' '}
                  <span className='text-neutral-600 dark:text-neutral-500'>
                    (with tooltip)
                  </span>
                </span>
              </div>
            </div>
            <div className='flex justify-center gap-2 my-6'>
              <Tooltip text='Bold' position='top'>
                <Toggle
                  isActive={formats.bold}
                  onChange={() => toggleFormat('bold')}
                >
                  <span className='font-bold'>B</span>
                </Toggle>
              </Tooltip>

              <Tooltip text='Italic' position='top'>
                <Toggle
                  isActive={formats.italic}
                  onChange={() => toggleFormat('italic')}
                >
                  <span className='italic'>I</span>
                </Toggle>
              </Tooltip>

              <Tooltip text='Underline' position='top'>
                <Toggle
                  isActive={formats.underline}
                  onChange={() => toggleFormat('underline')}
                >
                  <span className='underline'>U</span>
                </Toggle>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Toast Component */}
        <div className='w-full rounded-md border shadow-sm dark:border-neutral-700'>
          <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
            <div className='flex items-center text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
              <span>Toast</span>
            </div>
          </div>
          <div className='flex justify-center gap-4 my-6'>
            <Button onClick={() => toast.show('This is a default toast!')}>
              Default
            </Button>
            <Button
              type='primary'
              onClick={() => toast.success('This is a success toast!')}
            >
              Success
            </Button>
            <Button
              type='destructive'
              onClick={() => toast.error('This is an error toast!')}
            >
              Error
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
