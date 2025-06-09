import { Card } from '@/components/Card';
import openLink from '@/utilities/externalLink';
import { Certificate } from '@/types/certificate';
import Separator from '@/components/UI/Separator';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useRouter } from 'next/navigation';

interface CertificateCardProps {
  certificate: Certificate;
  openForm?: boolean;
  isInForm?: boolean;
}

export default function CertificateCard({
  certificate,
  openForm,
  isInForm,
}: CertificateCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (isInForm) return;

    if (openForm) {
      router.push(`/database/certs/${certificate.id}/edit`);
    } else {
      openLink(certificate.link);
    }
  };

  return (
    <Card onClick={handleCardClick} openForm={openForm} isInForm={isInForm}>
      <div className='block md:hidden'>
        {/* Mobile layout */}
        <div className='w-full'>
          <div className='w-full aspect-video'>
            <ImageWithFallback
              width={300}
              height={200}
              src={certificate.imageUrl}
              alt={certificate.title}
              className='w-full h-full rounded-t-md border border-gray-300 dark:border-neutral-700 shadow-sm shadow-neutral-200 dark:shadow-none object-cover'
              loading='lazy'
            />
          </div>
          <div className='flex w-full border-b border-neutral-100 px-4 py-3 dark:border-neutral-700 dark:text-neutral-400'>
            <p className='line-clamp-1 text-ellipsis text-md font-medium leading-tight tracking-wider dark:text-white'>
              {certificate.title}
            </p>
          </div>
          <div className='p-4 space-y-1'>
            <div className='flex items-center space-x-2'>
              {certificate.organizationLogoUrl && (
                <ImageWithFallback
                  width={14}
                  height={14}
                  src={certificate.organizationLogoUrl}
                  alt={certificate.title}
                  loading='lazy'
                  type='square'
                />
              )}
              <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
                {certificate.issuedBy}
              </p>
            </div>
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
              Issued {certificate.dateIssued}
            </p>
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
              Credential ID: {certificate.credentialId}
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
            src={certificate.imageUrl}
            alt={certificate.title}
            className='rounded-md border border-gray-300 dark:border-neutral-700 shadow-sm shadow-neutral-200 dark:shadow-none object-cover'
            loading='lazy'
          />
        </div>
        <div className='col-span-3 space-y-2'>
          <p className='text-normal line-clamp-1 text-ellipsis font-medium leading-tight tracking-wider dark:text-white'>
            {certificate.title}
          </p>
          <Separator margin='2' />
          <div className='flex items-center space-x-2'>
            {certificate.organizationLogoUrl && (
              <ImageWithFallback
                width={14}
                height={14}
                src={certificate.organizationLogoUrl}
                alt={certificate.title}
                loading='lazy'
                type='square'
              />
            )}
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
              {certificate.issuedBy}
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
              Issued {certificate.dateIssued}
            </p>
            <span className='text-neutral-400 font-light text-xs'>|</span>
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
              Credential ID: {certificate.credentialId}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4 py-2 text-xs font-light text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'>
        <span>Certificate</span>
        <span>View</span>
      </div>
    </Card>
  );
}
