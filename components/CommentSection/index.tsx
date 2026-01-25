'use client';

import { Comment } from '@/types/comment';
import { useMemo, useEffect, useState } from 'react';
import CommentCard from '@/components/Card/Comment';
import {
  addComment,
  likeComment,
  deleteComment,
  updateComment,
} from '@/database/comments';
import { mapRecordToComment } from '@/lib/mappers';
import { Button, Icon } from '@/components/UI';
import { Card } from '@/components/Card';
import { Editor } from '@/components/Editor';
import { useAuth } from '@/contexts/authContext';
import { RecordModel } from 'pocketbase';
import { toast } from '@/components/Toast';
import ImageWithFallback from '../ImageWithFallback';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useCollection } from '@/hooks';
import { getFileUrl } from '@/lib/storage';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin } = useAuth();
  const { handleGithubLogin, handleLogout: authLogout } = useAuthActions();

  const githubUsername = user
    ? (user.username as string) ||
      (user.name as string) ||
      (user.email as string) ||
      ''
    : '';

  // Use the new generic collection hook
  const { data: comments, loading: isLoading } = useCollection<Comment>(
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
    <section className='mt-12 space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-3'>
          <h2 className='text-2xl font-bold dark:text-foreground'>Comments</h2>
          <span className='rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium text-muted-foreground dark:bg-card dark:text-muted-foreground'>
            {comments?.length || 0}
          </span>
        </div>
      </div>

      {/* Comment Input */}
      <Card className='p-4 sm:p-6'>
        {user ? (
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
          <div className='flex justify-center py-12'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary' />
          </div>
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
