import Image from 'next/image';
import { Card } from '@/components/Card';
import openLink from '@/utilities/externalLink';
import { Certificate } from '@/types/certificate';
import Separator from '@/components/UI/Separator';

export interface CertificateCardProps extends Certificate {
  isInDrawer?: boolean;
}

const CertificateCard = (props: CertificateCardProps) => {
  const {
    title,
    issuedBy,
    dateIssued,
    credentialId,
    imageUrl,
    organizationLogoUrl,
    link,
    isInDrawer,
  } = props;

  const handleClick = () => {
    if (!isInDrawer) {
      openLink(link);
    }
  };

  return (
    <Card onClick={handleClick} isInDrawer={isInDrawer}>
      {/* Mobile Layout: Stacked */}
      <div className='block md:hidden'>
        <div className='w-full'>
          <div className='w-full aspect-video'>
            <Image
              width={300}
              height={200}
              src={imageUrl || '/images/placeholder.png'}
              alt={title}
              className='w-full h-full rounded-t-md border border-gray-300 dark:border-neutral-700 shadow-sm shadow-neutral-200 dark:shadow-none object-cover'
              loading='lazy'
            />
          </div>
          <div className='flex w-full border-b border-neutral-100 px-4 py-3 dark:border-neutral-700 dark:text-neutral-400'>
            <p className='line-clamp-1 text-ellipsis text-md font-medium leading-tight tracking-wider dark:text-white'>
              {title}
            </p>
          </div>
          <div className='p-4 space-y-1'>
            <div className='flex items-center space-x-2'>
              {organizationLogoUrl && (
                <Image
                  width={14}
                  height={14}
                  src={organizationLogoUrl || '/images/placeholder.png'}
                  alt={title}
                  loading='lazy'
                />
              )}
              <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
                {issuedBy}
              </p>
            </div>
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
              Issued {dateIssued}
            </p>
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
              Credential ID: {credentialId}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout: Side-by-Side */}
      <div className='hidden md:grid md:grid-cols-4 items-center gap-4 p-4'>
        <div className='col-span-1 flex justify-center aspect-video'>
          <Image
            width={200}
            height={150}
            src={imageUrl || '/images/placeholder.png'}
            alt={title}
            className='rounded-md border border-gray-300 dark:border-neutral-700 shadow-sm shadow-neutral-200 dark:shadow-none object-cover'
            loading='lazy'
          />
        </div>
        <div className='col-span-3 space-y-2'>
          <p className='text-normal line-clamp-1 text-ellipsis font-medium leading-tight tracking-wider dark:text-white'>
            {title}
          </p>
          <Separator margin='2' />
          <div className='flex items-center space-x-2'>
            {organizationLogoUrl && (
              <Image
                width={14}
                height={14}
                src={organizationLogoUrl || '/images/placeholder.png'}
                alt={title}
                loading='lazy'
              />
            )}
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
              {issuedBy}
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
              Issued {dateIssued}
            </p>
            <span className='text-neutral-400 font-light text-xs'>|</span>
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
              Credential ID: {credentialId}
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
};

export default CertificateCard;
