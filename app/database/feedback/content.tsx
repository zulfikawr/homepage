'use client';

import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import {
  feedbackData,
  deleteFeedback,
  FeedbackEntry,
} from '@/database/feedback';
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
import { useRealtimeData } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';

const SkeletonLoader = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell
            isHeader
            className='bg-neutral-50 dark:bg-muted font-medium border-b border-neutral-300 dark:border-neutral-600'
          >
            Date
          </TableCell>
          <TableCell
            isHeader
            className='bg-neutral-50 dark:bg-muted font-medium border-b border-neutral-300 dark:border-neutral-600'
          >
            Feedback
          </TableCell>
          <TableCell
            isHeader
            className='bg-neutral-50 dark:bg-muted font-medium border-b border-neutral-300 dark:border-neutral-600'
          >
            Contact
          </TableCell>
          <TableCell
            isHeader
            className='bg-neutral-50 dark:bg-muted font-medium border-b border-neutral-300 dark:border-neutral-600'
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
                  <div className='h-6 w-24 rounded bg-muted dark:bg-muted' />
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
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const { data: feedbacks, loading } = useRealtimeData<FeedbackEntry[]>(
    feedbackData,
    [],
  );

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this feedback?',
    );
    if (!confirmDelete) return;

    const result = await deleteFeedback(id);
    if (result.success) {
      toast.success('Feedback deleted successfully');
    } else {
      toast.error('Failed to delete feedback: ' + result.error);
    }
  };

  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  if (!authLoading && user && !isAdmin) {
    router.push('/');
    return null;
  }

  return (
    <div>
      <PageTitle
        emoji='📬'
        title='Feedback Responses'
        subtitle='All feedback submitted by users.'
      />

      {loading ? (
        <SkeletonLoader />
      ) : feedbacks && feedbacks.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                isHeader
                className='bg-neutral-50 dark:bg-muted font-medium border-b border-neutral-300 dark:border-neutral-600'
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className='bg-neutral-50 dark:bg-muted font-medium border-b border-neutral-300 dark:border-neutral-600'
              >
                Feedback
              </TableCell>
              <TableCell
                isHeader
                className='bg-neutral-50 dark:bg-muted font-medium border-b border-neutral-300 dark:border-neutral-600'
              >
                Contact
              </TableCell>
              <TableCell
                isHeader
                className='bg-neutral-50 dark:bg-muted font-medium border-b border-neutral-300 dark:border-neutral-600'
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {new Date(entry.created).toLocaleDateString()}
                </TableCell>
                <TableCell>{entry.feedback}</TableCell>
                <TableCell>{entry.contact}</TableCell>
                <TableCell>
                  <Button
                    type='destructive'
                    icon='trashSimple'
                    onClick={() => handleDelete(entry.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className='mt-4'>
          <CardEmpty message='No feedback yet' />
        </div>
      )}
    </div>
  );
}
