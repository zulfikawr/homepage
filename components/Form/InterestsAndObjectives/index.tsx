import React, { useState, useEffect } from 'react';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';
import { useAuth } from '@/contexts/authContext';
import { drawer } from '@/components/Drawer';
import { Button, FormLabel, Input, Textarea } from '@/components/UI';
import { updateInterestsAndObjectives } from '@/functions/interestsAndObjectives';
import { toast } from '@/components/Toast';

const InterestsAndObjectivesForm = ({
  data,
  onUpdate,
}: {
  data?: InterestsAndObjectives;
  onUpdate?: (data: InterestsAndObjectives) => void;
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [description, setDescription] = useState(data?.description || '');
  const [objectives, setObjectives] = useState<string[]>(
    data?.objectives || [],
  );
  const [newObjective, setNewObjective] = useState('');
  const [conclusion, setConclusion] = useState(data?.conclusion || '');

  useEffect(() => {
    if (data) {
      setDescription(data.description);
      setObjectives(data.objectives);
      setConclusion(data.conclusion);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    setIsSubmitting(true);

    const interestsAndObjectivesData = {
      description,
      objectives,
      conclusion,
    };

    try {
      const result = await updateInterestsAndObjectives(
        interestsAndObjectivesData,
      );

      if (result.success && result.data) {
        if (onUpdate) {
          onUpdate(result.data);
        }
        drawer.close();
        toast.show('Interests and objectives succesfully updated!');
      }
    } catch (error) {
      console.error('Error saving interests and objectives:', error);
      toast.show('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    const updatedObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(updatedObjectives);
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-neutral-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit Interests & Objectives</h1>
          <Button icon='close' onClick={() => drawer.close()} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-6'>
          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <FormLabel htmlFor='description' required>
                Description
              </FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='objectives' required>
                Objectives
              </FormLabel>
              <div className='space-y-2'>
                {objectives.map((objective, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <Input
                      type='text'
                      value={objective}
                      onChange={(e) => {
                        const updatedObjectives = [...objectives];
                        updatedObjectives[index] = e.target.value;
                        setObjectives(updatedObjectives);
                      }}
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
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div className='flex justify-end space-x-4 pt-4'>
              <Button
                type='primary'
                icon='floppyDisk'
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <span className='hidden lg:block'>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InterestsAndObjectivesForm;
