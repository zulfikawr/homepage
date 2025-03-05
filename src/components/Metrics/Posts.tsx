import MetricCard from './Card';
import { useEffect, useState } from 'react';
import { getPosts } from '~/functions/posts';
import { commaNumber } from '~/utilities/commaNumber';

export default function PostsMetric() {
  const [postCount, setPostCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getPosts();
        setPostCount(posts.length);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPostCount(null);
      }
    };

    fetchPosts();
  }, []);

  const link = '/post';

  return (
    <MetricCard
      icon='hash'
      value={commaNumber(postCount)}
      description='Total Posts'
      link={link}
      colorHex='#F59E0B'
    />
  );
}
