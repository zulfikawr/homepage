'use client';

import { useState } from 'react';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { drawer } from '@/components/UI';
import { modal } from '@/components/UI';
import { toast } from '@/components/UI';
import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  Icon,
  Toggle,
  Tooltip,
} from '@/components/UI';
import { Separator } from '@/components/UI/Separator';

export default function UIComponentsContent() {
  const openDrawer = () => {
    drawer.open(
      <div className='flex flex-col h-full overflow-hidden'>
        <div className='flex-shrink-0 px-4 pt-2 pb-4 sm:px-8 sm:pt-4 sm:pb-6'>
          <div className='flex flex-row justify-between items-center'>
            <h1 className='text-xl md:text-2xl font-semibold'>Drawer</h1>
          </div>
        </div>

        <Separator margin='0' />

        {/* Scrollable Content */}
        <div className='grid grid-cols-2 gap-4 overflow-y-auto w-fit p-4 md:p-8'>
          This is an example of a drawer component.
        </div>
      </div>,
    );
  };

  const openModal = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>This is a modal</h2>
        <p className='mb-6'>This is a modal description</p>
        <div className='flex justify-end space-x-4'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button variant='primary' onClick={() => modal.close()}>
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
      />

      <div className='space-y-6'>
        <StaggerContainer>
          {/* Button Component */}
          <ViewTransition>
            <div className='w-full rounded-md border shadow-sm '>
              <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 '>
                <div className='flex items-center text-[15px] font-medium tracking-wide text-foreground'>
                  <span>Buttons</span>
                </div>
              </div>
              <div className='flex flex-wrap justify-center gap-4 my-6 px-4'>
                {/* Top Row - 3 Buttons */}
                <div className='flex gap-4 w-full justify-center'>
                  <Button variant='primary'>Primary</Button>
                  <Button variant='default'>Default</Button>
                  <Button variant='outline'>Outline</Button>
                </div>
                {/* Bottom Row - 3 Buttons */}
                <div className='flex gap-4 w-full justify-center'>
                  <Button variant='destructive'>Destructive</Button>
                  <Button variant='ghost'>Ghost</Button>
                  <Button variant='link'>Link</Button>
                </div>
              </div>
            </div>
          </ViewTransition>

          {/* Icon Component */}
          <ViewTransition>
            <div className='w-full rounded-md border shadow-sm '>
              <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 '>
                <div className='flex items-center text-[15px] font-medium tracking-wide text-foreground'>
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
          </ViewTransition>

          {/* Dropdown Component */}
          <ViewTransition>
            <div className='w-full rounded-md border shadow-sm '>
              <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 '>
                <div className='flex items-center text-[15px] font-medium tracking-wide text-foreground'>
                  <span>Dropdown</span>
                </div>
              </div>
              <div className='my-6 flex justify-center gap-x-4'>
                <Dropdown
                  trigger={<Button variant='ghost'>{currentHeading}</Button>}
                >
                  <div className='p-1 flex flex-col w-32'>
                    {HEADING_OPTIONS.map((heading) => (
                      <DropdownItem
                        key={heading.label}
                        onClick={() => handleHeadingSelect(heading.label)}
                        isActive={currentHeading === heading.label}
                      >
                        {heading.label}
                      </DropdownItem>
                    ))}
                    <DropdownItem
                      onClick={() => handleHeadingSelect('Paragraph')}
                      isActive={currentHeading === 'Paragraph'}
                    >
                      Paragraph
                    </DropdownItem>
                  </div>
                </Dropdown>

                <Dropdown trigger={<Button variant='link'>Link</Button>}>
                  <div className='p-2'>
                    <input
                      type='text'
                      placeholder='Enter URL'
                      className='w-fit p-3 text-sm border border-border rounded-md mb-2 focus:outline-none'
                    />
                    <Button variant='primary' className='w-full'>
                      Submit
                    </Button>
                  </div>
                </Dropdown>
              </div>
            </div>
          </ViewTransition>

          <div className='grid grid-cols-2 gap-x-4 lg:gap-x-8'>
            {/* Modal Component */}
            <ViewTransition>
              <div className='w-full rounded-md border shadow-sm '>
                <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 '>
                  <div className='flex items-center text-[15px] font-medium tracking-wide text-foreground'>
                    <span>Modal</span>
                  </div>
                </div>
                <div className='flex justify-center my-6 px-4.5'>
                  <Button variant='primary' onClick={openModal}>
                    Open Modal
                  </Button>
                </div>
              </div>
            </ViewTransition>

            {/* Drawer Component */}
            <ViewTransition>
              <div className='w-full rounded-md border shadow-sm '>
                <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 '>
                  <div className='flex items-center text-[15px] font-medium tracking-wide text-foreground'>
                    <span>Drawer</span>
                  </div>
                </div>
                <div className='flex justify-center my-6 px-4.5'>
                  <Button variant='primary' onClick={openDrawer}>
                    Open Drawer
                  </Button>
                </div>
              </div>
            </ViewTransition>
          </div>

          <div className='grid grid-cols-2 gap-x-4 lg:gap-x-8'>
            {/* Badge Component */}
            <ViewTransition>
              <div className='w-full rounded-md border shadow-sm '>
                <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 '>
                  <div className='flex items-center text-[15px] font-medium tracking-wide text-foreground'>
                    <span>Badge</span>
                  </div>
                </div>
                <div className='my-6 px-4.5'>
                  <div className='flex items-center justify-center space-x-3'>
                    <div className='flex w-auto'>
                      <Badge variant='default' icon='nextjs'>
                        Next.js
                      </Badge>
                    </div>
                    <div className='flex w-auto'>
                      <Badge variant='outline' icon='firebase'>
                        Firebase
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </ViewTransition>

            {/* Checkbox Component */}
            <ViewTransition>
              <div className='w-full rounded-md border shadow-sm '>
                <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 '>
                  <div className='flex items-center text-[15px] font-medium tracking-wide text-foreground'>
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
            </ViewTransition>
          </div>

          <div className='grid grid-cols-2 gap-x-4 lg:gap-x-8'>
            {/* Tooltip Component */}
            <ViewTransition>
              <div className='w-full rounded-md border shadow-sm '>
                <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 '>
                  <div className='flex items-center text-[15px] font-medium tracking-wide text-foreground'>
                    <span>Tooltip</span>
                  </div>
                </div>
                <div className='flex justify-center my-6'>
                  <Tooltip text='This is a tooltip' position='top'>
                    <Button>Hover Me</Button>
                  </Tooltip>
                </div>
              </div>
            </ViewTransition>

            {/* Toggle Component */}
            <ViewTransition>
              <div className='w-full rounded-md border shadow-sm '>
                <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 '>
                  <div className='flex items-center text-[15px] font-medium tracking-wide text-foreground'>
                    <span>
                      Toggle{' '}
                      <span className='text-muted-foreground dark:text-muted-foreground'>
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
            </ViewTransition>
          </div>

          {/* Toast Component */}
          <ViewTransition>
            <div className='w-full rounded-md border shadow-sm '>
              <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 '>
                <div className='flex items-center text-[15px] font-medium tracking-wide text-foreground'>
                  <span>Toast</span>
                </div>
              </div>
              <div className='flex justify-center gap-4 my-6'>
                <Button onClick={() => toast.show('This is a default toast!')}>
                  Default
                </Button>
                <Button
                  variant='primary'
                  onClick={() => toast.success('This is a success toast!')}
                >
                  Success
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => toast.error('This is an error toast!')}
                >
                  Error
                </Button>
              </div>
            </div>
          </ViewTransition>
        </StaggerContainer>
      </div>
    </div>
  );
}
