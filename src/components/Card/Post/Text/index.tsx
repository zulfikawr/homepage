import { Label } from '~/components/UI';
import Link from 'next/link';
import CardFooter from '~/components/Card/Post/Footer';
import { openReader } from '~/components/Reader';
import { trimStr } from '~/utilities/string';
import { Post } from '~/types/post';
import { drawer } from '~/components/Drawer';
import PostForm from '~/components/Form/Post';

interface Props {
  post: Post;
  isInDrawer?: boolean;
  isInForm?: boolean;
}

export default function CardText({ post, isInDrawer, isInForm }: Props) {
  const handleCardClick = () => {
    if (isInDrawer) {
      drawer.open(<PostForm postToEdit={post} isInDrawer />);
    } else if (isInForm) {
      return;
    } else {
      window.location.href = `/post/${post.slug}`;
    }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openReader(post);
  };

  return (
    <div
      className={`group relative z-40 flex cursor-pointer ${isInDrawer || isInForm ? 'w-full' : ''} flex-col rounded-md border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:shadow-none`}
      onClick={() => {
        handleCardClick();
      }}
    >
      <div className='p-5'>
        <div className='col-span-2 col-end-4'>
          <div className='flex items-center justify-between'>
            {post.categories && (
              <div className='flex space-x-2'>
                <Link
                  href={`/post/cate/${post.categories[0]}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Label type='primary' icon='folder'>
                    {post.categories[0]}
                  </Label>
                </Link>
              </div>
            )}
            <div onClick={handlePreviewClick}>
              <Label type='secondary' icon='magifyingGlassPlus'>
                Preview
              </Label>
            </div>
          </div>
          <div className='mt-6'>
            <h1 className='mb-4 text-xl lg:text-2xl font-medium tracking-wider text-gray-700 dark:text-white'>
              {post.title}
            </h1>
            <p
              className='leading-2 overflow-hidden text-ellipsis text-md tracking-wide text-gray-500 dark:text-gray-400'
              dangerouslySetInnerHTML={{
                __html: trimStr(post.excerpt, 150),
              }}
            />
          </div>
        </div>
      </div>
      <CardFooter item={post} />
    </div>
  );
}
