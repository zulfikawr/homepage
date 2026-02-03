'use client';

import { useRouter } from 'next/navigation';

import { ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { toast } from '@/components/UI';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableSkeleton,
} from '@/components/UI';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { useAuth } from '@/contexts/authContext';
import { deleteFeedback } from '@/database/feedback';
import { useCollection } from '@/hooks';
import { mapRecordToFeedback } from '@/lib/mappers';
import { FeedbackEntry } from '@/types/feedback';

export default function FeedbackResponsesContent() {
  const { user, loading: auth_loading, isAdmin } = useAuth();
  const router = useRouter();
  const { data: feedbacks, loading } = useCollection<FeedbackEntry>(
    'feedback',
    mapRecordToFeedback,
  );

  const handle_delete = async (id: string) => {
    const confirm_delete = confirm(
      'Are you sure you want to delete this feedback?',
    );
    if (!confirm_delete) return;

    const result = await deleteFeedback(id);
    if (result.success) {
      toast.success('Feedback deleted successfully');
    } else {
      toast.error('Failed to delete feedback: ' + result.error);
    }
  };

  if (!auth_loading && !user) {
    router.push('/login');
    return null;
  }

  if (!auth_loading && user && !isAdmin) {
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

      <ViewTransition>
        {loading ? (
          <TableSkeleton rows={8} cols={4} />
        ) : feedbacks && feedbacks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className='bg-muted dark:bg-muted font-medium border-b border'
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className='bg-muted dark:bg-muted font-medium border-b border'
                >
                  Feedback
                </TableCell>
                <TableCell
                  isHeader
                  className='bg-muted dark:bg-muted font-medium border-b border'
                >
                  Contact
                </TableCell>
                <TableCell
                  isHeader
                  className='bg-muted dark:bg-muted font-medium border-b border'
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
                      variant='destructive'
                      icon='trashSimple'
                      onClick={() => handle_delete(entry.id)}
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
      </ViewTransition>
    </div>
  );
}
