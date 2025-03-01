import { useState } from 'react';
import Head from 'next/head';
import { Icon, Button } from '~/components/UI';
import { pageLayout } from '~/components/Page';
import { NextPageWithLayout } from '../_app';
import Link from 'next/link';

const Feedback: NextPageWithLayout = () => {
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback:', feedback);
    console.log('Contact:', contact);

    setFeedback('');
    setContact('');
  };

  return (
    <>
      <Head>
        <title>Feedback - Zulfikar</title>
      </Head>
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex-1 items-center'>
            <h1 className='text-1 font-medium tracking-wide text-black dark:text-white'>
              <span className='mr-3 inline-block'>📑</span>
              Feedback
            </h1>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 px-5'>
              <p className='text-xl text-gray-500 dark:text-gray-400'>
                <Link href='/' className='flex items-center'>
                  <span className='mr-2 h-6 w-6'>
                    <Icon name='left' />
                  </span>
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className='w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
          <div className='px-6 py-6'>
            <div className='space-y-6 pb-6 border-b dark:border-gray-700'>
              <div>
                <h2 className='text-xl font-semibold dark:text-white'>Why?</h2>
                <p className='text-md text-gray-700 dark:text-gray-400'>
                  I appreciate thoughtful feedback and believe that we
                  don&apos;t get enough of them these days.
                </p>
              </div>

              <div>
                <h2 className='text-xl font-semibold dark:text-white'>How?</h2>
                <p className='text-md text-gray-700 dark:text-gray-400'>
                  Please use this form to share whatever you&apos;d like with
                  me. This form is anonymous (really). If you&apos;d like me to
                  respond, please feel free to leave your contact.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
              <div>
                <label
                  htmlFor='feedback'
                  className='block text-sm font-medium dark:text-white'
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
                  className='block text-sm font-medium dark:text-white'
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
                <Button
                  type='default'
                  className='rounded-md bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

Feedback.layout = pageLayout;

export default Feedback;
