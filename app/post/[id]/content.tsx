import CommentSection from '@/components/CommentSection';
import { ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import PostContent from '@/components/PostContent';
import { Post } from '@/types/post';

interface BlogPostContentProps {
  post: Post;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <div>
      <ViewTransition>
        <PageTitle
          title={post.title}
          subtitle={post.excerpt}
          category={post.categories[0]}
          image={post.image}
          isPostTitle
        />
      </ViewTransition>

      <ViewTransition>
        <PostContent content={post.content} />
      </ViewTransition>

      <ViewTransition>
        <CommentSection postId={post.id} />
      </ViewTransition>
    </div>
  );
}
