'use client';

import { useState, useMemo } from 'react';
import PostCard from '@/components/Card/Post';
import { postsData } from '@/database/posts.client';
import PageTitle from '@/components/PageTitle';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import { Toggle, Icon } from '@/components/UI';
import { sortByDate } from '@/utilities/sortByDate';
import { Post } from '@/types/post';

interface PostsContentProps {
  initialData?: Post[];
}

export default function PostsContent({ initialData }: PostsContentProps) {
  const {
    data: posts,
    loading,
    error,
  } = useRealtimeData(postsData, initialData);
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

  if (error) return <CardEmpty message='Failed to load posts' />;

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

      {loading ? (
        <div className='flex flex-col gap-y-4'>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <CardLoading key={index} type='post' />
            ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <CardEmpty message='No posts found.' />
      ) : (
        <div className='grid grid-cols-1 gap-6'>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
