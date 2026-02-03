'use client';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PostCard from '@/components/ui/card/variants/post';
import { Post } from '@/types/post';

export default function PostClient({ posts }: { posts: Post[] }) {
  return (
    <div className='grid grid-cols-1 gap-6'>
      <StaggerContainer>
        {posts.map((post) => (
          <ViewTransition key={post.id}>
            <div key={post.id} className='cursor-pointer'>
              <PostCard post={post} />
            </div>
          </ViewTransition>
        ))}
      </StaggerContainer>
    </div>
  );
}
