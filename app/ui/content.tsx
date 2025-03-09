'use client';

import { Button, Dropdown, Icon, Label } from '@/components/UI';
import { drawer } from '@/components/Drawer';
import { toast } from '@/components/Toast';
import Tabs from '@/components/Tabs';
import { modal } from '@/components/Modal';
import Tooltip from '@/components/UI/Tooltip';
import Toggle from '@/components/UI/Toggle';
import { useState } from 'react';
import PageTitle from '@/components/PageTitle';

export default function UIComponentsContent() {
  const openDrawer = () => {
    drawer.open(
      <>
        <div className='p-6'>
          <h2 className='text-xl font-semibold dark:text-white mb-4'>
            Drawer Content
          </h2>
          <p className='text-gray-700 dark:text-gray-400 mb-4'>
            This is an example of a drawer component. You can add any content
            here.
          </p>
          <Button onClick={() => drawer.close()}>Close Drawer</Button>
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

  const tabItems = [
    {
      key: '1',
      label: 'Home',
      icon: 'houseLine',
    },
    {
      key: '2',
      label: 'About',
      icon: 'info',
    },
    {
      key: '3',
      label: 'Pages',
      icon: 'folder',
    },
  ];

  const HEADING_OPTIONS: { label: string }[] = [
    { label: 'H1' },
    { label: 'H2' },
    { label: 'H3' },
  ];

  const [currentHeading, setCurrentHeading] = useState<string>('H1');

  const handleHeadingSelect = (heading: string) => {
    setCurrentHeading(heading);
  };

  return (
    <div>
      <PageTitle
        emoji='🎨'
        title='UI Components'
        subtitle='Explore all available UI components used in this website, in an interactive way.'
      />

      <div className='space-y-6'>
        {/* Button Component */}
        <div className='w-full rounded-md border shadow-sm dark:border-gray-700'>
          <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
            <div className='flex items-center text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
              <span>Button Variants</span>
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
        <div className='w-full rounded-md border shadow-sm dark:border-gray-700'>
          <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
            <div className='flex items-center text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
              <span>Icon</span>
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

        {/* Tabs Component */}
        <div className='w-full rounded-md border shadow-sm dark:border-gray-700'>
          <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
            <div className='flex items-center text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
              <span>Tabs</span>
            </div>
          </div>
          <div className='my-6 flex justify-center'>
            <Tabs items={tabItems} />
          </div>
        </div>

        {/* Dropdown Component */}
        <div className='w-full rounded-md border shadow-sm dark:border-gray-700'>
          <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
            <div className='flex items-center text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
              <span>Dropdown</span>
            </div>
          </div>
          <div className='my-6 flex justify-center  gap-x-4'>
            <Dropdown trigger={<Button type='ghost'>{currentHeading}</Button>}>
              <div className='p-2'>
                {HEADING_OPTIONS.map((heading) => (
                  <button
                    key={heading.label}
                    type='button'
                    onClick={() => handleHeadingSelect(heading.label)}
                    className='block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'
                  >
                    {heading.label}
                  </button>
                ))}
                <button
                  type='button'
                  onClick={() => handleHeadingSelect('Paragraph')}
                  className='block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'
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
                  className='w-fit p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-md mb-2 focus:outline-none'
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
          <div className='w-full rounded-md border shadow-sm dark:border-gray-700'>
            <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
              <div className='flex items-center text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
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
          <div className='w-full rounded-md border shadow-sm dark:border-gray-700'>
            <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
              <div className='flex items-center text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
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

        {/* Label Component */}
        <div className='w-full rounded-md border shadow-sm dark:border-gray-700'>
          <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
            <div className='flex items-center text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
              <span>Label</span>
            </div>
          </div>
          <div className='my-6 px-4.5'>
            <div className='flex items-center justify-center space-x-3'>
              <div className='flex w-auto'>
                <Label type='primary' icon='folder'>
                  Primary
                </Label>
              </div>
              <div className='flex w-auto'>
                <Label type='secondary' icon='magifyingGlassPlus'>
                  Secondary
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-x-4 lg:gap-x-8'>
          {/* Tooltip Component */}
          <div className='w-full rounded-md border shadow-sm dark:border-gray-700'>
            <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
              <div className='flex items-center text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
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
          <div className='w-full rounded-md border shadow-sm dark:border-gray-700'>
            <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
              <div className='flex items-center text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
                <span>
                  Toggle{' '}
                  <span className='text-gray-600 dark:text-gray-500'>
                    (with tooltip)
                  </span>
                </span>
              </div>
            </div>
            <div className='flex justify-center gap-2 my-6'>
              <Tooltip text='Bold' position='top'>
                <Toggle>
                  <span className='bold'>B</span>
                </Toggle>
              </Tooltip>
              <Tooltip text='Italic' position='top'>
                <Toggle>
                  <span className='italic'>I</span>
                </Toggle>
              </Tooltip>
              <Tooltip text='Underline' position='top'>
                <Toggle>
                  <span className='underline'>U</span>
                </Toggle>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Toast Component */}
        <div className='w-full rounded-md border shadow-sm dark:border-gray-700'>
          <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
            <div className='flex items-center text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
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
