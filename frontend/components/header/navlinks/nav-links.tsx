'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/actions/clientActions';
import profileSrcBlue from '@/assets/images/profile_blue.svg';
import profileSrcWhite from '@/assets/images/profile_white.svg';
import busketSrc from '@/assets/images/purchase.svg';
import busketSrcBlue from '@/assets/images/purchase_blue.svg';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { capitalize } from '../../../utils/capitalize';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Box } from '@chakra-ui/react';
import MobileNav from '@/components/header/mobile-nav';
import { useRouter } from 'next/navigation';

/* eslint-disable */
interface IProduct {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
    category: {
      id: number;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
    images: Array<{
      id: number;
      imageUrl: string;
      productId: number;
      createdAt: string;
      updatedAt: string;
    }>;
  };
  quantity: number;
}

export default function NavLinks() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [userName, setUserName] = useState<string | null>(null);
  /* eslint-disable */
  const [productQuantity, setProductQuantity] = useState<number>(0);
  const { replace } = useRouter();

  const logoutUser = () => {
    dispatch(logout());
    setUserName(null);
    replace('/');
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
      title: userName || 'Профиль',
      path: '/profile',
      blueImgSrc: profileSrcBlue,
      whiteImgSrc: profileSrcWhite,
    },
  ];

  return (
    <>
      {/* Мобильная версия */}
      <Box display={{ base: 'block', md: 'none' }}>
        <MobileNav>
          <Box className="flex-col bg-white text-slate-600" as="ul">
            {links.map((link) => (
              <Box key={link.id} className="mb-4 flex items-center" as="li">
                <Link
                  href={link.path}
                  passHref
                  className={
                    pathname === link.path
                      ? 'text-blue-600 underline flex items-center'
                      : 'text-blue-400 flex'
                  }
                >
                  {link.title}
                  {link.title === 'Профиль' && (
                    <Image
                      className={
                        pathname === link.path ? 'h-6 w-6 pl-2' : 'w-6 h-6 pl-2'
                      }
                      src={
                        pathname === link.path
                          ? link.blueImgSrc
                          : link.whiteImgSrc
                      }
                      alt={link.title}
                    />
                  )}
                </Link>
              </Box>
            ))}
            {userName || user ? (
              <>
                <Box
                  position="relative"
                  className="flex items-center mr-3 mb-4"
                  as="li"
                >
                  <Link href="/busket" className="text-white flex">
                    {productQuantity > 0 && (
                      <Box
                        w="15px"
                        h="15px"
                        position="absolute"
                        top="-9px"
                        right="230px"
                        borderRadius="50%"
                        bg="red"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box
                          position="absolute"
                          color="white"
                          fontWeight="extrabold"
                          fontSize="12px"
                        >
                          {productQuantity}
                        </Box>
                      </Box>
                    )}
                    <Image
                      className="max-w-[20px]"
                      src={busketSrcBlue}
                      alt={busketSrcBlue}
                    />
                  </Link>
                </Box>
                <Box className="flex items-center" as="li">
                  <Link
                    href="/"
                    onClick={logoutUser}
                    className="text-blue-600 font-semibold"
                  >
                    Выйти
                  </Link>
                </Box>
              </>
            ) : (
              <Box className="flex items-center" as="li">
                <Link href="/login" className="text-blue-600 font-semibold">
                  Войти
                </Link>
              </Box>
            )}
          </Box>
        </MobileNav>
      </Box>

      {/* Десктопная версия */}
      <Box display={{ base: 'none', md: 'flex' }} as="ul" className="flex">
        {links.map((link) => (
          <Box key={link.id} className="mr-5 flex items-center" as="li">
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
          </Box>
        ))}
        {userName || user ? (
          <>
            <Box position="relative" className="flex items-center mr-5" as="li">
              <Link href="/busket" className="text-white flex">
                {productQuantity > 0 && (
                  <Box
                    w="15px"
                    h="15px"
                    position="absolute"
                    top="-9px"
                    right="-11px"
                    borderRadius="50%"
                    bg="red"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box
                      position="absolute"
                      color="white"
                      fontWeight="extrabold"
                      fontSize="12px"
                    >
                      {productQuantity}
                    </Box>
                  </Box>
                )}
                <Image
                  className="max-w-[20px]"
                  src={busketSrc}
                  alt={busketSrc}
                />
              </Link>
            </Box>
            <Box className="mr-5 flex items-center" as="li">
              <Link href="/" onClick={logoutUser} className="text-white flex">
                Выйти
              </Link>
            </Box>
          </>
        ) : (
          <Box className="mr-5 flex items-center" as="li">
            <Link href="/login" className="text-white flex">
              Войти
            </Link>
          </Box>
        )}
      </Box>
    </>
  );
}
