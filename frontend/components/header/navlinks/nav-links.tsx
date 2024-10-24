'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/actions/clientActions';
import profileSrcBlue from '../../../app/images/profile_blue.svg';
import profileSrcWhite from '../../../app/images/profile_white.svg';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { capitalize } from '../../../utils/capitalize';
import { useAppSelector } from '@/hooks/useAppSelector';

export default function NavLinks() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [userName, setUserName] = useState<string | null>(null);

  const logoutUser = () => {
    dispatch(logout());
    setUserName(null);
  };

  useEffect(() => {
    if (user && user.username) {
      setUserName(`Приветствую ${capitalize(user.username)}`);
    } else {
      const user = Cookies.get('user');
      if (user) {
        const userNameFromCookie = JSON.parse(user);
        setUserName(`Приветствую ${capitalize(userNameFromCookie.username)}`);
      } else {
        setUserName(null);
      }
    }
  }, [user]);

  const links = [
    { id: 1, title: 'Главная', path: '/' },
    { id: 2, title: 'О нас', path: '/about' },
    { id: 3, title: 'Контакты', path: '/contacts' },
    {
      id: 4,
      title: userName
        ? userName
        : user?.username
          ? `Приветствую ${capitalize(user.username)}`
          : 'Профиль',
      path: '/profile',
      blueImgSrc: profileSrcBlue,
      whiteImgSrc: profileSrcWhite,
    },
  ];

  return (
    <ul className="flex">
      {links.map((link) => (
        <li key={link.id} className="mr-5 flex items-center">
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
        </li>
      ))}
      {userName || user ? (
        <li className="mr-5 flex items-center">
          <Link href="/" onClick={logoutUser} className="text-white flex">
            Выйти
          </Link>
        </li>
      ) : (
        <li className="mr-5 flex items-center">
          <Link href="/login" className="text-white flex">
            Войти
          </Link>
        </li>
      )}
    </ul>
  );
}
