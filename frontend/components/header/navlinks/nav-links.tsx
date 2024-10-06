'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/actions/clientActions';
import profileSrcBlue from '../../../app/images/profile_blue.svg';
import profileSrcWhite from '../../../app/images/profile_white.svg';
import { usePathname } from 'next/navigation';

const links = [
  { id: 1, title: 'Home', path: '/' },
  { id: 2, title: 'About', path: '/about' },
  { id: 3, title: 'Login', path: '/login' },
  {
    id: 4,
    title: 'Profile',
    path: '/profile',
    blueImgSrc: profileSrcBlue,
    whiteImgSrc: profileSrcWhite,
  },
  { id: 5, title: 'Admin', path: '/admin' },
  { id: 6, title: 'Logout', path: '/logout' },
];

export default function NavLinks() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const logoutUser = () => {
    dispatch(logout());
  };

  return (
    <ul className="flex">
      {links.map((link) => (
        <li key={link.id} className="mr-5 flex items-center">
          {link.title === 'Logout' ? (
            <Link href="login" onClick={logoutUser} className="text-white flex">
              {link.title}
            </Link>
          ) : (
            <Link
              href={link.path}
              passHref
              className={
                pathname === link.path
                  ? 'text-blue-300 underline flex items-center'
                  : 'text-white flex'
              }
            >
              {link.title}
              {link.title === 'Profile' && (
                <Image
                  className={
                    pathname === link.path ? 'h-6 w-6 pl-2' : 'w-6 h-6 pl-2'
                  }
                  src={
                    pathname === link.path ? link.blueImgSrc : link.whiteImgSrc
                  }
                  alt={link.title}
                />
              )}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
