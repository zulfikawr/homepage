import { ProjectCard } from '@/components/Card/Project';
import { Project } from '@/types/project';
import { drawer } from '@/components/Drawer';
import ProjectForm from '@/components/Form/Project';
import { Button, Icon } from '@/components/UI';
import Separator from '@/components/UI/Separator';

const ProjectsDrawer = ({
  projects,
  onUpdate,
}: {
  projects: Project[];
  onUpdate?: () => Promise<void>;
}) => {
  const handleEditProject = (project: Project) => {
    drawer.open(<ProjectForm projectToEdit={project} onUpdate={onUpdate} />);
  };

  const handleAddProject = () => {
    drawer.open(<ProjectForm onUpdate={onUpdate} />);
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Icon name='package' className='size-[28px] md:size-[32px]' />
            <h1 className='text-xl md:text-2xl font-semibold'>Projects</h1>
          </div>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddProject}>
              <span className='hidden md:block'>Add</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-6'>
          {projects.map((project, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEditProject(project);
              }}
              className='cursor-pointer'
            >
              <ProjectCard {...project} isInDrawer />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectsDrawer;
