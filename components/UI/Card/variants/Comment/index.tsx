'use client';

import { useState } from 'react';

import { Editor } from '@/components/Editor';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Dropdown, DropdownItem } from '@/components/UI/Dropdown';
import { MarkdownRenderer } from '@/components/UI/MarkdownRenderer';
import { Comment } from '@/types/comment';
import { escapeHtml } from '@/utilities/escapeHtml';
import { getTimeAgo } from '@/utilities/timeAgo';

import { toast } from '../../..';
import { Button, Icon, Skeleton } from '../../..';
import { Card } from '../..';

const MAX_CHARS = 5000;

interface CommentCardProps {
  comment?: Comment;
  onReply?: (author: string, content: string) => Promise<void>;
  onLike?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  onEdit?: (newContent: string) => Promise<void>;
  level?: number;
  current_user_name?: string;
  current_user_id?: string;
  is_admin?: boolean;
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
  current_user_name,
  current_user_id,
  is_admin,
  replies = [],
  isLoading = false,
}: CommentCardProps) {
  const [is_replying, set_is_replying] = useState(false);
  const [reply_content, set_reply_content] = useState('');
  const [reply_author, set_reply_author] = useState(
    current_user_name || 'Anonymous',
  );
  const [is_submit_loading, set_is_submit_loading] = useState(false);
  const [is_liking, set_is_liking] = useState(false);
  const [is_editing, set_is_editing] = useState(false);
  const [edit_content, set_edit_content] = useState(comment?.content || '');
  const [is_updating, set_is_updating] = useState(false);

  const handle_reply_change = (val: string) => {
    if (val.length <= MAX_CHARS) set_reply_content(val);
  };

  const handle_edit_change = (val: string) => {
    if (val.length <= MAX_CHARS) set_edit_content(val);
  };

  const handle_submit_reply = async () => {
    if (!reply_content.trim() || !onReply) return;

    if (reply_content.length > MAX_CHARS) {
      toast.error(`Reply cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    set_is_submit_loading(true);
    try {
      const safe_content = escapeHtml(reply_content.trim());
      const safe_author = escapeHtml(reply_author.trim());

      await onReply(safe_author, safe_content);
      set_reply_content('');
      set_reply_author(current_user_name || 'Anonymous');
      set_is_replying(false);
    } catch {
      toast.error('Failed to post reply.');
    } finally {
      set_is_submit_loading(false);
    }
  };

  const handle_edit_submit = async () => {
    if (!edit_content.trim() || !onEdit) return;

    if (edit_content.length > MAX_CHARS) {
      toast.error(`Comment cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    set_is_updating(true);
    try {
      const safe_content = escapeHtml(edit_content.trim());
      await onEdit(safe_content);
      set_is_editing(false);
    } catch {
      toast.error('Failed to update comment.');
    } finally {
      set_is_updating(false);
    }
  };

  const handle_like = async () => {
    if (!onLike) return;
    set_is_liking(true);
    try {
      await onLike();
    } catch {
      // Ignore like error
    } finally {
      set_is_liking(false);
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
                src={comment?.avatar_url || ''}
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
                    {comment?.parent_id && (
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
                  comment?.created_at && getTimeAgo(comment.created_at)
                )}
              </span>
            </div>
          </div>

          {!isLoading &&
            onDelete &&
            (current_user_id === comment?.author || is_admin) && (
              <div className='flex items-center gap-x-1'>
                <Dropdown
                  trigger={
                    <Button variant='outline' className='p-1 h-8 w-8'>
                      <Icon name='dotsThree' className='size-4' />
                    </Button>
                  }
                >
                  <DropdownItem
                    onClick={() => set_is_editing(true)}
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
          {is_editing ? (
            <div className='space-y-4'>
              <Editor content={edit_content} onUpdate={handle_edit_change} />
              <div className='flex justify-end gap-x-2'>
                <Button onClick={() => set_is_editing(false)} variant='outline'>
                  Cancel
                </Button>
                <Button
                  onClick={handle_edit_submit}
                  disabled={is_updating || !edit_content.trim()}
                  variant='primary'
                >
                  {is_updating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          ) : (
            <div className='max-w-none'>
              {isLoading ? (
                <div className='space-y-2'>
                  <Skeleton width='100%' height={14} />
                  <Skeleton width='90%' height={14} />
                </div>
              ) : (
                <MarkdownRenderer
                  content={comment?.content || ''}
                  className='prose prose-sm dark:prose-invert'
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
                onClick={handle_like}
                disabled={is_liking}
                className={`flex items-center gap-x-1 text-sm font-medium transition-colors ${
                  is_liking
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
                onClick={() => set_is_replying(!is_replying)}
                className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
              >
                Reply
              </button>
            </>
          )}
        </div>

        {is_replying && (
          <div className='mt-4 space-y-4 rounded-md bg-muted/50 p-4 dark:bg-background'>
            <Editor content={reply_content} onUpdate={handle_reply_change} />
            <div className='flex justify-end gap-x-2'>
              <Button onClick={() => set_is_replying(false)} variant='outline'>
                Cancel
              </Button>
              <Button
                onClick={handle_submit_reply}
                disabled={is_submit_loading || !reply_content.trim()}
                variant='primary'
              >
                {is_submit_loading ? 'Posting...' : 'Post Reply'}
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
              current_user_id={current_user_id}
              is_admin={is_admin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
