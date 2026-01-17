'use client';

import { Comment } from '@/types/comment';
import { useCallback, useEffect, useState } from 'react';
import CommentCard from '@/components/Card/Comment';
import {
  addComment,
  subscribeToComments,
  likeComment,
  deleteComment,
  updateComment,
} from '@/database/comments';
import { Button, Icon } from '@/components/UI';
import { Card } from '@/components/Card';
import { Editor } from '@/components/Editor';
import { useAuth } from '@/contexts/authContext';
import pb from '@/lib/pocketbase';
import { toast } from '@/components/Toast';
import ImageWithFallback from '../ImageWithFallback';
import { useRealtimeData } from '@/hooks/useRealtimeData';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  const githubUsername =
    (user as any)?.username || (user as any)?.name || user?.email || '';

  // Use the new realtime hook
  const { data: comments, loading: isLoading } = useRealtimeData<Comment[]>(
    useCallback((callback) => subscribeToComments(postId, callback), [postId]),
    [],
    [postId],
  );

  // Set author from user profile
  useEffect(() => {
    if ((user as any)?.name) {
      setAuthor((user as any).name);
    }
  }, [user]);

  const handleGithubLogin = async () => {
    setIsAuthLoading(true);
    try {
      await pb.collection('users').authWithOAuth2({ provider: 'github' });
      toast.show('Logged in with GitHub!');
    } catch (error) {
      console.error('GitHub login error:', error);
      toast.show('Failed to login with GitHub', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      pb.authStore.clear();
      setAuthor('');
      setContent('');
      toast.show('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.show('Failed to logout', 'error');
    }
  };

  const handleSubmitComment = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(
        postId,
        githubUsername || author || (user as any)?.name || 'Anonymous',
        content,
        (user as any)?.avatar
          ? pb.files.getUrl(user as any, (user as any).avatar)
          : undefined,
      );
      setContent('');
      toast.show('Comment posted successfully!');
    } catch (error) {
      console.error('Error submitting comment:', error);
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
        (user as any)?.avatar
          ? pb.files.getUrl(user as any, (user as any).avatar)
          : undefined,
        parentId,
      );
      toast.show('Reply posted successfully!');
    } catch (error) {
      console.error('Error submitting reply:', error);
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
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.show('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleUpdate = async (commentId: string, newContent: string) => {
    try {
      await updateComment(commentId, newContent);
      toast.show('Comment updated');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <section className='mt-12 space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-3'>
          <h2 className='text-2xl font-bold dark:text-white'>Comments</h2>
          <span className='rounded-full bg-neutral-100 px-2.5 py-0.5 text-sm font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'>
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
                    (user as any)?.avatar
                      ? pb.files.getUrl(user as any, (user as any).avatar)
                      : ''
                  }
                  alt={githubUsername}
                  width={32}
                  height={32}
                  className='rounded-full'
                />
                <span className='font-medium dark:text-white'>
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
              className='mb-4 h-12 w-12 text-neutral-300'
            />
            <h3 className='mb-2 text-lg font-medium dark:text-white'>
              Join the conversation
            </h3>
            <p className='mb-6 text-neutral-500 dark:text-neutral-400'>
              Please login with GitHub to post a comment.
            </p>
            <Button
              onClick={handleGithubLogin}
              icon='github'
              disabled={isAuthLoading}
            >
              {isAuthLoading ? 'Logging in...' : 'Login with GitHub'}
            </Button>
          </div>
        )}
      </Card>

      {/* Comments List */}
      <div className='space-y-6'>
        {isLoading ? (
          <div className='flex justify-center py-12'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary' />
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
          <div className='py-12 text-center text-neutral-500 dark:text-neutral-400'>
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </section>
  );
}
