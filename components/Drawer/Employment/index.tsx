import { EmploymentCard } from '@/components/Card/Employment';
import { Employment } from '@/types/employment';
import { drawer } from '@/components/Drawer';
import EmploymentForm from '@/components/Form/Employment';
import { Button, Icon } from '@/components/UI';
import Separator from '@/components/UI/Separator';

const EmploymentsDrawer = ({ employments }: { employments: Employment[] }) => {
  const handleEditEmployment = (employment: Employment) => {
    drawer.open(<EmploymentForm employmentToEdit={employment} />);
  };

  const handleAddEmployment = () => {
    drawer.open(<EmploymentForm />);
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Icon name='briefcase' className='size-[28px] md:size-[32px]' />
            <h1 className='text-xl md:text-2xl font-semibold'>Employments</h1>
          </div>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddEmployment}>
              <span className='hidden lg:block'>Add</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-6'>
          {employments.map((employment, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEditEmployment(employment);
              }}
              className='cursor-pointer'
            >
              <EmploymentCard employment={employment} openForm />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EmploymentsDrawer;
