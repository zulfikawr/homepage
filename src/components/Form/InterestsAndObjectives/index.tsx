import React, { useState, useEffect } from 'react';
import { InterestsAndObjectives } from '~/types/interestsAndObjectives';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import { Button } from '~/components/UI';
import { updateInterestsAndObjectives } from '~/functions/interestsAndObjectives';
import { toast } from '~/components/Toast';

const InterestsAndObjectivesForm = ({
  initialData,
  onUpdate,
}: {
  initialData?: InterestsAndObjectives;
  onUpdate?: (data: InterestsAndObjectives) => void;
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [objectives, setObjectives] = useState<string[]>(
    initialData?.objectives || [],
  );
  const [newObjective, setNewObjective] = useState('');
  const [conclusion, setConclusion] = useState(initialData?.conclusion || '');

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setObjectives(initialData.objectives);
      setConclusion(initialData.conclusion);
    }
  }, [initialData]);

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
      } else {
        setError(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving interests and objectives:', error);
      setError('An unexpected error occurred');
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
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit Interests & Objectives</h1>
          <Button type='default' onClick={() => drawer.close()}>
            Close
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
              <div className='p-3 text-sm bg-red-50 text-red-600 rounded-md'>
                {error}
              </div>
            )}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                rows={3}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Objectives
              </label>
              <div className='space-y-2'>
                {objectives.map((objective, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <input
                      type='text'
                      value={objective}
                      onChange={(e) => {
                        const updatedObjectives = [...objectives];
                        updatedObjectives[index] = e.target.value;
                        setObjectives(updatedObjectives);
                      }}
                      className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    />
                    <Button
                      type='destructive'
                      onClick={() => handleRemoveObjective(index)}
                      className='px-3 py-1.5'
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className='flex items-center gap-2'>
                  <input
                    type='text'
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    placeholder='Add an objective'
                  />
                  <Button
                    type='primary'
                    onClick={handleAddObjective}
                    className='px-3 py-1.5'
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Conclusion
              </label>
              <textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div className='flex justify-end space-x-4'>
              <Button
                type='primary'
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InterestsAndObjectivesForm;
