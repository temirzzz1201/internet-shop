'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/actions/clientActions';
import profileSrcBlue from '../../../app/images/profile_blue.svg';
import profileSrcWhite from '../../../app/images/profile_white.svg';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function NavLinks() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const role = Cookies.get('role');
    setIsAdmin(role === 'admin');

    console.log('role ', role);
    

    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('userName');
      console.log('name ', name);
      
      setUserName(name);
    }
  }, []);

  const logoutUser = () => {
    dispatch(logout());
    setIsAdmin(false);
    setUserName(null);
    router.push('/login');
  };

  const links = [
    { id: 1, title: 'Home', path: '/' },
    { id: 2, title: 'About', path: '/about' },
    { id: 3, title: 'Contacts', path: '/contacts' },
    {
      id: 4,
      title: userName ? `Welcome ${userName.charAt(0).toUpperCase() + userName.slice(1)}` : 'Profile',
      path: '/profile',
      blueImgSrc: profileSrcBlue,
      whiteImgSrc: profileSrcWhite,
    },
    { id: 5, title: userName ? 'Logout' : 'Login', path: userName ? 'logout' : '/login' },
    ...(isAdmin ? [{ id: 6, title: 'Admin-page', path: '/admin-page' }] : []),
  ];

  console.log('links ', links);
  

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
