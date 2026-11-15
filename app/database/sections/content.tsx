'use client';

import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import BannerGrid from '@/components/section/banners/grid';
// Preview Components
import EmploymentSection from '@/components/section/employment';
import InterestsAndObjectivesSection from '@/components/section/interests-and-objectives';
import PersonalInfoSection from '@/components/section/personal-info';
import PostSection from '@/components/section/post';
import ProjectSection from '@/components/section/project';
import { drawer } from '@/components/ui';
import { toast } from '@/components/ui';
import { Button, Icon, Switch } from '@/components/ui';
import { Shimmer } from '@/components/ui/shimmer';
import CardEmpty from '@/components/ui/card/variants/empty';
import { useCollection } from '@/hooks';
import { DEFAULT_BANNER_SETTINGS } from '@/lib/banner-config';
import {
  mapRecordToEmployment,
  mapRecordToInterests,
  mapRecordToPersonalInfo,
  mapRecordToPost,
  mapRecordToProject,
  mapRecordToSection,
} from '@/lib/mappers';
import { Section } from '@/types/section';

const TEMPLATE_SECTIONS: Section[] = [
  'personal-info',
  'banners',
  'interests',
  'projects',
  'employment',
  'posts',
].map((name, index) => ({
  id: `loading-${name}`,
  name,
  title: name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' '),
  enabled: true,
  order: index,
}));

const SectionPreview = ({
  sections,
  bannerNodes,
}: {
  sections: Section[];
  bannerNodes: Record<string, React.ReactNode>;
}) => {
  const { data: profile } = useCollection('profile', mapRecordToPersonalInfo);
  const { data: posts } = useCollection('posts', mapRecordToPost);
  const { data: projects } = useCollection('projects', mapRecordToProject);
  const { data: employments } = useCollection(
    'employments',
    mapRecordToEmployment,
  );
  const { data: interests } = useCollection(
    'interestsAndObjectives',
    mapRecordToInterests,
  );

  const sectionMap: Record<string, React.ReactNode> = {
    'personal-info': <PersonalInfoSection data={profile?.[0]} />,
    banners: (
      <BannerGrid settings={DEFAULT_BANNER_SETTINGS} nodes={bannerNodes} />
    ),
    interests: <InterestsAndObjectivesSection data={interests?.[0]} />,
    projects: <ProjectSection data={projects} />,
    employment: <EmploymentSection data={employments} />,
    posts: <PostSection data={posts} />,
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

export default function SectionDatabase({
  bannerNodes,
}: {
  bannerNodes: Record<string, React.ReactNode>;
}) {
  const {
    data: sections,
    loading,
    error,
  } = useCollection<Section>('sections', mapRecordToSection);

  const [draggedItem, setDraggedItem] = useState<Section | null>(null);
  const [localSections, setLocalSections] = useState<Section[]>([]);
  const [syncedSectionsKey, setSyncedSectionsKey] = useState<
    string | undefined
  >();

  // Sync incoming sections during render (avoids setState-in-effect) and only
  // when the remote data actually changed, so optimistic reorders are kept.
  const sectionsKey = sections
    ?.map((section) => `${section.id}:${section.order}:${section.enabled}`)
    .join('|');
  if (sections && sectionsKey !== syncedSectionsKey) {
    setSyncedSectionsKey(sectionsKey);
    setLocalSections([...sections].sort((a, b) => a.order - b.order));
  }

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
      const response = await fetch('/api/collection/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: section.id, enabled: newEnabled }),
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };
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
        fetch('/api/collection/sections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: section.id, order: index }),
        }).then(
          (res) => res.json() as Promise<{ success: boolean; error?: string }>,
        ),
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
    drawer.open(
      <SectionPreview sections={localSections} bannerNodes={bannerNodes} />,
    );
  };

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <PageTitle emoji='🧱' title='Sections' subtitle='Drag to reorder' />

      <div className='flex justify-end'>
        <Button variant='primary' icon='eye' onClick={openPreview}>
          Live Preview
        </Button>
      </div>

      <div className='space-y-3'>
        <Shimmer loading={loading}>
          <StaggerContainer>
            {(loading ? TEMPLATE_SECTIONS : localSections).map(
              (section, index) => (
                <ViewTransition key={section.id}>
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(e, section)}
                    onDragOver={(e) => onDragOver(e, index)}
                    onDragEnd={onDragEnd}
                    className={twMerge(
                      'flex items-center gap-3 rounded-md border bg-white p-3 shadow-sm transition-all  dark:bg-card',
                      draggedItem?.id === section.id
                        ? 'opacity-50 scale-95 border-theme-blue'
                        : 'opacity-100',
                      'cursor-grab active:cursor-grabbing',
                    )}
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
                </ViewTransition>
              ),
            )}
          </StaggerContainer>
        </Shimmer>
      </div>

      <div className='p-4 rounded-md bg-theme-blue/10 dark:bg-theme-blue/30/20 border border-theme-blue/30 dark:border-theme-blue/50 text-xs text-theme-blue dark:text-theme-blue'>
        <p>
          Drag sections to change their appearance order on the home page. Use
          the switches to show or hide sections.
        </p>
      </div>
    </div>
  );
}
