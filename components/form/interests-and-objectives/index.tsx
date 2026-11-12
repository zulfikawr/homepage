'use client';

import React, { useEffect, useState } from 'react';

import { Editor } from '@/components/editor';
import { toast } from '@/components/ui';
import { Button, FormLabel } from '@/components/ui';
import { Separator } from '@/components/ui/separator';
import { InterestsAndObjectives } from '@/types/interests-and-objectives';

interface InterestsAndObjectivesFormProps {
  data?: InterestsAndObjectives & { id?: string };
}

const InterestsAndObjectivesForm: React.FC<InterestsAndObjectivesFormProps> = ({
  data,
}) => {
  const [content, setContent] = useState(data?.content || '');

  useEffect(() => {
    setContent(data?.content || '');
  }, [data]);

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    try {
      const response = await fetch('/api/collection/interestsAndObjectives', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data?.id, content }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (result.success) {
        toast.success('Interests and objectives successfully updated!');
      } else {
        toast.error(
          result.error || 'Failed to update interests and objectives.',
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error updating interests and objectives: ${error.message}`
          : 'An unknown error occurred while updating interests and objectives.',
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <FormLabel htmlFor='content' required>
            Content
          </FormLabel>
          <Editor content={content} onUpdate={setContent} />
        </div>
      </form>

      <Separator margin='5' />

      <Button
        variant='primary'
        icon='floppyDisk'
        onClick={handleSubmit}
        className='w-full'
      >
        Save
      </Button>
    </>
  );
};

export default InterestsAndObjectivesForm;
