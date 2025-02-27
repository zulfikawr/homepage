import { Label } from '~/components/UI';
import Link from 'next/link';
import CardFooter from '~/components/Card/Footer';
import { Post } from '~/constants/propTypes';
import { trimStr } from '~/utilities/string';
import { openReader } from '~/components/Reader';

interface Props {
  item: Post;
}

export const CardTool = ({
  item,
  preview,
}: {
  item: Post;
  preview: boolean;
}) => {
  return (
    <div className='w-full overflow-hidden whitespace-nowrap rounded-md border border-gray-200 shadow-sm dark:border-gray-600 dark:bg-gray-600 lg:grid lg:grid-cols-8 lg:gap-3'>
      <div className='col-start-2 col-end-9 grid grid-cols-2 items-center py-2 pl-3 pr-3 lg:pl-0'>
        <div className='hidden justify-end space-x-2 lg:flex'>
          {preview && (
            <Label
              type='gray-icon'
              icon='preview'
              onClick={() => {
                openReader(item);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default function CardWithImageTool({ item }: Props) {
  return (
    <div className='w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 mb-6'>
      <div className='p-5 lg:p-10'>
        <CardTool item={item} preview={true} />
        <div className='mt-6'>
          <Link href={`/post/${item.slug}`}>
            <h1
              className='mb-5 text-2 font-medium tracking-wider text-gray-700 dark:text-white lg:text-listTitle'
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
          </Link>
          <p
            className='leading-2 overflow-hidden text-ellipsis text-4 tracking-wide text-gray-500 dark:text-gray-400 lg:text-3 lg:leading-8'
            dangerouslySetInnerHTML={{
              __html: trimStr(item.excerpt, 150),
            }}
          />
        </div>
      </div>
      <CardFooter item={item} />
    </div>
  );
}
