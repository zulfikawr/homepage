'use client';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import CardEmpty from '@/components/ui/card/variants/empty';
import { CardLoading } from '@/components/ui/card/variants/loading';
import PublicationCard from '@/components/ui/card/variants/publication';
import { Publication } from '@/types/publication';

export function PublicationsSkeleton() {
  return (
    <div>
      <PageTitle
        emoji='📚'
        title='Publications'
        subtitle='My academic and professional publications'
      />
      <div className='grid grid-cols-1 gap-4'>
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <CardLoading key={index} variant='publication' />
          ))}
      </div>
    </div>
  );
}

export default function PublicationsContent({
  publications,
}: {
  publications: Publication[];
}) {
  return (
    <div>
      <PageTitle
        emoji='📚'
        title='Publications'
        subtitle='My academic and professional publications'
      />

      <div className='grid grid-cols-1 gap-4'>
        {publications.length > 0 ? (
          <StaggerContainer>
            {publications.map((publication) => (
              <ViewTransition key={publication.id}>
                <PublicationCard publication={publication} />
              </ViewTransition>
            ))}
          </StaggerContainer>
        ) : (
          <CardEmpty message='No publications available' />
        )}
      </div>
    </div>
  );
}
