import CertificateCard from '@/components/Card/Certificate';
import { Certificate } from '@/types/certificate';
import { drawer } from '@/components/Drawer';
import CertificateForm from '@/components/Form/Certificate';
import { Button, Icon } from '@/components/UI';
import Separator from '@/components/UI/Separator';

const CertificateDrawer = ({
  certificates,
}: {
  certificates: Certificate[];
}) => {
  const handleAddCertificate = () => {
    drawer.open(<CertificateForm />);
  };

  return (
    <>
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Icon name='certificate' className='size-[28px] md:size-[32px]' />
            <h1 className='text-xl md:text-2xl font-semibold'>
              Certifications
            </h1>
          </div>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddCertificate}>
              <span className='hidden lg:block'>Add</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      <div className='grid grid-cols-1 space-y-4 overflow-y-auto w-fit p-4 md:p-8'>
        {certificates.map((certificate) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            openForm
          />
        ))}
      </div>
    </>
  );
};

export default CertificateDrawer;
