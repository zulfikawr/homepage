import React, { useEffect, useState } from 'react';

import { toast } from '@/components/UI';
import { Button, FormLabel, Input, Textarea } from '@/components/UI';
import { Separator } from '@/components/UI/Separator';
import { updateInterestsAndObjectives } from '@/database/interests_and_objectives';
import { InterestsAndObjectives } from '@/types/interests_and_objectives';

interface InterestsAndObjectivesFormProps {
  data?: InterestsAndObjectives;
}

const initial_interests_and_objectives_state: InterestsAndObjectives = {
  description: '',
  objectives: [],
  conclusion: '',
};

const InterestsAndObjectivesForm: React.FC<InterestsAndObjectivesFormProps> = ({
  data,
}) => {
  const [interests_and_objectives, set_interests_and_objectives] = useState<
    InterestsAndObjectives & { id?: string }
  >(data || initial_interests_and_objectives_state);

  const [new_objective, set_new_objective] = useState<string>('');

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        set_interests_and_objectives(data);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const handle_change = (
    field: keyof InterestsAndObjectives,
    value: string | string[],
  ) => {
    set_interests_and_objectives((prev) => ({ ...prev, [field]: value }));
  };

  const handle_submit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    try {
      const result = await updateInterestsAndObjectives(
        interests_and_objectives,
      );

      if (result.success && result.data) {
        toast.success('Interests and objectives successfully updated!');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error updating interests and objectives: ${error.message}`
          : 'An unknown error occurred while updating interests and objectives.',
      );
    }
  };

  const handle_add_objective = () => {
    if (new_objective.trim()) {
      const updated_objectives = [
        ...(interests_and_objectives.objectives || []),
        new_objective.trim(),
      ];
      handle_change('objectives', updated_objectives);
      set_new_objective('');
    }
  };

  const handle_remove_objective = (index: number) => {
    const updated_objectives = interests_and_objectives.objectives.filter(
      (_, i) => i !== index,
    );
    handle_change('objectives', updated_objectives);
  };

  const handle_objective_change = (index: number, value: string) => {
    const updated_objectives = [...interests_and_objectives.objectives];
    updated_objectives[index] = value;
    handle_change('objectives', updated_objectives);
  };

  return (
    <>
      <div className='space-y-6'>
        {/* Form */}
        <form onSubmit={handle_submit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='description' required>
              Description
            </FormLabel>
            <Textarea
              value={interests_and_objectives.description || ''}
              onChange={(e) => handle_change('description', e.target.value)}
              rows={4}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='objectives' required>
              Objectives
            </FormLabel>
            <div className='space-y-2'>
              {interests_and_objectives.objectives.map((objective, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    type='text'
                    value={objective || ''}
                    onChange={(e) =>
                      handle_objective_change(index, e.target.value)
                    }
                  />
                  <Button
                    variant='destructive'
                    icon='trashSimple'
                    className='h-9'
                    onClick={() => handle_remove_objective(index)}
                  />
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <Input
                  type='text'
                  value={new_objective || ''}
                  onChange={(e) => set_new_objective(e.target.value)}
                  placeholder='Add an objective'
                />
                <Button
                  variant='primary'
                  icon='plus'
                  className='h-9'
                  onClick={handle_add_objective}
                />
              </div>
            </div>
          </div>
          <div>
            <FormLabel htmlFor='conclusion' required>
              Conclusion
            </FormLabel>
            <Textarea
              value={interests_and_objectives.conclusion || ''}
              onChange={(e) => handle_change('conclusion', e.target.value)}
              rows={3}
              required
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      <Button
        variant='primary'
        icon='floppyDisk'
        onClick={handle_submit}
        className='w-full'
      >
        Save
      </Button>
    </>
  );
};

export default InterestsAndObjectivesForm;
