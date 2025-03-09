import React from 'react';
import PostCardComponent from './component';
import { Post } from 'types/post';

export interface PostCardProps {
  posts?: Post[];
  isInDrawer?: boolean;
  isInForm?: boolean;
}

const PostCard = ({ posts, isInDrawer, isInForm }: PostCardProps) => {
  return (
    <div className='w-full space-y-4'>
      {posts?.map((post: Post) => (
        <PostCardComponent
          key={post.id}
          post={post}
          isInDrawer={isInDrawer}
          isInForm={isInForm}
        />
      ))}
    </div>
  );
};

export default PostCard;
