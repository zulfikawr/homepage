import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useSWR from 'swr';
import CardClickable from '~/components/Card/Clickable';
import CardEmpty from '~/components/Card/Empty';
import CardSkeleton from '~/components/Card/Skeleton';
import type { ListTypes, Post } from '~/constants/propTypes';
import StaticList from './staticList';
import fetcher from '~/lib/fetcher';

export interface InfiniteListProps {
  type: ListTypes;
  cate?: string;
  target?: string;
}

const InfiniteList = (props: InfiniteListProps) => {
  const { type } = props;
  const [stopLoading, setStopLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const postsPerPage = 10;

  const { data, error } = useSWR<{ posts: Post[] }>('/api/posts', fetcher);

  const allPosts = data?.posts || [];
  const paginatedPosts = allPosts.slice(0, page * postsPerPage);
  const hasMore = paginatedPosts.length < allPosts.length;

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (!data && !error) {
    return (
      <div>
        <CardClickable
          setStopLoading={setStopLoading}
          stopLoading={stopLoading}
        />
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return <CardEmpty />;
  }

  return (
    <InfiniteScroll
      dataLength={paginatedPosts.length}
      next={loadMore}
      hasMore={hasMore && !stopLoading}
      loader={
        <div>
          <CardClickable
            setStopLoading={setStopLoading}
            stopLoading={stopLoading}
          />
          <CardSkeleton />
        </div>
      }
      endMessage={
        !hasMore && stopLoading ? (
          <CardClickable
            setStopLoading={setStopLoading}
            stopLoading={stopLoading}
          />
        ) : (
          <CardEmpty />
        )
      }
      scrollThreshold='100px'
      scrollableTarget={type === 'search' ? 'searchResultsDiv' : ''}
    >
      <StaticList posts={paginatedPosts} />
    </InfiniteScroll>
  );
};

export default InfiniteList;
