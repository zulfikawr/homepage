'use client';

import { Comment } from '@/types/comment';
import { useState } from 'react';
import { getTimeAgo } from '@/utilities/timeAgo';
import { Button, Icon } from '@/components/UI';
import { Card } from '@/components/Card';
import Separator from '@/components/UI/Separator';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Editor } from '@/components/Editor';
import { renderMarkdown } from '@/utilities/renderMarkdown';
import { Dropdown, DropdownItem } from '@/components/UI/Dropdown';
import { escapeHtml } from '@/utilities/escapeHtml';
import { toast } from '@/components/Toast';

const MAX_CHARS = 5000;

interface CommentCardProps {
  comment: Comment;
  onReply: (path: string, author: string) => void;
  onSubmitReply: (
    path: string,
    author: string,
    content: string,
  ) => Promise<void>;
  onLike: (path: string) => Promise<void>;
  onDelete?: (path: string) => Promise<void>;
  onEdit?: (path: string, newContent: string) => Promise<void>;
  level?: number;
  currentUserName?: string;
  currentUserAvatar?: string;
  currentUserId?: string;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

export default function CommentCard({
  comment,
  onReply,
  onSubmitReply,
  onLike,
  onDelete,
  onEdit,
  level = 0,
  currentUserName,
  currentUserAvatar,
  currentUserId,
  isAdmin,
}: CommentCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState(
    currentUserName || 'Anonymous',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReplyChange = (val: string) => {
    if (val.length <= MAX_CHARS) setReplyContent(val);
  };

  const handleEditChange = (val: string) => {
    if (val.length <= MAX_CHARS) setEditContent(val);
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !comment.path) return;

    if (replyContent.length > MAX_CHARS) {
      toast.error(`Reply cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    setIsLoading(true);
    try {
      // Sanitize Content and Author
      const safeContent = escapeHtml(replyContent.trim());
      const safeAuthor = escapeHtml(replyAuthor.trim());

      await onSubmitReply(comment.path, safeAuthor, safeContent);
      setReplyContent('');
      setReplyAuthor('Anonymous');
      setIsReplying(false);
    } catch (error) {
      console.error('Reply failed', error);
      toast.error('Failed to post reply.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!comment.path || !editContent.trim() || !onEdit) return;

    if (editContent.length > MAX_CHARS) {
      toast.error(`Comment cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    setIsUpdating(true);
    try {
      const commentSelfPath = comment.path.replace(/\/replies$/, '');

      // Sanitize Content
      const safeContent = escapeHtml(editContent.trim());

      await onEdit(commentSelfPath, safeContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLike = async () => {
    if (!comment.path) return;

    setIsLiking(true);
    try {
      const commentSelfPath = comment.path.replace(/\/replies$/, '');
      await onLike(commentSelfPath);
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!comment.path || !onDelete) return;

    if (confirm('Are you sure you want to delete this comment?')) {
      setIsDeleting(true);
      try {
        const commentSelfPath = comment.path.replace(/\/replies$/, '');
        await onDelete(commentSelfPath);
      } catch (error) {
        console.error('Error deleting comment:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const maxNesting = 10;
  const canReply = level < maxNesting;
  const isLiked =
    currentUserId && comment.likedBy && comment.likedBy[currentUserId];
  const isOwner = currentUserName && comment.author === currentUserName;
  const canDelete = isAdmin || isOwner;

  return (
    <div className={`${level > 0 ? 'md:ml-8' : ''}`}>
      <div className='relative'>
        {/* Reply Tree Line Indicator */}
        {level > 0 && (
          <>
            {/* Mobile: Line between cards */}
            <div className='md:hidden absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-neutral-200 dark:bg-neutral-700' />
            {/* Desktop: Traditional corner line */}
            <div className='hidden md:block absolute -left-4 -top-4 bottom-1/2 w-6 border-l-2 border-b-2 border-neutral-200 rounded-bl-xl dark:border-neutral-700' />
          </>
        )}

        <Card className='mb-4' isPreview>
          {/* Author and timestamp */}
          <div className='flex items-center justify-between border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-3'>
                <ImageWithFallback
                  src={comment.avatarUrl}
                  alt={comment.author}
                  width={24}
                  height={24}
                  type='square'
                />
                <span className='font-medium text-neutral-900 dark:text-white'>
                  {comment.author}
                </span>
              </div>
              <span className='text-xs text-neutral-500 dark:text-neutral-400'>
                {comment.createdAt
                  ? getTimeAgo(
                      new Date(comment.createdAt as number).toISOString(),
                    )
                  : 'Unknown'}
              </span>
            </div>

            {canDelete && (
              <Dropdown
                trigger={
                  <Button
                    type='ghost'
                    className='p-1 h-auto text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                  >
                    <Icon name='dotsThree' className='size-4.5' />
                  </Button>
                }
              >
                <>
                  <DropdownItem
                    onClick={() => {
                      setEditContent(comment.content);
                      setIsEditing(true);
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <Icon name='pencilSimpleLine' className='size-4' />
                      <span>Edit</span>
                    </div>
                  </DropdownItem>
                  {onDelete && (
                    <DropdownItem
                      onClick={isDeleting ? undefined : handleDelete}
                      className={`text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
                        isDeleting
                          ? 'opacity-50 cursor-not-allowed pointer-events-none'
                          : ''
                      }`}
                    >
                      <div className='flex items-center gap-2'>
                        <Icon name='trash' className='size-4' />
                        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                      </div>
                    </DropdownItem>
                  )}
                </>
              </Dropdown>
            )}
          </div>

          {/* Comment content */}
          <div className='p-4'>
            {isEditing ? (
              <div className='space-y-3'>
                <Editor
                  content={editContent}
                  onUpdate={handleEditChange}
                  textareaClassName='min-h-[100px] md:min-h-[150px]'
                />
                <div className='flex justify-end gap-2'>
                  <Button
                    type='default'
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                    className='h-8 text-xs'
                  >
                    Cancel
                  </Button>
                  <Button
                    type='primary'
                    onClick={handleEditSubmit}
                    disabled={isUpdating}
                    className='h-8 text-xs'
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className='prose dark:prose-invert max-w-none text-sm leading-relaxed px-0'
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(comment.content),
                }}
              />
            )}
          </div>

          {/* Action buttons */}
          <div className='flex gap-4 px-4.5 py-2 border-t border-neutral-200 dark:border-neutral-700'>
            <Button
              type='ghost'
              onClick={handleLike}
              disabled={isLiking || !currentUserId}
              className='p-1 h-auto text-xs'
            >
              <span className='flex items-center gap-2'>
                <Icon
                  name='heart'
                  className={`size-4.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                />
                <span
                  className={`text-neutral-600 dark:text-neutral-400 ${isLiked ? 'text-red-500' : ''}`}
                >
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
                  <Icon name='reply' className='size-4.5 rotate-180' />
                  <span className='text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'>
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
                <div className='flex items-center gap-3'>
                  <ImageWithFallback
                    src={currentUserAvatar || undefined}
                    alt={currentUserName || 'User'}
                    width={24}
                    height={24}
                    type='square'
                  />
                  <span className='font-medium text-neutral-900 dark:text-white'>
                    {currentUserName || 'Anonymous'}
                  </span>
                </div>
                <Editor
                  content={replyContent}
                  onUpdate={handleReplyChange}
                  textareaClassName='min-h-[100px] md:min-h-[100px]'
                />
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
      </div>

      {/* Nested replies */}
      {comment.replies && Object.values(comment.replies).length > 0 && (
        <div className='space-y-3 mt-3'>
          {Object.values(comment.replies)
            .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
            .map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onSubmitReply={onSubmitReply}
                onLike={onLike}
                onDelete={onDelete}
                level={level + 1}
                currentUserName={currentUserName}
                currentUserAvatar={currentUserAvatar}
                currentUserId={currentUserId}
                isAuthenticated={!!currentUserId}
                isAdmin={isAdmin}
              />
            ))}
        </div>
      )}
    </div>
  );
}
