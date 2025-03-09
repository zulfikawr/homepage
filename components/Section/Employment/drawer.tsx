import { EmploymentCard } from 'components/Card/Employment';
import { Employment } from 'types/employment';
import { drawer } from 'components/Drawer';
import EmploymentForm from 'components/Form/Employment';
import { Button } from 'components/UI';

const EmploymentsDrawer = ({
  employments,
  onUpdate,
}: {
  employments: Employment[];
  onUpdate: () => Promise<void>;
}) => {
  const handleEditEmployment = (employment: Employment) => {
    drawer.open(
      <EmploymentForm employmentToEdit={employment} onUpdate={onUpdate} />,
    );
  };

  const handleAddEmployment = () => {
    drawer.open(<EmploymentForm onUpdate={onUpdate} />);
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit Employments</h1>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddEmployment}>
              <span className='hidden lg:block'>Add Employment</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()}>
              <span className='hidden lg:block'>Close</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
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
              <EmploymentCard {...employment} isInDrawer />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EmploymentsDrawer;
