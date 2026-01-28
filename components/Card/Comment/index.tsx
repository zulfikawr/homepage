'use client';

import { useState } from 'react';

import { Card } from '@/components/Card';
import { Editor } from '@/components/Editor';
import ImageWithFallback from '@/components/ImageWithFallback';
import { toast } from '@/components/Toast';
import { Button, Icon, Skeleton } from '@/components/UI';
import { Dropdown, DropdownItem } from '@/components/UI/Dropdown';
import { Comment } from '@/types/comment';
import { escapeHtml } from '@/utilities/escapeHtml';
import { renderMarkdown } from '@/utilities/renderMarkdown';
import { getTimeAgo } from '@/utilities/timeAgo';

const MAX_CHARS = 5000;

interface CommentCardProps {
  comment?: Comment;
  onReply?: (author: string, content: string) => Promise<void>;
  onLike?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  onEdit?: (newContent: string) => Promise<void>;
  level?: number;
  currentUserName?: string;
  currentUserId?: string;
  isAdmin?: boolean;
  replies?: Comment[];
  isLoading?: boolean;
}

export default function CommentCard({
  comment,
  onReply,
  onLike,
  onDelete,
  onEdit,
  level = 0,
  currentUserName,
  currentUserId,
  isAdmin,
  replies = [],
  isLoading = false,
}: CommentCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState(
    currentUserName || 'Anonymous',
  );
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment?.content || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReplyChange = (val: string) => {
    if (val.length <= MAX_CHARS) setReplyContent(val);
  };

  const handleEditChange = (val: string) => {
    if (val.length <= MAX_CHARS) setEditContent(val);
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !onReply) return;

    if (replyContent.length > MAX_CHARS) {
      toast.error(`Reply cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    setIsSubmitLoading(true);
    try {
      const safeContent = escapeHtml(replyContent.trim());
      const safeAuthor = escapeHtml(replyAuthor.trim());

      await onReply(safeAuthor, safeContent);
      setReplyContent('');
      setReplyAuthor(currentUserName || 'Anonymous');
      setIsReplying(false);
    } catch {
      toast.error('Failed to post reply.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim() || !onEdit) return;

    if (editContent.length > MAX_CHARS) {
      toast.error(`Comment cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    setIsUpdating(true);
    try {
      const safeContent = escapeHtml(editContent.trim());
      await onEdit(safeContent);
      setIsEditing(false);
    } catch {
      toast.error('Failed to update comment.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLike = async () => {
    if (!onLike) return;
    setIsLiking(true);
    try {
      await onLike();
    } catch {
      // Ignore like error
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      className={`space-y-4 ${level > 0 ? 'ml-6 sm:ml-12 border-l-2 border pl-4 sm:pl-6' : ''}`}
    >
      <Card className='p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-x-3'>
            {isLoading ? (
              <Skeleton width={32} height={32} variant='circle' />
            ) : (
              <ImageWithFallback
                src={comment?.avatarUrl || ''}
                alt={comment?.author || ''}
                width={32}
                height={32}
                className='rounded-full'
                sizes='32px'
              />
            )}
            <div className='flex flex-col gap-y-1'>
              <div className='flex items-center gap-x-2 h-5'>
                {isLoading ? (
                  <Skeleton width={100} height={14} />
                ) : (
                  <>
                    <span className='font-medium dark:text-foreground'>
                      {comment?.author}
                    </span>
                    {comment?.parentId && (
                      <span className='text-xs text-muted-foreground'>
                        replying
                      </span>
                    )}
                  </>
                )}
              </div>
              <span className='text-xs text-muted-foreground h-4'>
                {isLoading ? (
                  <Skeleton width={60} height={10} />
                ) : (
                  comment?.createdAt && getTimeAgo(comment.createdAt)
                )}
              </span>
            </div>
          </div>

          {!isLoading &&
            onDelete &&
            (currentUserId === comment?.author || isAdmin) && (
              <div className='flex items-center gap-x-1'>
                <Dropdown
                  trigger={
                    <Button type='outline' className='p-1 h-8 w-8'>
                      <Icon name='dotsThree' className='size-4' />
                    </Button>
                  }
                >
                  <DropdownItem
                    onClick={() => setIsEditing(true)}
                    icon='pencilSimpleLine'
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    onClick={onDelete}
                    icon='trashSimple'
                    className='text-destructive'
                  >
                    Delete
                  </DropdownItem>
                </Dropdown>
              </div>
            )}
        </div>

        <div className='mt-4'>
          {isEditing ? (
            <div className='space-y-4'>
              <Editor content={editContent} onUpdate={handleEditChange} />
              <div className='flex justify-end gap-x-2'>
                <Button onClick={() => setIsEditing(false)} type='outline'>
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSubmit}
                  disabled={isUpdating || !editContent.trim()}
                  type='primary'
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          ) : (
            <div className='prose prose-sm dark:prose-invert max-w-none'>
              {isLoading ? (
                <div className='space-y-2'>
                  <Skeleton width='100%' height={14} />
                  <Skeleton width='90%' height={14} />
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(comment?.content || ''),
                  }}
                />
              )}
            </div>
          )}
        </div>

        <div className='mt-4 flex items-center gap-x-4 h-5'>
          {isLoading ? (
            <>
              <Skeleton width={40} height={14} />
              <Skeleton width={40} height={14} />
            </>
          ) : (
            <>
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-x-1 text-sm font-medium transition-colors ${
                  isLiking
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <Icon
                  name={comment?.likes && comment.likes > 0 ? 'heart' : 'heart'}
                  className='size-4'
                />
                <span>{comment?.likes || 0}</span>
              </button>

              <button
                onClick={() => setIsReplying(!isReplying)}
                className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
              >
                Reply
              </button>
            </>
          )}
        </div>

        {isReplying && (
          <div className='mt-4 space-y-4 rounded-md bg-muted/50 p-4 dark:bg-background'>
            <Editor content={replyContent} onUpdate={handleReplyChange} />
            <div className='flex justify-end gap-x-2'>
              <Button onClick={() => setIsReplying(false)} type='outline'>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReply}
                disabled={isSubmitLoading || !replyContent.trim()}
                type='primary'
              >
                {isSubmitLoading ? 'Posting...' : 'Post Reply'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {!isLoading && replies.length > 0 && (
        <div className='space-y-4'>
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={onReply!}
              onLike={onLike!}
              onDelete={onDelete}
              onEdit={onEdit}
              level={level + 1}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
