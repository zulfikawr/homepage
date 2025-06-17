import PostContent from '@/components/PostContent';
import { Post } from '@/types/post';
import PageTitle from '@/components/PageTitle';

interface BlogPostContentProps {
  post: Post;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <div>
      <PageTitle
        title={post.title}
        subtitle={post.excerpt}
        route={`/post/${post.id}`}
        category={post.categories[0]}
        isPostTitle
      />

      <PostContent content={post.content} />
    </div>
  );
}
