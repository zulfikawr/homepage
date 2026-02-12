'use client';

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Editor } from '@/components/editor';
import { ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Card } from '@/components/ui';
import { toast } from '@/components/ui';
import { Button, FormLabel, Input } from '@/components/ui';
import { Separator } from '@/components/ui/separator';
import { createFeedback } from '@/database/feedback';
import { escapeHtml } from '@/utilities/escape-html';

const MAX_CHARS = 5000;

export default function FeedbackContent() {
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackChange = (content: string) => {
    if (content.length <= MAX_CHARS) {
      setFeedback(content);
    }
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error('Please enter your feedback before submitting');
      return;
    }

    if (feedback.length > MAX_CHARS) {
      toast.error(`Feedback must be under ${MAX_CHARS} characters`);
      return;
    }

    setIsSubmitting(true);

    try {
      const safeFeedback = escapeHtml(feedback.trim());
      const safeContact = escapeHtml(contact.trim());

      const result = await createFeedback({
        feedback: safeFeedback,
        contact: safeContact || 'Anonymous',
      });

      if (result.success) {
        setFeedback('');
        setContact('');
        toast.success('Thank you for your feedback!');
      } else {
        toast.error(result.error || 'Failed to submit feedback.');
      }
    } catch {
      // Ignored
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageTitle
        emoji='📑'
        title='Feedback'
        subtitle="I appreciate thoughtful feedback and believe that we don't get enough of them these days."
      />

      <ViewTransition>
        <Card isPreview className='p-6' overflowVisible>
          <p className='text-sm text-foreground dark:text-muted-foreground'>
            Please use this form to share whatever you&apos;d like with me. This
            form is anonymous (really). If you&apos;d like me to respond, please
            feel free to leave your contact.
          </p>

          <Separator />

          <div className='space-y-4'>
            <div>
              <div className='flex justify-between items-center'>
                <FormLabel htmlFor='feedback' required>
                  Comments/Feedback
                </FormLabel>
                <span
                  className={twMerge(
                    'text-xs',
                    feedback.length === MAX_CHARS
                      ? 'text-destructive font-bold'
                      : 'text-muted-foreground',
                  )}
                >
                  {feedback.length}/{MAX_CHARS}
                </span>
              </div>

              <Editor
                content={feedback}
                onUpdate={handleFeedbackChange}
                className='min-h-[200px]'
              />
            </div>

            <div>
              <FormLabel htmlFor='contact'>Your contact (optional)</FormLabel>
              <Input
                id='contact'
                type='text'
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder='Email or other contact information'
                maxLength={100}
              />
            </div>

            <div className='flex justify-end pt-4'>
              <Button
                variant='primary'
                disabled={isSubmitting || !feedback.trim()}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </Card>
      </ViewTransition>
    </div>
  );
}
