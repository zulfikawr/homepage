import React, { useState, useEffect } from 'react';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';
import { Button, FormLabel, Input, Textarea } from '@/components/UI';
import { updateInterestsAndObjectives } from '@/database/interestsAndObjectives';
import { toast } from '@/components/Toast';
import Separator from '@/components/UI/Separator';

interface InterestsAndObjectivesFormProps {
  data?: InterestsAndObjectives;
}

const initialInterestsAndObjectivesState: InterestsAndObjectives = {
  description: '',
  objectives: [],
  conclusion: '',
};

const InterestsAndObjectivesForm: React.FC<InterestsAndObjectivesFormProps> = ({
  data,
}) => {
  const [interestsAndObjectives, setInterestsAndObjectives] = useState<
    InterestsAndObjectives & { id?: string }
  >(data || initialInterestsAndObjectivesState);

  const [newObjective, setNewObjective] = useState<string>('');

  useEffect(() => {
    if (data) {
      setInterestsAndObjectives(data);
    }
  }, [data]);

  const handleChange = (
    field: keyof InterestsAndObjectives,
    value: string | string[],
  ) => {
    setInterestsAndObjectives((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updateInterestsAndObjectives(interestsAndObjectives);

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

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      const updatedObjectives = [
        ...(interestsAndObjectives.objectives || []),
        newObjective.trim(),
      ];
      handleChange('objectives', updatedObjectives);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    const updatedObjectives = interestsAndObjectives.objectives.filter(
      (_, i) => i !== index,
    );
    handleChange('objectives', updatedObjectives);
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const updatedObjectives = [...interestsAndObjectives.objectives];
    updatedObjectives[index] = value;
    handleChange('objectives', updatedObjectives);
  };

  return (
    <>
      <div className='space-y-6'>
        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='description' required>
              Description
            </FormLabel>
            <Textarea
              value={interestsAndObjectives.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='objectives' required>
              Objectives
            </FormLabel>
            <div className='space-y-2'>
              {interestsAndObjectives.objectives.map((objective, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    type='text'
                    value={objective}
                    onChange={(e) =>
                      handleObjectiveChange(index, e.target.value)
                    }
                  />
                  <Button
                    type='destructive'
                    icon='trashSimple'
                    onClick={() => handleRemoveObjective(index)}
                  />
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <Input
                  type='text'
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder='Add an objective'
                />
                <Button
                  type='primary'
                  icon='plus'
                  onClick={handleAddObjective}
                />
              </div>
            </div>
          </div>
          <div>
            <FormLabel htmlFor='conclusion' required>
              Conclusion
            </FormLabel>
            <Textarea
              value={interestsAndObjectives.conclusion}
              onChange={(e) => handleChange('conclusion', e.target.value)}
              rows={3}
              required
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      <Button
        type='primary'
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
