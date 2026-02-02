'use client';

import SectionTitle from '@/components/SectionTitle';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import { useLoadingToggle } from '@/contexts/loadingContext';
import { Post } from '@/types/post';
import { sortByDate } from '@/utilities/sortByDate';

import PostClient from './PostClient';

export const PostLayout = ({
  posts,
  isLoading = false,
}: {
  posts?: Post[];
  isLoading?: boolean;
}) => {
  const sortedPosts = posts ? sortByDate(posts) : [];

  return (
    <section>
      <SectionTitle
        icon='notePencil'
        title='Latest Posts'
        loading={isLoading}
        link={
          !isLoading
            ? {
                href: '/posts',
                label: 'All Posts',
              }
            : undefined
        }
      />
      {isLoading ? (
        <div className='flex flex-col gap-y-4'>
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <CardLoading key={i} variant='post' />
            ))}
        </div>
      ) : sortedPosts.length === 0 ? (
        <CardEmpty message='No posts found.' />
      ) : (
        <PostClient posts={sortedPosts} />
      )}
    </section>
  );
};

export default function PostSection({ data }: { data: Post[] }) {
  const { forceLoading } = useLoadingToggle();

  if (forceLoading) {
    return <PostLayout isLoading={true} />;
  }

  return <PostLayout posts={data} isLoading={false} />;
}
