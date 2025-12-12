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
} from '@/functions/comments';
import { Button, Icon } from '@/components/UI';
import { Card } from '@/components/Card';
import { Editor } from '@/components/Editor';
import { useAuth } from '@/contexts/authContext';
import {
  auth,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from '@/lib/firebase';
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
  const { user, loading: authLoading } = useAuth();

  const githubUsername =
    user?.providerData?.find(
      (p: { providerId: string }) => p.providerId === 'github.com',
    )?.displayName ||
    user?.displayName ||
    user?.email ||
    '';

  // Use the new realtime hook
  const { data: comments, loading: isLoading } = useRealtimeData<Comment[]>(
    useCallback((callback) => subscribeToComments(postId, callback), [postId]),
    [],
    [postId],
  );

  // Set author from user profile
  useEffect(() => {
    if (user?.displayName) {
      setAuthor(user.displayName);
    }
  }, [user]);

  const handleGithubLogin = async () => {
    setIsAuthLoading(true);
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
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
      await signOut(auth);
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
      // Root comments path: posts/{postId}/comments
      const rootCommentsPath = `posts/${postId}/comments`;

      await addComment(
        rootCommentsPath,
        githubUsername || author || user?.displayName || 'Anonymous',
        content,
        user?.photoURL || undefined,
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
    path: string,
    replyAuthor: string,
    replyContent: string,
  ) => {
    try {
      // The 'path' passed here is where the replies should go (comment.path), so we just use it directly
      await addComment(
        path,
        replyAuthor,
        replyContent,
        user?.photoURL || undefined,
      );
      toast.show('Reply posted!');
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.show('Failed to submit reply', 'error');
    }
  };

  const handleLike = async (path: string) => {
    if (!user) {
      toast.show('Please sign in with GitHub to like comments', 'info');
      return;
    }

    try {
      // 'path' here is the path to the comment object itself.
      await likeComment(path, user.uid);
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.show('Failed to update like', 'error');
    }
  };

  const handleDelete = async (path: string) => {
    try {
      await deleteComment(path);
      toast.show('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.show('Failed to delete comment', 'error');
    }
  };

  const handleEdit = async (path: string, newContent: string) => {
    try {
      await updateComment(path, newContent);
      toast.show('Comment updated');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.show('Failed to update comment', 'error');
    }
  };

  const handleReply = () => {
    // This can be expanded to auto-fill reply with mention
  };

  return (
    <section className='mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold tracking-wide text-neutral-900 dark:text-white'>
          Comments
        </h2>
        <span className='text-sm text-neutral-500 dark:text-neutral-400'>
          {comments?.length || 0}{' '}
          {(comments?.length || 0) === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      {/* Comments list */}
      <div className='space-y-4 mb-12'>
        {isLoading ? (
          <p className='text-center text-sm text-neutral-500 dark:text-neutral-400 py-8'>
            Loading comments...
          </p>
        ) : !comments || comments.length === 0 ? (
          <div className='text-center text-sm text-neutral-500 dark:text-neutral-400 py-12'>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onSubmitReply={handleSubmitReply}
              onLike={handleLike}
              onDelete={handleDelete}
              onEdit={handleEdit}
              currentUserName={githubUsername}
              currentUserAvatar={user?.photoURL}
              currentUserId={user?.uid}
              isAuthenticated={!!user}
              isAdmin={user?.uid === process.env.NEXT_PUBLIC_ADMIN_UID}
            />
          ))
        )}
      </div>

      {/* Comment form */}
      {!authLoading && !user ? (
        <Card className='mb-8' isPreview>
          <div className='flex items-center justify-between border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
            <h3 className='text-sm font-semibold tracking-wide text-neutral-900 dark:text-white'>
              Login to comment
            </h3>
          </div>

          <div className='flex items-center justify-center py-6'>
            <Button
              type='primary'
              onClick={handleGithubLogin}
              disabled={isAuthLoading}
            >
              <span className='flex items-center gap-2'>
                <Icon name='github' className='size-5' />
                {isAuthLoading ? 'Signing in...' : 'Sign in with GitHub'}
              </span>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className='mb-8' isPreview>
          <div className='flex items-center justify-between border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
            <div className='flex items-center'>
              <h3 className='text-sm font-semibold tracking-wide text-neutral-900 dark:text-white'>
                Add a comment
              </h3>
            </div>
            <Button
              type='ghost'
              onClick={handleLogout}
              className='p-1 h-auto text-xs'
            >
              Logout
            </Button>
          </div>

          <div className='p-4.5 space-y-3'>
            <div className='flex items-center gap-3'>
              <ImageWithFallback
                src={user?.photoURL || undefined}
                alt={user?.displayName || 'User'}
                width={24}
                height={24}
                type='square'
              />
              <span className='font-medium text-neutral-900 dark:text-white'>
                {githubUsername}
              </span>
            </div>
            <Editor
              content={content}
              onUpdate={(newContent) => setContent(newContent)}
              textareaClassName='min-h-[200px] md:min-h-[250px]'
            />
            <div className='flex justify-end'>
              <Button
                type='primary'
                onClick={handleSubmitComment}
                disabled={isSubmitting || !content.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}
