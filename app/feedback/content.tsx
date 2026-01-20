'use client';

import { useState } from 'react';
import { Button, FormLabel, Input, Textarea } from '@/components/UI';
import PageTitle from '@/components/PageTitle';
import { Separator } from '@/components/UI/Separator';
import pb from '@/lib/pocketbase';
import { toast } from '@/components/Toast';
import { Card } from '@/components/Card';
import { escapeHtml } from '@/utilities/escapeHtml';
import { useSyncExternalStore } from 'react';

const MAX_CHARS = 5000;

const emptySubscribe = () => () => {};

export default function FeedbackContent() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setFeedback(text);
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

      const feedbackData = {
        feedback: safeFeedback,
        contact: safeContact || 'Anonymous',
        timestamp: isMounted
          ? new Date().toISOString()
          : '2025-01-01T00:00:00Z',
      };

      await pb.collection('feedback').create(feedbackData);

      setContact('');
      toast.success('Thank you for your feedback!');
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

      <Card isPreview className='p-6'>
        <p className='text-sm text-neutral-700 dark:text-neutral-400'>
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
                className={`text-xs ${feedback.length === MAX_CHARS ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}
              >
                {feedback.length}/{MAX_CHARS}
              </span>
            </div>

            <Textarea
              id='feedback'
              rows={5}
              value={feedback}
              onChange={handleFeedbackChange}
              required
              placeholder="What's on your mind?"
              maxLength={MAX_CHARS}
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
              type='primary'
              disabled={isSubmitting || !feedback.trim()}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
