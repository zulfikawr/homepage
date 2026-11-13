'use client';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import CardEmpty from '@/components/ui/card/variants/empty';
import { PUBLICATION_TEMPLATE } from '@/components/ui/card/variants/loading';
import { Shimmer } from '@/components/ui/shimmer';
import PublicationCard from '@/components/ui/card/variants/publication';
import { Publication } from '@/types/publication';

const PUBLICATION_TEMPLATES: Publication[] = Array.from(
  { length: 4 },
  (_, index) => ({
    ...PUBLICATION_TEMPLATE,
    id: `loading-publication-${index}`,
    slug: `loading-publication-${index}`,
  }),
);

export function PublicationsSkeleton() {
  return (
    <Shimmer loading>
      <PublicationsContent publications={PUBLICATION_TEMPLATES} />
    </Shimmer>
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
