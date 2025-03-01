import React from 'react';
import CardWithImage from '~/components/Card/WithImage';
import CardWithOutImage from '~/components/Card/WithOutImage';
import { Post } from '~/types/post';

export interface PostCardProps {
  posts?: Post[];
}

const PostCard = ({ posts }: PostCardProps) => {
  return (
    <div>
      {posts.map((item: Post) => {
        if (item.img) {
          return <CardWithImage item={item} key={item.slug} />;
        } else {
          return <CardWithOutImage item={item} key={item.slug} />;
        }
      })}
    </div>
  );
};

export default PostCard;
