'use client';

import { useEffect, useMemo, useState } from 'react';

import { Editor } from '@/components/Editor';
import { Card } from '@/components/UI';
import { toast } from '@/components/UI';
import { Button, Icon, Skeleton } from '@/components/UI';
import CommentCard from '@/components/UI/Card/variants/Comment';
import { useAuth } from '@/contexts/authContext';
import {
  addComment,
  deleteComment,
  likeComment,
  updateComment,
} from '@/database/comments';
import { useCollection } from '@/hooks';
import { useAuthActions } from '@/hooks/useAuthActions';
import { mapRecordToComment } from '@/lib/mappers';
import { getFileUrl } from '@/lib/storage';
import { Comment } from '@/types/comment';

import ImageWithFallback from '../ImageWithFallback';

interface CommentSectionProps {
  post_id: string;
  isLoading?: boolean;
}

export default function CommentSection({
  post_id,
  isLoading: external_loading = false,
}: CommentSectionProps) {
  const [author, set_author] = useState('');
  const [content, set_content] = useState('');
  const [is_submitting, setIsSubmitting] = useState(false);
  const { user, isAdmin, loading: auth_loading } = useAuth();
  const { handleGithubLogin, handleLogout: auth_logout } = useAuthActions();

  const github_username = user
    ? (user.username as string) ||
      (user.name as string) ||
      (user.email as string) ||
      ''
    : '';

  // Use the new generic collection hook
  const { data: all_comments, loading: data_loading } = useCollection<Comment>(
    'comments',
    mapRecordToComment,
  );

  const comments = useMemo(() => {
    if (!all_comments) return [];
    return all_comments
      .filter((c) => c.post_id === post_id)
      .sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
  }, [all_comments, post_id]);

  const isLoading = data_loading || external_loading;

  // Set author from user profile
  useEffect(() => {
    if (user && user.name) {
      set_author(user.name as string);
    }
  }, [user]);

  const handle_logout = async () => {
    try {
      auth_logout();
      set_author('');
      set_content('');
    } catch {
      toast.show('Failed to logout', 'error');
    }
  };

  const handle_submit_comment = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(
        post_id,
        github_username || author || ((user?.name as string) ?? 'Anonymous'),
        content,
        user?.avatar ? getFileUrl({}, user.avatar as string) : undefined,
      );
      set_content('');
      toast.show('Comment posted successfully!');
    } catch {
      toast.show('Failed to submit comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle_submit_reply = async (
    parent_id: string,
    reply_author: string,
    reply_content: string,
  ) => {
    try {
      await addComment(
        post_id,
        reply_author,
        reply_content,
        user?.avatar ? getFileUrl({}, user.avatar as string) : undefined,
        parent_id,
      );
      toast.show('Reply posted successfully!');
    } catch (error) {
      toast.show('Failed to submit reply', 'error');
      throw error;
    }
  };

  const handle_like = async (comment_id: string) => {
    if (!user) {
      toast.show('Please login to like comments', 'error');
      return;
    }
    try {
      await likeComment(comment_id);
    } catch {
      // Ignored
    }
  };

  const handle_delete = async (comment_id: string) => {
    try {
      await deleteComment(comment_id);
      toast.show('Comment deleted');
    } catch {
      // Ignored
    }
  };

  const handle_update = async (comment_id: string, new_content: string) => {
    try {
      await updateComment(comment_id, new_content);
      toast.show('Comment updated');
    } catch {
      // Ignored
    }
  };

  return (
    <section className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-3 h-8'>
          <h2 className='text-2xl font-bold dark:text-foreground'>Comments</h2>
          <div className='flex items-center justify-center min-w-[32px] h-6 rounded-full bg-muted dark:bg-card px-2.5'>
            {isLoading ? (
              <Skeleton width={16} height={12} />
            ) : (
              <span className='text-sm font-medium text-muted-foreground'>
                {comments?.length || 0}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <Card className='p-4 sm:p-6' isPreview>
        {auth_loading ? (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-x-3'>
                <Skeleton width={32} height={32} variant='circle' />
                <Skeleton width={100} height={16} />
              </div>
              <Skeleton width={60} height={24} className='rounded-md' />
            </div>
            <Skeleton width='100%' height={100} className='rounded-md' />
          </div>
        ) : user ? (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-x-3'>
                <ImageWithFallback
                  src={
                    user?.avatar ? getFileUrl({}, user.avatar as string) : ''
                  }
                  alt={github_username}
                  width={32}
                  height={32}
                  className='rounded-full'
                  sizes='32px'
                />
                <span className='font-medium dark:text-foreground'>
                  {github_username}
                </span>
              </div>
              <Button
                onClick={handle_logout}
                className='text-xs'
                variant='outline'
              >
                Logout
              </Button>
            </div>
            <Editor content={content} onUpdate={set_content} />
            <div className='flex justify-end'>
              <Button
                onClick={handle_submit_comment}
                disabled={is_submitting || !content.trim()}
                variant='primary'
              >
                {is_submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Icon
              name='chatCenteredText'
              className='mb-4 h-12 w-12 text-muted-foreground'
            />
            <h3 className='mb-2 text-lg font-medium dark:text-foreground'>
              Join the conversation
            </h3>
            <p className='mb-6 text-muted-foreground'>
              Please login with GitHub to post a comment.
            </p>
            <Button onClick={handleGithubLogin} icon='githubLogo'>
              Login with GitHub
            </Button>
          </div>
        )}
      </Card>

      {/* Comments List */}
      <div className='space-y-6'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <CommentCard isLoading={true} key={i} />
          ))
        ) : comments && comments.length > 0 ? (
          comments
            .filter((c) => !c.parent_id) // Only show top-level comments
            .map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                replies={comments.filter((c) => c.parent_id === comment.id)}
                onLike={() => handle_like(comment.id)}
                onReply={(author, content) =>
                  handle_submit_reply(comment.id, author, content)
                }
                onDelete={() => handle_delete(comment.id)}
                onEdit={(new_content) => handle_update(comment.id, new_content)}
                current_user_id={user?.id}
                is_admin={isAdmin}
              />
            ))
        ) : (
          <div className='py-12 text-center text-muted-foreground'>
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </section>
  );
}
