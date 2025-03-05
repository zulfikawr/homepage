import React from 'react';
import CardText from '~/components/Card/Post/Text';
import CardWithImage from '~/components/Card/Post/WithImage';
import CardWithAudio from '~/components/Card/Post/WithAudio';
import CardWithImageAndAudio from '~/components/Card/Post/WithImageAndAudio';
import { Post } from '~/types/post';

export interface PostCardProps {
  posts?: Post[];
  isInDrawer?: boolean;
  isInForm?: boolean;
}

const PostCard = ({ posts, isInDrawer, isInForm }: PostCardProps) => {
  return (
    <div className='w-full'>
      {posts.map((post: Post) => {
        if (post.img && post.audioUrl) {
          return <CardWithImageAndAudio post={post} key={post.slug} />;
        } else if (post.img) {
          return <CardWithImage post={post} key={post.slug} />;
        } else if (post.audioUrl) {
          return <CardWithAudio post={post} key={post.slug} />;
        } else {
          return (
            <CardText
              post={post}
              key={post.slug}
              isInDrawer={isInDrawer}
              isInForm={isInForm}
            />
          );
        }
      })}
    </div>
  );
};

export default PostCard;
