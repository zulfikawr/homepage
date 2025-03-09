import { ProjectCard } from 'components/Card/Project';
import { Project } from 'types/project';
import { drawer } from 'components/Drawer';
import ProjectForm from 'components/Form/Project';
import { Button } from 'components/UI';

const ProjectsDrawer = ({
  projects,
  onUpdate,
}: {
  projects: Project[];
  onUpdate: () => Promise<void>;
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
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit Projects</h1>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddProject}>
              <span className='hidden lg:block'>Add Project</span>
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
