import ImageWithFallback from '@/components/ImageWithFallback';
import { Table, TableBody, TableCell, TableRow } from '@/components/UI';
import { Separator } from '@/components/UI/Separator';
import { Employment } from '@/types/employment';

const EmploymentViewer = ({ employment }: { employment: Employment }) => {
  return (
    <div className='flex flex-col h-full overflow-hidden'>
      {/* Header */}
      <div className='flex-shrink-0 px-4 pt-2 pb-4 sm:px-8 sm:pt-4 sm:pb-6'>
        <div className='flex flex-row justify-between items-center gap-4'>
          <div className='flex-1 items-center'>
            <h1 className='flex items-center text-xl sm:text-2xl font-medium tracking-wide'>
              <span className='mr-3 inline-block'>
                {employment.organization_logo_url && (
                  <ImageWithFallback
                    src={employment.organization_logo_url}
                    alt={employment.organization}
                    width={30}
                    height={30}
                    className='rounded-full border bg-white '
                    type='square'
                    sizes='30px'
                  />
                )}
              </span>
              {employment.organization}
            </h1>
          </div>
        </div>
      </div>

      <Separator margin='0' />

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-8'>
          {/* Employment Details */}
          <section>
            <h2 className='text-2xl font-medium mb-6'>Employment Details</h2>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className='bg-muted/50 dark:bg-muted font-medium border-r border w-1/3'>
                    Organization
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      {employment.organization_logo_url && (
                        <ImageWithFallback
                          src={employment.organization_logo_url}
                          alt={employment.organization}
                          width={24}
                          height={24}
                          className='rounded-full border bg-white '
                          type='square'
                          sizes='24px'
                        />
                      )}
                      {employment.organization}
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='bg-muted/50 dark:bg-muted font-medium border-r border'>
                    Position
                  </TableCell>
                  <TableCell>{employment.job_title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='bg-muted/50 dark:bg-muted font-medium border-r border'>
                    Type
                  </TableCell>
                  <TableCell>{employment.job_type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='bg-muted/50 dark:bg-muted font-medium border-r border'>
                    Location
                  </TableCell>
                  <TableCell>{employment.organization_location}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='bg-muted/50 dark:bg-muted font-medium border-r border'>
                    Duration
                  </TableCell>
                  <TableCell>{employment.date_string}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='bg-muted/50 dark:bg-muted font-medium border-r border'>
                    Industry
                  </TableCell>
                  <TableCell>{employment.organization_industry}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          {/* Responsibilities */}
          <section>
            <h2 className='text-2xl font-medium mb-4'>Responsibilities</h2>
            <ul className='list-disc list-inside prose dark:prose-invert max-w-none'>
              {employment.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EmploymentViewer;
