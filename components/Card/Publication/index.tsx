import { Publication } from '@/types/publication';
import { Card } from '@/components/Card';
import { Badge, Icon } from '@/components/UI';
import openLink from '@/utilities/externalLink';
import { useRouter } from 'next/navigation';

interface PublicationCardProps {
  publication: Publication;
  openForm?: boolean;
  isInForm?: boolean;
  isActive?: boolean;
}

export default function PublicationCard({
  publication,
  openForm,
  isInForm,
  isActive,
}: PublicationCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (isInForm) return;

    if (openForm) {
      router.push(`/database/publications/${publication.id}/edit`);
    } else {
      openLink(publication.link);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      openForm={openForm}
      isInForm={isInForm}
      isActive={isActive}
    >
      <div className='p-4 space-y-2'>
        <p className='text-lg line-clamp-2 text-ellipsis font-medium leading-tight dark:text-white'>
          {publication.title}
        </p>
        <p className='text-sm font-light text-muted-foreground'>
          {publication.authors.join(', ')}
        </p>
        <div className='flex flex-wrap gap-2 pt-2'>
          {publication.keywords.map((keyword, index) => (
            <Badge key={index}>{keyword}</Badge>
          ))}
        </div>
      </div>

      <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4 py-2 text-xs font-light text-muted-foreground dark:border-border dark:text-neutral-400'>
        <span>{publication.publisher}</span>
        <span>
          {publication.openAccess ? (
            <span className='flex items-center gap-2'>
              <Icon name='lockOpen' className='size-4.5' />
              Open Access
            </span>
          ) : (
            <span className='flex items-center gap-2'>
              <Icon name='lock' className='size-4.5' />
              Restricted Access
            </span>
          )}
        </span>
      </div>
    </Card>
  );
}

export { PublicationCard };
