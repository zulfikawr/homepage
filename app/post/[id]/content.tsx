import PostContent from '@/components/PostContent';
import { Post } from '@/types/post';
import PageTitle from '@/components/PageTitle';
import CommentSection from '@/components/CommentSection';

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
        image={post.image}
        isPostTitle
      />

      <PostContent content={post.content} />

      <CommentSection postId={post.id} />
    </div>
  );
}
