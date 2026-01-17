'use client';

import React, { useState, useEffect } from 'react';
import PageTitle from '@/components/PageTitle';
import { sectionsData, updateSection } from '@/database/sections';
import { useRealtimeData } from '@/hooks';
import { Switch, Icon } from '@/components/UI';
import { toast } from '@/components/Toast';
import { Section } from '@/types/section';

// Preview Components
import PagesAndLinks from '@/components/Banners/PagesAndLinks';
import EmploymentSection from '@/components/Section/Employment';
import ProjectSection from '@/components/Section/Project';
import InterestsAndObjectivesSection from '@/components/Section/InterestsAndObjectives';
import PersonalInfoSection from '@/components/Section/PersonalInfo';
import PostSection from '@/components/Section/Post';
import CurrentlyListening from '@/components/Banners/CurrentlyListening';
import LocationAndTime from '@/components/Banners/LocationAndTime';

export default function SectionDatabase() {
  const { data: sections, loading, error } = useRealtimeData(sectionsData);
  const [draggedItem, setDraggedItem] = useState<Section | null>(null);
  const [localSections, setLocalSections] = useState<Section[]>([]);

  useEffect(() => {
    if (sections) {
      setLocalSections([...sections].sort((a, b) => a.order - b.order));
    }
  }, [sections]);

  if (error) return <div>Failed to load sections</div>;

  const sectionMap: Record<string, React.ReactNode> = {
    'personal-info': <PersonalInfoSection />,
    highlights: (
      <div className='space-y-6'>
        <PagesAndLinks />
        <div className='flex flex-col sm:grid sm:grid-cols-2 gap-6'>
          <CurrentlyListening />
          <LocationAndTime />
        </div>
      </div>
    ),
    interests: <InterestsAndObjectivesSection />,
    projects: <ProjectSection />,
    employment: <EmploymentSection />,
    posts: <PostSection />,
  };

  const handleToggle = async (section: Section) => {
    try {
      await updateSection(section.id, { enabled: !section.enabled });
      toast.success(`${section.title} visibility updated`);
    } catch (err) {
      toast.error('Failed to update section');
    }
  };

  const onDragStart = (e: React.DragEvent, section: Section) => {
    setDraggedItem(section);
    e.dataTransfer.effectAllowed = 'move';
    // Add a ghost image or styling if desired
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedOverItem = localSections[index];

    // if the item is dragged over itself, ignore
    if (draggedItem.id === draggedOverItem.id) return;

    // filter out the currently dragged item of the list
    let items = localSections.filter(item => item.id !== draggedItem.id);

    // add the dragged item after the dragged over item
    items.splice(index, 0, draggedItem);

    setLocalSections(items);
  };

  const onDragEnd = async () => {
    setDraggedItem(null);
    // Update all orders in the database
    try {
      const updates = localSections.map((section, index) => 
        updateSection(section.id, { order: index })
      );
      await Promise.all(updates);
      toast.success('Order updated');
    } catch (err) {
      toast.error('Failed to save new order');
    }
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
      {/* Left Column: Management */}
      <div className='lg:col-span-4 space-y-6'>
        <div className='sticky top-24'>
          <PageTitle
            emoji='🧱'
            title='Sections'
            subtitle='Drag to reorder'
          />

          <div className='space-y-3 mt-8'>
            {loading ? (
              <div>Loading...</div>
            ) : (
              localSections.map((section, index) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, section)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  className={`flex items-center gap-3 rounded-md border bg-white p-3 shadow-sm transition-all dark:border-neutral-700 dark:bg-neutral-800 ${
                    draggedItem?.id === section.id ? 'opacity-50 scale-95 border-blue-500' : 'opacity-100'
                  } cursor-grab active:cursor-grabbing`}
                >
                  <div className='text-neutral-400'>
                    <Icon name='dotsSixVertical' />
                  </div>
                  
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium truncate text-sm'>{section.title}</p>
                    <p className='text-[10px] text-neutral-500 font-mono'>{section.name}</p>
                  </div>

                  <Switch
                    id={`show-${section.id}`}
                    checked={section.enabled}
                    onChange={() => handleToggle(section)}
                    label=''
                  />
                </div>
              ))
            )}
          </div>
          
          <div className='mt-6 p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-xs text-blue-600 dark:text-blue-400'>
             <p>Changes to order and visibility are reflected live in the preview and on the home page.</p>
          </div>
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <div className='lg:col-span-8 space-y-14'>
        <div className='relative'>
            <div className='absolute -top-8 left-0 text-[10px] font-bold uppercase tracking-widest text-neutral-400'>
                Live Preview
            </div>
            <div className='rounded-xl border-4 border-neutral-100 dark:border-neutral-800 p-4 lg:p-8 bg-neutral-50 dark:bg-neutral-900/50 min-h-[600px] shadow-inner overflow-hidden'>
                <section className='space-y-14 pointer-events-none opacity-80 scale-[0.98] origin-top transition-all'>
                    {localSections.filter(s => s.enabled).map((section) => (
                        <div key={section.id} className='relative group'>
                             <div className='absolute -left-4 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full' />
                            {sectionMap[section.name]}
                        </div>
                    ))}
                </section>
            </div>
        </div>
      </div>
    </div>
  );
}