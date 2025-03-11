import MetricCard from './Card';
import { commaNumber } from '@/utilities/commaNumber';
import { useFetchData } from '@/lib/fetchData';
import { getPosts } from '@/functions/posts';

export default function PostsMetric() {
  const fetchPosts = async () => {
    const posts = await getPosts();
    return posts.length;
  };

  const { data: postCount } = useFetchData(fetchPosts);

  return (
    <MetricCard
      icon='hash'
      value={commaNumber(postCount)}
      description='Total Posts'
      link='/post'
      colorHex='#9CA3AF'
    />
  );
}
