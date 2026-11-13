'use client';

import { useMemo, useState } from 'react';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Icon, Toggle } from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import { POST_TEMPLATE } from '@/components/ui/card/variants/loading';
import { Shimmer } from '@/components/ui/shimmer';
import PostCard from '@/components/ui/card/variants/post';
import { Post } from '@/types/post';
import { sortByDate } from '@/utilities/sort-by-date';

const POST_TEMPLATES: Post[] = Array.from({ length: 8 }, (_, index) => ({
  ...POST_TEMPLATE,
  id: `loading-post-${index}`,
  slug: `loading-post-${index}`,
}));

export function PostsSkeleton() {
  return (
    <Shimmer loading>
      <PostsContent posts={POST_TEMPLATES} />
    </Shimmer>
  );
}

export default function PostsContent({ posts }: { posts: Post[] }) {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  const sortedPosts = useMemo(() => (posts ? sortByDate(posts) : []), [posts]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    sortedPosts?.forEach((post) => {
      post.categories?.forEach((cat) => set.add(cat));
    });
    return ['All', ...Array.from(set)];
  }, [sortedPosts]);

  const toggleCategory = (category: string) => {
    if (category === 'All') {
      setActiveCategories([]);
    } else {
      setActiveCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev.filter((c) => c !== 'All'), category],
      );
    }
  };

  const filteredPosts = useMemo(() => {
    if (!activeCategories.length || activeCategories.includes('All')) {
      return sortedPosts;
    }
    return sortedPosts?.filter((post) =>
      post.categories?.some((cat) => activeCategories.includes(cat)),
    );
  }, [sortedPosts, activeCategories]);

  return (
    <div>
      <PageTitle
        emoji='📰'
        title='Posts'
        subtitle='Browse all posts written by me'
      />

      <div className='flex flex-wrap gap-2 mb-6'>
        {allCategories.map((cat) => (
          <Toggle
            key={cat}
            isActive={
              (cat === 'All' && activeCategories.length === 0) ||
              activeCategories.includes(cat)
            }
            onChange={() => toggleCategory(cat)}
          >
            {cat !== 'All' && (
              <Icon name='tag' size={14} className='ml-2 shrink-0' />
            )}
            <span className='px-2 text-sm font-medium'>{cat}</span>
          </Toggle>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <CardEmpty message='No posts found.' />
      ) : (
        <div className='grid grid-cols-1 gap-6'>
          <StaggerContainer>
            {filteredPosts.map((post, index) => (
              <ViewTransition key={post.id}>
                <PostCard post={post} priority={index === 0} />
              </ViewTransition>
            ))}
          </StaggerContainer>
        </div>
      )}
    </div>
  );
}
