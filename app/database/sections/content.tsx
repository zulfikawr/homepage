'use client';

import React, { useState, useEffect } from 'react';
import PageTitle from '@/components/PageTitle';
import { mapRecordToSection } from '@/lib/mappers';
import { updateSection } from '@/database/sections';
import { useCollection } from '@/hooks';
import { Switch, Icon, Button, Skeleton } from '@/components/UI';
import { toast } from '@/components/Toast';
import { Section } from '@/types/section';
import { drawer } from '@/components/Drawer';
import CardEmpty from '@/components/Card/Empty';

// Preview Components
import EmploymentSection from '@/components/Section/Employment';
import ProjectSection from '@/components/Section/Project';
import InterestsAndObjectivesSection from '@/components/Section/InterestsAndObjectives';
import PersonalInfoSection from '@/components/Section/PersonalInfo';
import PostSection from '@/components/Section/Post';
import Banners from '@/components/Section/Banners';

const SectionPreview = ({ sections }: { sections: Section[] }) => {
  const sectionMap: Record<string, React.ReactNode> = {
    'personal-info': <PersonalInfoSection />,
    banners: <Banners />,
    interests: <InterestsAndObjectivesSection />,
    projects: <ProjectSection />,
    employment: <EmploymentSection />,
    posts: <PostSection />,
  };

  return (
    <div className='flex-1 overflow-y-auto p-4 lg:p-12 bg-muted dark:bg-background/50'>
      <div className='max-w-4xl mx-auto'>
        <section className='space-y-14 origin-top transition-all'>
          {sections
            .filter((s) => s.enabled)
            .map((section) => (
              <div key={section.id} className='relative'>
                {sectionMap[section.name]}
              </div>
            ))}
        </section>
      </div>
    </div>
  );
};

export default function SectionDatabase() {
  const {
    data: sections,
    loading,
    error,
  } = useCollection<Section>('sections', mapRecordToSection, { sort: 'order' });

  const [draggedItem, setDraggedItem] = useState<Section | null>(null);
  const [localSections, setLocalSections] = useState<Section[]>([]);

  useEffect(() => {
    if (sections) {
      setLocalSections([...sections].sort((a, b) => a.order - b.order));
    }
  }, [sections]);

  if (error) return <CardEmpty message='Failed to load sections' />;

  const handleToggle = async (section: Section) => {
    const originalEnabled = section.enabled;
    const newEnabled = !originalEnabled;

    // Optimistic update
    setLocalSections((prev) =>
      prev.map((s) =>
        s.id === section.id ? { ...s, enabled: newEnabled } : s,
      ),
    );

    try {
      const result = await updateSection(section.id, { enabled: newEnabled });
      if (!result.success) {
        throw new Error(result.error || 'Failed to update section');
      }
      toast.success(`${section.title} visibility updated`);
    } catch (err) {
      // Revert on failure
      setLocalSections((prev) =>
        prev.map((s) =>
          s.id === section.id ? { ...s, enabled: originalEnabled } : s,
        ),
      );
      toast.error(
        err instanceof Error ? err.message : 'Failed to update section',
      );
    }
  };

  const onDragStart = (e: React.DragEvent, section: Section) => {
    setDraggedItem(section);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedItem) return;
    const draggedOverItem = localSections[index];
    if (draggedItem.id === draggedOverItem.id) return;
    const items = localSections.filter((item) => item.id !== draggedItem.id);
    items.splice(index, 0, draggedItem);
    setLocalSections(items);
  };

  const onDragEnd = async () => {
    setDraggedItem(null);
    try {
      const updates = localSections.map((section, index) =>
        updateSection(section.id, { order: index }),
      );
      const results = await Promise.all(updates);
      const failed = results.find((r) => !r.success);
      if (failed) {
        throw new Error(failed.error || 'Failed to update order');
      }
      toast.success('Order updated');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to save new order',
      );
    }
  };

  const openPreview = () => {
    drawer.open(<SectionPreview sections={localSections} />);
  };

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <PageTitle emoji='🧱' title='Sections' subtitle='Drag to reorder' />

      <div className='flex justify-end'>
        <Button type='primary' icon='eye' onClick={openPreview}>
          Live Preview
        </Button>
      </div>

      <div className='space-y-3'>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className='flex items-center gap-3 rounded-md border border-border bg-card p-3 shadow-sm h-[66px]'
              >
                <Skeleton width={20} height={20} />
                <div className='flex-1 space-y-2'>
                  <Skeleton width='40%' height={16} />
                  <Skeleton width='20%' height={10} />
                </div>
                <Skeleton width={36} height={20} className='rounded-full' />
              </div>
            ))
          : localSections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => onDragStart(e, section)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                className={`flex items-center gap-3 rounded-md border bg-white p-3 shadow-sm transition-all dark:border-border dark:bg-card ${
                  draggedItem?.id === section.id
                    ? 'opacity-50 scale-95 border-gruv-blue'
                    : 'opacity-100'
                } cursor-grab active:cursor-grabbing`}
              >
                <div className='text-muted-foreground size-5 flex-shrink-0'>
                  <Icon name='dotsSixVertical' />
                </div>

                <div className='flex-1 min-w-0'>
                  <p className='font-medium truncate text-sm'>
                    {section.title}
                  </p>
                  <p className='text-[10px] text-muted-foreground font-mono'>
                    {section.name}
                  </p>
                </div>

                <div onPointerDown={(e) => e.stopPropagation()}>
                  <Switch
                    id={`show-${section.id}`}
                    checked={section.enabled}
                    onChange={() => handleToggle(section)}
                    label=''
                  />
                </div>
              </div>
            ))}
      </div>

      <div className='p-4 rounded-md bg-gruv-blue/10 dark:bg-gruv-blue/30/20 border border-gruv-blue/30 dark:border-gruv-blue/50 text-xs text-gruv-blue dark:text-gruv-blue'>
        <p>
          Drag sections to change their appearance order on the home page. Use
          the switches to show or hide sections.
        </p>
      </div>
    </div>
  );
}
