import Link from 'next/link';
import arrowBack from '@/assets/icon/arrowBack.svg';

export const BackButton = () => (
  <div className='self-start items-start md:pl-9'>
    <Link href={'/'}>
      <img src={arrowBack.src} alt='' />
    </Link>
  </div>
);