'use client';

import { useEffect, useMemo, useState } from 'react';
import { RecordModel } from 'pocketbase';

import { Card } from '@/components/Card';
import CommentCard from '@/components/Card/Comment';
import { Editor } from '@/components/Editor';
import { toast } from '@/components/Toast';
import { Button, Icon, Skeleton } from '@/components/UI';
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
  postId: string;
  isLoading?: boolean;
}

export default function CommentSection({
  postId,
  isLoading: externalLoading = false,
}: CommentSectionProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { handleGithubLogin, handleLogout: authLogout } = useAuthActions();

  const githubUsername = user
    ? (user.username as string) ||
      (user.name as string) ||
      (user.email as string) ||
      ''
    : '';

  // Use the new generic collection hook
  const { data: comments, loading: dataLoading } = useCollection<Comment>(
    'comments',
    mapRecordToComment,
    useMemo(
      () => ({
        filter: `postId = "${postId}"`,
        sort: '-created',
      }),
      [postId],
    ),
  );

  const isLoading = dataLoading || externalLoading;

  // Set author from user profile
  useEffect(() => {
    if (user && user.name) {
      setAuthor(user.name as string);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      authLogout();
      setAuthor('');
      setContent('');
    } catch {
      toast.show('Failed to logout', 'error');
    }
  };

  const handleSubmitComment = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(
        postId,
        githubUsername || author || ((user?.name as string) ?? 'Anonymous'),
        content,
        user?.avatar
          ? getFileUrl(user as unknown as RecordModel, user.avatar as string)
          : undefined,
      );
      setContent('');
      toast.show('Comment posted successfully!');
    } catch {
      toast.show('Failed to submit comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (
    parentId: string,
    replyAuthor: string,
    replyContent: string,
  ) => {
    try {
      await addComment(
        postId,
        replyAuthor,
        replyContent,
        user?.avatar
          ? getFileUrl(user as unknown as RecordModel, user.avatar as string)
          : undefined,
        parentId,
      );
      toast.show('Reply posted successfully!');
    } catch (error) {
      toast.show('Failed to submit reply', 'error');
      throw error;
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) {
      toast.show('Please login to like comments', 'error');
      return;
    }
    try {
      await likeComment(commentId, user.id);
    } catch {
      // Ignored
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.show('Comment deleted');
    } catch {
      // Ignored
    }
  };

  const handleUpdate = async (commentId: string, newContent: string) => {
    try {
      await updateComment(commentId, newContent);
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
        {authLoading ? (
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
                    user?.avatar
                      ? getFileUrl(
                          user as unknown as RecordModel,
                          user.avatar as string,
                        )
                      : ''
                  }
                  alt={githubUsername}
                  width={32}
                  height={32}
                  className='rounded-full'
                  sizes='32px'
                />
                <span className='font-medium dark:text-foreground'>
                  {githubUsername}
                </span>
              </div>
              <Button onClick={handleLogout} className='text-xs' type='outline'>
                Logout
              </Button>
            </div>
            <Editor content={content} onUpdate={setContent} />
            <div className='flex justify-end'>
              <Button
                onClick={handleSubmitComment}
                disabled={isSubmitting || !content.trim()}
                type='primary'
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
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
            <CommentCard key={i} isLoading={true} />
          ))
        ) : comments && comments.length > 0 ? (
          comments
            .filter((c) => !c.parentId) // Only show top-level comments
            .map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                replies={comments.filter((c) => c.parentId === comment.id)}
                onLike={() => handleLike(comment.id)}
                onReply={(author, content) =>
                  handleSubmitReply(comment.id, author, content)
                }
                onDelete={() => handleDelete(comment.id)}
                onEdit={(newContent) => handleUpdate(comment.id, newContent)}
                currentUserId={user?.id}
                isAdmin={isAdmin}
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
