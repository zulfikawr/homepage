'use client';

import { useState } from 'react';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import SectionTitle from '@/components/SectionTitle';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Checkbox } from '@/components/UI/Checkbox';
import { drawer } from '@/components/UI/Drawer';
import { Dropdown, DropdownItem } from '@/components/UI/Dropdown';
import { Icon } from '@/components/UI/Icon';
import { Input } from '@/components/UI/Input';
import { Label } from '@/components/UI/Label';
import { modal } from '@/components/UI/Modal';
import { Separator } from '@/components/UI/Separator';
import { Skeleton } from '@/components/UI/Skeleton';
import { Slider } from '@/components/UI/Slider';
import { Switch } from '@/components/UI/Switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/UI/Table';
import { Textarea } from '@/components/UI/Textarea';
import { toast } from '@/components/UI/Toast';
import { Toggle } from '@/components/UI/Toggle';
import { ToggleGroup } from '@/components/UI/ToggleGroup';
import { Tooltip } from '@/components/UI/Tooltip';

export default function UIContent() {
  const [toggleGroupValue, setToggleGroupValue] = useState('left');
  const [isChecked, setIsChecked] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [toggleState, setToggleState] = useState(false);

  const openModal = () => {
    modal.open(
      <div className='p-6 space-y-4'>
        <h2 className='text-xl font-bold'>Example Modal</h2>
        <p className='text-muted-foreground'>
          This is a modal component. It overlays the content and focuses user
          attention.
        </p>
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button onClick={() => modal.close()}>Confirm</Button>
        </div>
      </div>,
    );
  };

  const openDrawer = () => {
    drawer.open(
      <div className='p-6 h-full overflow-y-auto space-y-4'>
        <h2 className='text-xl font-bold'>Example Drawer</h2>
        <p className='text-muted-foreground'>
          Drawers are useful for mobile-first menus or complex forms that need
          more space.
        </p>
        <div className='space-y-4 pt-4'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className='p-4 border-2 border-border rounded-md bg-card'
            >
              <h3 className='font-bold'>Drawer Item {i}</h3>
              <p className='text-sm text-muted-foreground'>
                Some description text here.
              </p>
            </div>
          ))}
        </div>
        <div className='pt-4'>
          <Button className='w-full' onClick={() => drawer.close()}>
            Close Drawer
          </Button>
        </div>
      </div>,
    );
  };

  return (
    <div className='space-y-12 pb-20'>
      <PageTitle
        emoji='🎨'
        title='UI Components'
        subtitle='A comprehensive showcase of my custom gruvbox soft brutalist design system and components.'
      />

      {/* Primitives Section */}
      <section className='space-y-6'>
        <SectionTitle icon='cube' title='Primitives' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <StaggerContainer>
            <ViewTransition>
              <Card className='p-6 space-y-4' isPreview>
                <h3 className='font-bold text-lg border-b-2 border-border pb-2'>
                  Buttons
                </h3>
                <div className='flex flex-wrap gap-4'>
                  <Button variant='primary'>Primary</Button>
                  <Button variant='default'>Default</Button>
                  <Button variant='outline'>Outline</Button>
                  <Button variant='destructive'>Destructive</Button>
                  <Button variant='ghost'>Ghost</Button>
                  <Button variant='link'>Link</Button>
                </div>
                <div className='flex flex-wrap gap-4 mt-4'>
                  <Button icon='plus' variant='primary'>
                    With Icon
                  </Button>
                  <Button icon='trash' variant='destructive'>
                    Delete
                  </Button>
                </div>
              </Card>
            </ViewTransition>

            <ViewTransition>
              <Card className='p-6 space-y-4' isPreview>
                <h3 className='font-bold text-lg border-b-2 border-border pb-2'>
                  Badges & Labels
                </h3>
                <div className='flex flex-wrap gap-2'>
                  <Badge variant='primary'>Primary</Badge>
                  <Badge variant='aqua'>Aqua</Badge>
                  <Badge variant='green'>Green</Badge>
                  <Badge variant='yellow'>Yellow</Badge>
                  <Badge variant='red'>Red</Badge>
                  <Badge variant='blue'>Blue</Badge>
                  <Badge variant='outline'>Outline</Badge>
                </div>
                <div className='flex flex-wrap gap-2 mt-4'>
                  <Label variant='primary'>Primary Label</Label>
                  <Label variant='secondary'>Secondary</Label>
                  <Label variant='aqua' icon='react'>
                    React
                  </Label>
                </div>
              </Card>
            </ViewTransition>
          </StaggerContainer>
        </div>
      </section>

      <Separator />

      {/* Forms Section */}
      <section className='space-y-6'>
        <SectionTitle icon='pencilSimple' title='Form Elements' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <StaggerContainer>
            <ViewTransition>
              <Card className='p-6 space-y-6' isPreview>
                <h3 className='font-bold text-lg border-b-2 border-border pb-2'>
                  Inputs
                </h3>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label variant='secondary'>Text Input</Label>
                    <Input placeholder='Type something...' />
                  </div>
                  <div className='space-y-2'>
                    <Label variant='secondary'>With Icon</Label>
                    <div className='relative'>
                      <Icon
                        name='userCircle'
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4'
                      />
                      <Input className='pl-9' placeholder='Username' />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label variant='secondary'>Textarea</Label>
                    <Textarea placeholder='Write a longer message...' />
                  </div>
                </div>
              </Card>
            </ViewTransition>

            <ViewTransition>
              <Card className='p-6 space-y-6' isPreview>
                <h3 className='font-bold text-lg border-b-2 border-border pb-2'>
                  Controls
                </h3>
                <div className='space-y-6'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Checkbox</span>
                    <Checkbox
                      id='example-checkbox'
                      label='Check me'
                      checked={isChecked}
                      onChange={(c) => setIsChecked(c)}
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Switch</span>
                    <Switch
                      id='switch-example'
                      label='Toggle me'
                      checked={isSwitchOn}
                      onChange={setIsSwitchOn}
                    />
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='font-medium'>Slider</span>
                      <span className='text-muted-foreground font-mono'>
                        {sliderValue}
                      </span>
                    </div>
                    <Slider
                      id='slider-example'
                      value={sliderValue}
                      onChange={setSliderValue}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div className='space-y-2'>
                    <span className='font-medium block mb-2'>Toggle Group</span>
                    <ToggleGroup
                      value={toggleGroupValue}
                      onChange={setToggleGroupValue}
                      options={[
                        { label: 'Left', value: 'left', icon: 'arrowLeft' },
                        { label: 'Center', value: 'center', icon: 'rows' },
                        { label: 'Right', value: 'right', icon: 'arrowRight' },
                      ]}
                    />
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='font-medium'>Dropdown:</span>
                    <Dropdown
                      trigger={
                        <Button className='flex justify-between gap-4'>
                          Options <Icon name='caretDown' size={16} />
                        </Button>
                      }
                      matchTriggerWidth
                    >
                      <DropdownItem icon='pencilSimple'>Edit</DropdownItem>
                      <DropdownItem icon='note'>Duplicate</DropdownItem>
                      <DropdownItem icon='trash' className='text-destructive'>
                        Delete
                      </DropdownItem>
                    </Dropdown>
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='font-medium'>Standalone Toggle:</span>
                    <Toggle
                      isActive={toggleState}
                      onChange={() => setToggleState(!toggleState)}
                    >
                      <Icon
                        name={toggleState ? 'star' : 'star'}
                        weight={toggleState ? 'fill' : 'regular'}
                      />
                    </Toggle>
                  </div>
                </div>
              </Card>
            </ViewTransition>
          </StaggerContainer>
        </div>
      </section>

      <Separator />

      {/* Feedback Section */}
      <section className='space-y-6'>
        <SectionTitle icon='info' title='Feedback & Overlays' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <StaggerContainer>
            <ViewTransition>
              <Card className='p-6 space-y-6' isPreview>
                <h3 className='font-bold text-lg border-b-2 border-border pb-2'>
                  Toasts
                </h3>
                <div className='space-y-4'>
                  <p className='text-sm text-muted-foreground'>
                    Transient notifications for user feedback.
                  </p>
                  <div className='grid grid-cols-1 gap-4'>
                    <Button
                      onClick={() => toast.success('Operation successful!')}
                      variant='outline'
                      className='w-full justify-start'
                      icon='checkCircle'
                    >
                      Show Success Toast
                    </Button>
                    <Button
                      onClick={() => toast.error('Something went wrong!')}
                      variant='outline'
                      className='w-full justify-start'
                      icon='warning'
                    >
                      Show Error Toast
                    </Button>
                  </div>
                </div>
              </Card>
            </ViewTransition>

            <ViewTransition>
              <Card className='p-6 space-y-6' isPreview>
                <h3 className='font-bold text-lg border-b-2 border-border pb-2'>
                  Overlays
                </h3>
                <div className='space-y-6'>
                  <div className='grid grid-cols-2 gap-4'>
                    <Button
                      onClick={openModal}
                      variant='primary'
                      className='w-full'
                    >
                      Open Modal
                    </Button>
                    <Button
                      onClick={openDrawer}
                      variant='default'
                      className='w-full'
                    >
                      Open Drawer
                    </Button>
                  </div>
                  <div className='pt-4 border-t border-border flex justify-center'>
                    <Tooltip text='This is a helpful tooltip'>
                      <Button variant='outline'>Hover me for Tooltip</Button>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            </ViewTransition>
          </StaggerContainer>
        </div>
      </section>

      <Separator />

      {/* Data Display */}
      <section className='space-y-6'>
        <SectionTitle icon='table' title='Data Display' />
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <Card className='col-span-1 lg:col-span-2' isPreview>
            <div className='p-4 border-b-2 border-border bg-muted/30'>
              <h3 className='font-bold'>Users Table</h3>
            </div>
            <div className='px-4 pb-4'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader>Name</TableCell>
                    <TableCell isHeader>Role</TableCell>
                    <TableCell isHeader className='text-right'>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className='font-medium'>John Doe</TableCell>
                    <TableCell>Developer</TableCell>
                    <TableCell className='text-right'>
                      <Badge variant='green'>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-medium'>Jane Smith</TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell className='text-right'>
                      <Badge variant='yellow'>Away</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-medium'>Bob Johnson</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell className='text-right'>
                      <Badge variant='red'>Offline</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className='p-6 space-y-4' isPreview>
            <h3 className='font-bold border-b-2 border-border pb-2'>
              Skeleton Loading
            </h3>
            <div className='space-y-3'>
              <Skeleton className='h-32 w-full rounded-md' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
