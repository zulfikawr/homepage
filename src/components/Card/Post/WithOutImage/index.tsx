import { Label } from '~/components/UI';
import Link from 'next/link';
import CardFooter from '~/components/Card/Post/Footer';
import { openReader } from '~/components/Reader';
import { trimStr } from '~/utilities/string';
import { Post } from '~/types/post';

interface Props {
  item: Post;
}

export default function CardWithOutImage({ item }: Props) {
  return (
    <div className='mb-6 w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='p-5'>
        <div className='col-span-2 col-end-4'>
          <div className='flex items-center justify-between'>
            {item.categories && (
              <div className='flex space-x-2'>
                <Link href={`/post/cate/${item.categories[0]}`}>
                  <Label type='primary' icon='folder'>
                    {item.categories[0]}
                  </Label>
                </Link>
              </div>
            )}
            <div
              onClick={() => {
                openReader(item);
              }}
            >
              <Label type='secondary' icon='magifyingGlassPlus'>
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
