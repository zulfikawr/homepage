'use client';

import { useState, useMemo } from 'react';
import PostCard from '@/components/Card/Post';
import { postsData } from '@/functions/posts';
import PageTitle from '@/components/PageTitle';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import { Toggle } from '@/components/UI';

export default function PostsContent() {
  const { data: posts, loading, error } = useRealtimeData(postsData);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    posts?.forEach((post) => {
      post.categories?.forEach((cat) => set.add(cat));
    });
    return ['All', ...Array.from(set)];
  }, [posts]);

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
      return posts;
    }
    return posts?.filter((post) =>
      post.categories?.some((cat) => activeCategories.includes(cat)),
    );
  }, [posts, activeCategories]);

  if (error) return <div>Failed to load posts</div>;

  return (
    <div>
      <PageTitle
        emoji='📰'
        title='Posts'
        subtitle='Browse all posts written by me'
        route='/post'
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
