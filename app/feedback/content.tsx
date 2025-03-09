'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/UI';
import PageTitle from '@/components/PageTitle';
import { useTitle } from '@/contexts/titleContext';
import Separator from '@/components/UI/Separator';

export default function FeedbackContent() {
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback:', feedback);
    console.log('Contact:', contact);

    setFeedback('');
    setContact('');
  };

  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle('Feedback');
  });

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

        <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
          <div>
            <label
              htmlFor='feedback'
              className='text-md font-medium dark:text-white'
            >
              Comments / Feedback <span className='text-red-500'>*</span>
            </label>
            <textarea
              id='feedback'
              name='feedback'
              rows={5}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              className='mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none'
            />
          </div>

          <div>
            <label
              htmlFor='contact'
              className='text-md font-medium dark:text-white'
            >
              Your Contact (optional)
            </label>
            <input
              type='text'
              id='contact'
              name='contact'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className='mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <div className='flex justify-end'>
            <Button type='primary'>Submit Feedback</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
