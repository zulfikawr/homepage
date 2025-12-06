'use client';

import { Comment } from '@/types/comment';
import { useState } from 'react';
import { getTimeAgo } from '@/utilities/timeAgo';
import { Button, Input, Textarea, FormLabel } from '@/components/UI';
import { Card } from '@/components/Card';
import Separator from '@/components/UI/Separator';

interface CommentCardProps {
  comment: Comment;
  onReply: (parentId: string, author: string) => void;
  onSubmitReply: (
    parentId: string,
    author: string,
    content: string,
  ) => Promise<void>;
  onLike: (commentId: string) => Promise<void>;
  level?: number;
}

export default function CommentCard({
  comment,
  onReply,
  onSubmitReply,
  onLike,
  level = 0,
}: CommentCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('Anonymous');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const [editedAuthor, setEditedAuthor] = useState(comment.author);
  const [isLiking, setIsLiking] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;

    setIsLoading(true);
    try {
      await onSubmitReply(comment.id, replyAuthor, replyContent);
      setReplyContent('');
      setReplyAuthor('Anonymous');
      setIsReplying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    setIsLiking(true);
    try {
      await onLike(comment.id);
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const maxNesting = 3;
  const canReply = level < maxNesting;

  return (
    <div className={`${level > 0 ? 'ml-4 md:ml-8' : ''}`}>
      <Card className='mb-4' isPreview>
        {/* Author and timestamp */}
        <div className='flex items-center justify-between border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <span className='font-medium text-neutral-900 dark:text-white'>
                {isEditingAuthor ? (
                  <Input
                    type='text'
                    value={editedAuthor}
                    onChange={(e) => setEditedAuthor(e.target.value)}
                    onBlur={() => setIsEditingAuthor(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingAuthor(false);
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => setIsEditingAuthor(true)}
                    className='cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition'
                  >
                    {comment.author}
                  </span>
                )}
              </span>
            </div>
            <span className='text-xs text-neutral-500 dark:text-neutral-400'>
              {getTimeAgo(new Date(comment.createdAt).toISOString())}
            </span>
          </div>
        </div>

        {/* Comment content */}
        <div className='p-4.5'>
          <p className='text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm'>
            {comment.content}
          </p>
        </div>

        {/* Action buttons */}
        <div className='flex gap-4 px-4.5 py-2 border-t border-neutral-200 dark:border-neutral-700'>
          <Button
            type='ghost'
            onClick={handleLike}
            disabled={isLiking}
            className='p-1 h-auto text-xs'
          >
            <span className='flex items-center gap-2'>
              <span>👍</span>
              <span className='text-neutral-600 dark:text-neutral-400'>
                {comment.likes || 0}
              </span>
            </span>
          </Button>
          {canReply && (
            <Button
              type='ghost'
              onClick={() => setIsReplying(!isReplying)}
              className='p-1 h-auto text-xs'
            >
              <span className='flex items-center gap-2'>
                <span>↳</span>
                <span className='text-neutral-600 dark:text-neutral-400'>
                  Reply
                </span>
              </span>
            </Button>
          )}
        </div>

        {/* Reply form */}
        {isReplying && (
          <>
            <Separator margin='0' />
            <div className='p-4.5 space-y-3'>
              <div>
                <FormLabel htmlFor={`reply-name-${comment.id}`}>
                  Your name
                </FormLabel>
                <Input
                  id={`reply-name-${comment.id}`}
                  type='text'
                  placeholder='Anonymous'
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                />
              </div>
              <div>
                <FormLabel htmlFor={`reply-content-${comment.id}`}>
                  Your reply
                </FormLabel>
                <Textarea
                  id={`reply-content-${comment.id}`}
                  placeholder='Share your thoughts...'
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                />
              </div>
              <div className='flex gap-2 justify-end'>
                <Button
                  type='default'
                  onClick={() => setIsReplying(false)}
                  className='h-9'
                >
                  Cancel
                </Button>
                <Button
                  type='primary'
                  onClick={handleSubmitReply}
                  disabled={isLoading || !replyContent.trim()}
                  className='h-9'
                >
                  {isLoading ? 'Sending...' : 'Reply'}
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Nested replies */}
      {comment.replies && Object.values(comment.replies).length > 0 && (
        <div className='space-y-3'>
          {Object.entries(comment.replies).map(([replyId, reply]) => (
            <CommentCard
              key={replyId}
              comment={{ ...reply, id: replyId }}
              onReply={onReply}
              onSubmitReply={onSubmitReply}
              onLike={onLike}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
