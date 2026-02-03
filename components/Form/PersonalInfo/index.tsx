'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import ImageWithFallback from '@/components/ImageWithFallback';
import { toast } from '@/components/UI';
import { Button, FileUpload, FormLabel, Input } from '@/components/UI';
import { Separator } from '@/components/UI/Separator';
import { updatePersonalInfo } from '@/database/personal_info';
import { PersonalInfo } from '@/types/personal_info';

interface PersonalInfoFormProps {
  data?: PersonalInfo;
}

const initial_personal_info_state: PersonalInfo = {
  name: '',
  title: '',
  avatar: '',
  avatar_url: '',
};

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data }) => {
  const [personal_info, set_personal_info] = useState<PersonalInfo>(
    data || initial_personal_info_state,
  );
  const [avatar_file, set_avatar_file] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        set_personal_info(data);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const handle_change = (field: keyof PersonalInfo, value: string) => {
    set_personal_info((prev) => ({ ...prev, [field]: value }));
  };

  const handle_submit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    try {
      let result;

      if (avatar_file) {
        const form_data = new FormData();
        form_data.append('name', personal_info.name || '');
        form_data.append('title', personal_info.title || '');
        form_data.append('avatar', avatar_file);

        result = await updatePersonalInfo(form_data);
      } else {
        result = await updatePersonalInfo(personal_info);
      }

      if (result.success && result.data) {
        toast.success('Personal info successfully updated!');
        router.push('/database');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error updating personal info: ${error.message}`
          : 'An unknown error occurred while updating personal info.',
      );
    }
  };

  return (
    <>
      <div className='space-y-6'>
        <section className='flex items-center justify-between gap-x-10 gap-y-8'>
          <div className='flex flex-col gap-y-1'>
            <h1 className='text-4xl font-medium tracking-wide text-foreground'>
              <span className='mr-3 inline-block'>👋</span>
              {personal_info.name}
            </h1>
            <div className='flex flex-col gap-y-1.5 break-words px-1 text-sm font-light leading-relaxed text-muted-foreground dark:text-muted-foreground lg:text-lg'>
              <p>{personal_info.title}</p>
            </div>
          </div>
          <div className='block flex-shrink-0 pt-1'>
            <ImageWithFallback
              src={personal_info.avatar}
              height={105}
              width={105}
              alt={personal_info.name}
              priority
              className='aspect-square object-cover rounded-xl bg-muted shadow-sm dark:border '
              type='square'
              sizes='105px'
            />
          </div>
        </section>
        {/* Form */}
        <form onSubmit={handle_submit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='name' required>
              Name
            </FormLabel>
            <Input
              value={personal_info.name || ''}
              onChange={(e) => handle_change('name', e.target.value)}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='title' required>
              Title
            </FormLabel>
            <Input
              value={personal_info.title || ''}
              onChange={(e) => handle_change('title', e.target.value)}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='avatar_url' required>
              Avatar URL
            </FormLabel>
            <div className='flex gap-2'>
              <Input
                value={personal_info.avatar_url || ''}
                onChange={(e) => handle_change('avatar_url', e.target.value)}
                required
              />
              <FileUpload
                collectionName='profile'
                fieldName='avatar'
                existingValue={personal_info.avatar_url}
                onUploadSuccess={(url) => {
                  handle_change('avatar_url', url);
                  handle_change(
                    'avatar',
                    url.startsWith('/') ? url : `/api/storage/${url}`,
                  );
                }}
                onFileSelect={set_avatar_file}
              />
            </div>
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

export default PersonalInfoForm;
