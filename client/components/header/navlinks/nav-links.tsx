'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Box,
  useDisclosure,
  Heading,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import busketSrc from '@/assets/images/purchase_white.svg';
import { logout } from '@/actions/clientActions';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { capitalize } from '../../../utils/capitalize';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useCart } from '@/hooks/useCart';

export default function NavLinks() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { replace } = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  // const [cartItems, setCartItems] = useState<null | number| 'loading'>(null);

  const logoutUser = () => {
    dispatch(logout());
    setUserName(null);
    // setCartItems(null);
    onClose();
    replace('/');
  };

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const userFromCookie = JSON.parse(userCookie);
      setUserName(`Приветствую ${capitalize(userFromCookie.username)}`);
    } else {
      setUserName(null);
    }
  }, []);

  const { cartItems } = useCart();

  const totalQuantity = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const links = [
    { id: 1, title: 'Главная', path: '/' },
    { id: 2, title: 'О нас', path: '/about' },
    { id: 3, title: 'Контакты', path: '/contacts' },
  ];

  return (
    <Box as="nav">
      {/* Мобильное меню */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Box cursor="pointer" onClick={onOpen}>
          <motion.div
            initial={{ rotate: 0 }}
            animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '25px',
              height: '2px',
              background: 'white',
              marginBottom: '5px',
            }}
          />
          <motion.div
            initial={{ opacity: 1 }}
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '25px',
              height: '2px',
              background: 'white',
              marginBottom: '5px',
            }}
          />
          <motion.div
            initial={{ rotate: 0 }}
            animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '25px', height: '2px', background: 'white' }}
          />
        </Box>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent bg="#6f7e95">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={4}
            >
              <Heading className="text-white" size="lg">
                Electronic Elephant
              </Heading>
              <CloseIcon color="white" onClick={onClose} cursor="pointer" />
            </Box>
            <DrawerBody>
              <Box as="ul">
                {links.map((link) => (
                  <Box key={link.id} as="li" mb={4}>
                    <Link
                      href={link.path}
                      onClick={onClose}
                      className="text-white cursor-pointer outline-none transition-all duration-300"
                    >
                      {link.title}
                    </Link>
                  </Box>
                ))}
                {isAuthenticated || userName ? (
                  <Box as="li">
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="text-white cursor-pointer outline-none transition-all duration-300"
                    >
                      Профиль
                    </Link>
                  </Box>
                ) : null}
                {isAuthenticated || userName ? (
                  <Box as="li" mt={4}>
                    <Link
                      onClick={onClose}
                      href="/busket"
                      className="flex relative text-white cursor-pointer w-[97px] outline-none transition-all duration-300"
                    >
                      Корзина
                      {totalQuantity && (
                        <Box
                          className="min-w-[15px] max-w-[15px] min-h-[15px] max-h-[15px] flex justify-center items-center absolute top-[-7px] right-[-7px] bg-blue-600 text-white"
                          borderRadius="50%"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {totalQuantity}
                        </Box>
                      )}
                      <Image
                        className="w-[25px] h-[20px]"
                        alt={busketSrc}
                        src={busketSrc}
                      />
                    </Link>
                  </Box>
                ) : null}
                {isAuthenticated || userName ? (
                  <Box as="li" mt={4}>
                    <Box
                      as="button"
                      onClick={logoutUser}
                      className="text-white cursor-pointer outline-none transition-all duration-300"
                    >
                      Выйти
                    </Box>
                  </Box>
                ) : (
                  <Box as="li">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="text-white cursor-pointer outline-none transition-all duration-300"
                    >
                      Войти
                    </Link>
                  </Box>
                )}
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>

      {/* Десктопное меню */}
      <Box display={{ base: 'none', md: 'flex' }} as="ul" className="flex">
        {links.map((link) => (
          <Box key={link.id} as="li" className="mr-3">
            <Link
              href={link.path}
              className="text-white cursor-pointer outline-none hover:text-blue-200 transition-all duration-300"
            >
              {link.title}
            </Link>
          </Box>
        ))}
        {isAuthenticated || userName ? (
          <Box as="li">
            <Link
              href="/busket"
              className="flex relative text-white cursor-pointer outline-none hover:text-blue-200 transition-all duration-300 mr-3"
            >
              Корзина
              {totalQuantity > 0 && (
                <Box
                  className="min-w-[15px] max-w-[15px] min-h-[15px] max-h-[15px] flex justify-center items-center absolute top-[-7px] right-[-7px] bg-blue-600 text-white"
                  borderRadius="50%"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {totalQuantity}
                </Box>
              )}
              <Image
                className="w-[25px] h-[20px]"
                alt={busketSrc}
                src={busketSrc}
              />
            </Link>
          </Box>
        ) : null}
        {isAuthenticated || userName ? (
          <Box as="li">
            <Link
              href="/profile"
              className="text-white cursor-pointer outline-none hover:text-blue-200 transition-all duration-300 mr-3"
            >
              Профиль
            </Link>
          </Box>
        ) : null}
        {isAuthenticated || userName ? (
          <Box as="li">
            <Box
              as="button"
              onClick={logoutUser}
              className="text-white cursor-pointer outline-none hover:text-blue-200 transition-all duration-300 mr-3"
            >
              Выйти
            </Box>
          </Box>
        ) : (
          <Box as="li">
            <Link
              href="/login"
              className="text-white cursor-pointer outline-none hover:text-blue-200 transition-all duration-300"
            >
              Войти
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
}
