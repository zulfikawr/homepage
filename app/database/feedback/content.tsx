'use client';

import { useRouter } from 'next/navigation';

import { ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { toast } from '@/components/ui';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableSkeleton,
} from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import { useAuth } from '@/contexts/auth-context';
import { useCollection } from '@/hooks';
import { mapRecordToFeedback } from '@/lib/mappers';
import { FeedbackEntry } from '@/types/feedback';

export default function FeedbackResponsesContent() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const { data: feedbacks, loading } = useCollection<FeedbackEntry>(
    'feedback',
    mapRecordToFeedback,
  );

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this feedback?',
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/collection/feedback?id=${id}`, {
        method: 'DELETE',
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };
      if (result.success) {
        toast.success('Feedback deleted successfully');
        router.refresh();
      } else {
        toast.error('Failed to delete feedback: ' + result.error);
      }
    } catch (error) {
      console.error('Delete feedback error:', error);
      toast.error('Failed to delete feedback');
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
      </ViewTransition>
    </div>
  );
}
