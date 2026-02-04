'use client';

import { useRouter } from 'next/navigation';

import ImageWithFallback from '@/components/image-with-fallback';
import { Separator } from '@/components/ui/separator';
import { Certificate } from '@/types/certificate';
import openLink from '@/utilities/external-link';

import { Card } from '../..';

interface CertificateCardProps {
  certificate: Certificate;
  openForm?: boolean;
  isPreview?: boolean;
}

export default function CertificateCard({
  certificate,
  openForm,
  isPreview,
}: CertificateCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (isPreview) return;

    const identifier = certificate.slug || certificate.id;
    if (openForm) {
      router.push(`/database/certs/${identifier}/edit`);
    } else {
      openLink(certificate.link);
    }
  };

  return (
    <div className={isPreview ? 'w-full' : ''}>
      <Card onClick={handleCardClick} openForm={openForm} isPreview={isPreview}>
        <div className='block md:hidden'>
          {/* Mobile layout */}
          <div className='w-full'>
            <div className='w-full aspect-video'>
              <ImageWithFallback
                width={300}
                height={200}
                src={certificate.image}
                alt={certificate.title}
                className='w-full h-full rounded-t-md border border shadow-sm shadow-muted dark:shadow-none object-cover'
                loading='lazy'
                sizes='100vw'
              />
            </div>
            <div className='flex w-full border-b border-border px-4 py-3  dark:text-muted-foreground'>
              <p className='line-clamp-1 text-ellipsis text-md font-medium leading-tight tracking-wider dark:text-foreground'>
                {certificate.title}
              </p>
            </div>
            <div className='p-4 space-y-1'>
              <div className='flex items-center space-x-2'>
                {certificate.organization_logo && (
                  <ImageWithFallback
                    width={14}
                    height={14}
                    src={certificate.organization_logo}
                    alt={certificate.title}
                    loading='lazy'
                    type='square'
                    sizes='14px'
                  />
                )}
                <p className='text-xs font-light text-muted-foreground'>
                  {certificate.issued_by}
                </p>
              </div>
              <p className='text-xs font-light text-muted-foreground'>
                Issued {certificate.date_issued}
              </p>
              <p className='text-xs font-light text-theme-aqua/80 bg-theme-aqua/5 px-1.5 py-0.5 rounded w-fit'>
                Credential ID: {certificate.credential_id}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Layout: Side-by-Side */}
        <div className='hidden md:grid md:grid-cols-4 items-center gap-4 p-4'>
          <div className='col-span-1 flex justify-center aspect-video'>
            <ImageWithFallback
              width={200}
              height={150}
              src={certificate.image}
              alt={certificate.title}
              className='rounded-md border border shadow-sm shadow-muted dark:shadow-none object-cover'
              loading='lazy'
              sizes='(max-width: 768px) 100vw, 200px'
            />
          </div>
          <div className='col-span-3 space-y-2'>
            <p className='text-normal line-clamp-1 text-ellipsis font-medium leading-tight tracking-wider dark:text-foreground'>
              {certificate.title}
            </p>
            <Separator margin='2' />
            <div className='flex items-center space-x-2'>
              {certificate.organization_logo && (
                <ImageWithFallback
                  width={14}
                  height={14}
                  src={certificate.organization_logo}
                  alt={certificate.title}
                  loading='lazy'
                  type='square'
                  sizes='14px'
                />
              )}
              <p className='text-xs font-light text-muted-foreground'>
                {certificate.issued_by}
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <p className='text-xs font-light text-muted-foreground'>
                Issued {certificate.date_issued}
              </p>
              <span className='text-muted-foreground font-light text-xs'>
                |
              </span>
              <p className='text-xs font-light text-theme-aqua/80 bg-theme-aqua/5 px-1.5 py-0.5 rounded'>
                Credential ID: {certificate.credential_id}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex w-full items-center justify-between border-t border-border px-4 py-2 text-xs font-medium text-muted-foreground  dark:text-muted-foreground'>
          <span className='text-theme-aqua'>Certificate</span>
          <span className='text-theme-blue hover:underline cursor-pointer'>
            View
          </span>
        </div>
      </Card>
    </div>
  );
}
