import { Button } from '@/components/UI';
import Link from 'next/link';

export default function Top() {
  return (
    <div className='mt-4 flex gap-3'>
      <div className='flex w-full gap-x-2 whitespace-nowrap'>
        <Link
          target='_blank'
          href='mailto:zulfikawr@gmail.com'
          rel='noreferrer'
        >
          <Button
            type='default'
            icon='mailFilled'
            className='w-full text-3 leading-14 text-red-500 dark:text-red-400'
          >
            <span className='pl-1 tracking-normal'>Email</span>
          </Button>
        </Link>
        <Link
          target='_blank'
          href='https://wa.me/+6285156453730'
          rel='noreferrer'
        >
          <Button
            type='default'
            icon='whatsapp'
            className='w-full text-3 leading-14 text-green-500 dark:text-green-500'
          >
            <span className='tracking-normal'>WhatsApp</span>
          </Button>
        </Link>
        <Link
          target='_blank'
          href='https://www.linkedin.com/in/zulfikar-muhammad'
          rel='noreferrer'
        >
          <Button
            type='default'
            icon='linkedIn'
            className='w-full text-3 leading-14 text-blue-700 dark:text-blue-500'
          >
            <span className='tracking-normal'>LinkedIn</span>
          </Button>
        </Link>
        <Link
          target='_blank'
          href='https://github.com/zulfikawr'
          rel='noreferrer'
        >
          <Button
            type='default'
            icon='github'
            className='w-full text-3 leading-14 text-neutral-800'
          >
            <span className='tracking-normal'>GitHub</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
