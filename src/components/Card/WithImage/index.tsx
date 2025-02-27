import { Label, LabelGroup } from '~/components/UI';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import CardFooter from '~/components/Card/Footer';
import CardWithImageAudio from '~/components/Card/WithImage/podcast';
import { Hover } from '~/components/Visual';
import blurDataURL from '~/constants/blurDataURL';
import type { Post } from '~/constants/propTypes';
import useInterval from '~/hooks/useInterval';
import { openReader } from '~/components/Reader';
import { trimStr } from '~/utilities/string';

interface Props {
  item: Post;
}

export default function CardWithImage({ item }: Props) {
  const [outputText, setOutputText] = useState<string>('');
  const [outputting, setOutputting] = useState<boolean>(false);
  const [showThumbnail, _setShowThumbnail] = useState<boolean>(true);

  useInterval(
    () => {
      if (outputText.length === 0) {
        setOutputting(false);
        return;
      }

      const increment = Math.floor(Math.random() * 10) + 1;
      setOutputText((prev) => {
        return prev.slice(increment);
      });
    },
    outputting ? 200 : null,
  );

  if (item.type === 'audio') {
    return <CardWithImageAudio item={item} />;
  }

  return (
    <div className='mb-6 w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='p-5 lg:grid lg:grid-flow-col lg:grid-cols-3 lg:gap-9 lg:p-10'>
        <Hover
          perspective={1000}
          max={25}
          scale={1.01}
          className={`relative col-span-1 col-end-2 hidden h-img min-h-full w-full overflow-hidden rounded-md border border-gray-200 shadow-sm transition-all hover:shadow-md dark:opacity-90 ${
            showThumbnail ? 'lg:block' : 'lg:hidden'
          }`}
        >
          <Image
            fill
            src={item.img || '/images/placeholder.png'}
            placeholder='blur'
            blurDataURL={blurDataURL}
            className='rounded-md object-cover'
            alt={`featured-image-${item.title}`}
            loading='lazy'
          />
        </Hover>
        <div
          className={`col-end-4 ${showThumbnail ? 'col-span-2' : 'col-span-3 ml-auto animate-expandImageCardInfo'}`}
        >
          <div className='flex items-center space-x-3'>
            <div className='col-start-1 col-end-3 flex space-x-2'>
              <Link href={`/blog/cate/${item.categories[0]}`}>
                <Label type='primary' icon='cate'>
                  {item.categories[0]}
                </Label>
              </Link>
            </div>
            <div className='hidden w-full justify-end lg:flex lg:w-auto'>
              <LabelGroup className='h-[33px]'>
                <Label
                  type='secondary'
                  icon='preview'
                  onClick={() => {
                    openReader(item);
                  }}
                >
                  Preview
                </Label>
              </LabelGroup>
            </div>
          </div>
          <div className='mt-6 lg:mt-4'>
            <Link href={`/post/${item.slug}`}>
              <h1 className='mb-5 text-2 font-bold text-gray-700 dark:text-white text-xl lg:text-3xl hover:underline'>
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
