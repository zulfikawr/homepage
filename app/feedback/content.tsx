'use client';

import { useEffect, useState } from 'react';
import { Button, FormLabel, Input, Textarea } from '@/components/UI';
import PageTitle from '@/components/PageTitle';
import { useTitle } from '@/contexts/titleContext';
import Separator from '@/components/UI/Separator';
import { database, ref, set } from '@/lib/firebase';
import { toast } from '@/components/Toast';

export default function FeedbackContent() {
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error('Please enter your feedback before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const timestamp = new Date();
      const timestampLocale = timestamp.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      
      const feedbackRef = ref(database, `feedback/${timestampLocale}`);
      
      const feedbackData = {
        feedback: feedback.trim(),
        contact: contact.trim() || 'Anonymous',
        timestamp: timestamp.toISOString(),
      };

      await set(feedbackRef, feedbackData);
      
      setFeedback('');
      setContact('');
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle('Feedback');
  }, [setHeaderTitle]);

  return (
    <div>
      <PageTitle
        emoji='📑'
        title='Feedback'
        subtitle="I appreciate thoughtful feedback and believe that we don't get enough of them these days."
      />

      <div className='w-full rounded-md p-6 border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <p className='text-sm text-gray-700 dark:text-gray-400'>
          Please use this form to share whatever you&apos;d like with me. This
          form is anonymous (really). If you&apos;d like me to respond, please
          feel free to leave your contact.
        </p>

        <Separator />

        <div className='mt-6 space-y-4'>
          <div>
            <FormLabel htmlFor='feedback' required>
              Comments/Feedback
            </FormLabel>
            <Textarea
              id='feedback'
              rows={5}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              placeholder="What's on your mind?"
            />
          </div>

          <div>
            <FormLabel htmlFor='contact'>
              Your contact (optional)
            </FormLabel>
            <Input
              id='contact'
              type='text'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email or other contact information"
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
      </div>
    </div>
  );
}