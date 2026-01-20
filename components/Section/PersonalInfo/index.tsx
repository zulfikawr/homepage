import { personalInfoData } from '@/database/personalInfo.client';
import Loading from './loading';
import { Hover } from '@/components/Visual';
import { useRealtimeData } from '@/hooks';
import ImageWithFallback from '@/components/ImageWithFallback';
import { PersonalInfo } from '@/types/personalInfo';

interface PersonalInfoSectionProps {
  initialData?: PersonalInfo;
}

const PersonalInfoSection = ({ initialData }: PersonalInfoSectionProps) => {
  const {
    data: personalInfo,
    loading,
    error,
  } = useRealtimeData(personalInfoData, initialData);

  if (error) return <div>Failed to load personal info</div>;
  if (loading || !personalInfo) return <Loading />;

  return (
    <section className='flex items-center justify-between gap-x-10 gap-y-8'>
      <div className='flex flex-col gap-y-1'>
        <h1 className='text-4xl font-medium tracking-wide text-foreground'>
          <span className='mr-3 inline-block'>👋</span>
          {personalInfo.name}
        </h1>
        <div className='flex flex-col gap-y-1.5 break-words px-1 text-sm font-light leading-relaxed text-muted-foreground dark:text-neutral-300 lg:text-lg'>
          <p>{personalInfo.title}</p>
        </div>
      </div>
      <Hover
        perspective={1000}
        max={25}
        scale={1.01}
        className='block flex-shrink-0 pt-1'
      >
        <ImageWithFallback
          src={personalInfo.avatarUrl}
          height={105}
          width={105}
          alt={personalInfo.name}
          priority
          className='bg-muted shadow-sm dark:border dark:border-neutral-600 aspect-square object-cover'
          type='square'
        />
      </Hover>
    </section>
  );
};

export default PersonalInfoSection;
