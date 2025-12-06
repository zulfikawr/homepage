'use client';

import { Comment } from '@/types/comment';
import { useEffect, useState } from 'react';
import CommentCard from '@/components/CommentCard';
import {
  addComment,
  subscribeToComments,
  likeComment,
} from '@/functions/comments';
import { Button, FormLabel, Input, Textarea } from '@/components/UI';
import { Card } from '@/components/Card';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [author, setAuthor] = useState('Anonymous');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe to real-time comment updates
  useEffect(() => {
    const unsubscribe = subscribeToComments(postId, (updatedComments) => {
      setComments(updatedComments);
      setIsLoading(false);
    });

    return () => unsubscribe?.();
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, author, content);
      setContent('');
      setAuthor('Anonymous');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
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
      await addComment(postId, replyAuthor, replyContent, parentId);
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply. Please try again.');
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await likeComment(postId, commentId);
    } catch (error) {
      console.error('Error liking comment:', error);
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
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      {/* Comment form */}
      <Card className='mb-8' isPreview>
        <div className='flex items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
          <h3 className='text-sm font-semibold tracking-wide text-neutral-900 dark:text-white'>
            Add a comment
          </h3>
        </div>

        <div className='p-4.5 space-y-3'>
          <div>
            <FormLabel htmlFor='comment-author'>Your name (optional)</FormLabel>
            <Input
              id='comment-author'
              type='text'
              placeholder='Anonymous'
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div>
            <FormLabel htmlFor='comment-content'>Comment</FormLabel>
            <Textarea
              id='comment-content'
              placeholder='Share your thoughts...'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

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

      {/* Comments list */}
      <div className='space-y-4'>
        {isLoading ? (
          <p className='text-center text-sm text-neutral-500 dark:text-neutral-400 py-8'>
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
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
            />
          ))
        )}
      </div>
    </section>
  );
}
