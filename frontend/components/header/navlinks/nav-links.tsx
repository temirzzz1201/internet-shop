'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/actions/clientActions';
import profileSrcBlue from '../../../app/images/profile_blue.svg';
import profileSrcWhite from '../../../app/images/profile_white.svg';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppSelector';
import Cookies from 'js-cookie';
import { capitalize } from '../../../utils/capitalize'

export default function NavLinks() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const selectedUserName = useAppSelector(state => state.auth.user)
  const [userName, setUserName] = useState('')

  const logoutUser = () => {
    dispatch(logout());
    setUserName(capitalize(''))
  };

  const name = Cookies.get('userName') ?? ''

  useEffect(() => {
    setUserName(`Приветствую ${ capitalize(name) }`)
  }, [name])
  
  const links = [
    { id: 1, title: 'Главная', path: '/' },
    { id: 2, title: 'О нас', path: '/about' },
    { id: 3, title: 'Контакты', path: '/contacts' },
    {
      id: 4,
      title: userName ?  userName: 'Профиль',
      path: '/profile',
      blueImgSrc: profileSrcBlue,
      whiteImgSrc: profileSrcWhite,
    },
    { id: 5, title: 'Войти', path: '/login' },
    { id: 6, title: 'Выйти', path: '/' },
  ];

  return (
    <ul className="flex">
      {links.map((link) => (
        <li key={link.id} className="mr-5 flex items-center">
          {link.title === 'Выйти' ? (
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
              {link.title === 'Профиль' && (
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

