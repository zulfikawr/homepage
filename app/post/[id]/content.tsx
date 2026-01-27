import CommentSection from '@/components/CommentSection';
import { ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import PostContent from '@/components/PostContent';
import { Post } from '@/types/post';

interface BlogPostContentProps {
  post?: Post;
  isLoading?: boolean;
}

export default function BlogPostContent({
  post,
  isLoading = false,
}: BlogPostContentProps) {
  return (
    <div>
      <ViewTransition>
        <PageTitle
          title={post?.title || ''}
          subtitle={post?.excerpt || ''}
          category={post?.categories?.[0] || ''}
          image={post?.image}
          isPostTitle
          isLoading={isLoading}
        />
      </ViewTransition>

      <ViewTransition>
        <PostContent content={post?.content || ''} isLoading={isLoading} />
      </ViewTransition>

      <ViewTransition>
        <CommentSection postId={post?.id || ''} isLoading={isLoading} />
      </ViewTransition>
    </div>
  );
}
