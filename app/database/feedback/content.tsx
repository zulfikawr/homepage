'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import { database, ref, onValue, remove } from '@/lib/firebase';
import PageTitle from '@/components/PageTitle';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@/components/UI';
import { toast } from '@/components/Toast';

interface FeedbackEntry {
  feedback: string;
  contact: string;
  timestamp: string;
}

const SkeletonLoader = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell
            isHeader
            className='bg-neutral-50 dark:bg-neutral-700 font-medium border-b border-neutral-300 dark:border-neutral-600'
          >
            Date
          </TableCell>
          <TableCell
            isHeader
            className='bg-neutral-50 dark:bg-neutral-700 font-medium border-b border-neutral-300 dark:border-neutral-600'
          >
            Feedback
          </TableCell>
          <TableCell
            isHeader
            className='bg-neutral-50 dark:bg-neutral-700 font-medium border-b border-neutral-300 dark:border-neutral-600'
          >
            Contact
          </TableCell>
          <TableCell
            isHeader
            className='bg-neutral-50 dark:bg-neutral-700 font-medium border-b border-neutral-300 dark:border-neutral-600'
          >
            Actions
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            {[...Array(4)].map((_, i) => (
              <TableCell key={i}>
                <div className='animate-pulse'>
                  <div className='h-6 w-24 rounded bg-neutral-200 dark:bg-neutral-700' />
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function FeedbackResponsesContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Record<string, FeedbackEntry>>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const feedbackRef = ref(database, 'feedback');
    const unsubscribe = onValue(feedbackRef, (snapshot) => {
      const data = snapshot.val();
      setFeedbacks(data || {});
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (date: string) => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this feedback?',
    );
    if (!confirmDelete) return;

    try {
      await remove(ref(database, `feedback/${date}`));
      toast.success('Feedback deleted successfully');
    } catch (error) {
      toast.error(
        'Failed to delete feedback: ' + (error as Error).message ||
          'Unknown error',
      );
    }
  };

  return (
    <div>
      <PageTitle
        emoji='📬'
        title='Feedback Responses'
        subtitle='All feedback submitted by users.'
        route='/feedback/responses'
      />

      {loading ? (
        <SkeletonLoader />
      ) : Object.keys(feedbacks).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                isHeader
                className='bg-neutral-50 dark:bg-neutral-700 font-medium border-b border-neutral-300 dark:border-neutral-600'
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className='bg-neutral-50 dark:bg-neutral-700 font-medium border-b border-neutral-300 dark:border-neutral-600'
              >
                Feedback
              </TableCell>
              <TableCell
                isHeader
                className='bg-neutral-50 dark:bg-neutral-700 font-medium border-b border-neutral-300 dark:border-neutral-600'
              >
                Contact
              </TableCell>
              <TableCell
                isHeader
                className='bg-neutral-50 dark:bg-neutral-700 font-medium border-b border-neutral-300 dark:border-neutral-600'
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(feedbacks).map(([date, entry]) => (
              <TableRow key={entry.timestamp}>
                <TableCell>{date}</TableCell>
                <TableCell>{entry.feedback}</TableCell>
                <TableCell>{entry.contact}</TableCell>
                <TableCell>
                  <Button
                    type='destructive'
                    icon='trashSimple'
                    onClick={() => handleDelete(date)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className='mt-4 text-sm text-neutral-500 dark:text-neutral-400'>
          No feedback yet.
        </p>
      )}
    </div>
  );
}
