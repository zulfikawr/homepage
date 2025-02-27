import React from 'react';
import CardWithImage from '~/components/Card/WithImage';
import CardWithOutImage from '~/components/Card/WithOutImage';
import { Post } from '~/constants/propTypes';

export interface StaticListProps {
  posts?: Post[];
}

const StaticList = ({ posts }: StaticListProps) => {
  return (
    <div>
      <div key='PostList' data-cy='indexPosts'>
        {posts.map((item: Post) => {
          if (item.img) {
            return <CardWithImage item={item} key={item.slug} />;
          } else {
            return <CardWithOutImage item={item} key={item.slug} />;
          }
        })}
      </div>
    </div>
  );
};

export default StaticList;
