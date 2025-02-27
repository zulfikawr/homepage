import { Label } from '~/components/UI';
import Link from 'next/link';
import CardFooter from '~/components/Card/Footer';
import type { Post } from '~/constants/propTypes';
import { openReader } from '~/components/Reader';
import { trimStr } from '~/utilities/string';

interface Props {
  item: Post;
}

export default function CardWithOutImage({ item }: Props) {
  return (
    <div className='mb-6 w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='p-5 lg:p-10'>
        <div className='col-span-2 col-end-4'>
          <div className='grid grid-cols-4 items-center'>
            <div className='col-start-1 col-end-3 flex space-x-2'>
              <Link href={`/blog/cate/${item.categories[0]}`}>
                <Label type='primary' icon='cate'>
                  {item.categories[0]}
                </Label>
              </Link>
            </div>
            <div
              data-oa='click-previewPost'
              className='col-start-4 col-end-5 hidden justify-end lg:flex'
              onClick={() => {
                openReader(item);
              }}
            >
              <Label type='secondary' icon='preview'>
                Preview
              </Label>
            </div>
          </div>
          <div className='mt-6'>
            <Link href={`/post/${item.slug}`}>
              <h1 className='mb-5 text-2 font-medium tracking-wider text-gray-700 dark:text-white lg:text-listTitle hover:underline'>
                {item.title}
              </h1>
            </Link>
            <p
              className='leading-2 overflow-hidden text-ellipsis text-4 tracking-wide text-gray-500 dark:text-gray-400 lg:text-3'
              dangerouslySetInnerHTML={{
                __html: trimStr(item.excerpt, 150),
              }}
            />
          </div>
        </div>
      </div>
      <CardFooter item={item} />
    </div>
  );
}
