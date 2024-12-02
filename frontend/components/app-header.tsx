import Image from 'next/image';
import logoSrc from '@/assets/images/logo.svg';
import Link from 'next/link';
import { Box } from '@chakra-ui/react';
import profileSrcBlue from '@/assets/images/profile_blue.svg';


const links = [
  { id: 1, title: 'Главная', path: '/' },
  { id: 2, title: 'О нас', path: '/about' },
  { id: 3, title: 'Контакты', path: '/contacts' },
  { id: 4, title: 'Профиль', path: '/profile', blueImgSrc: profileSrcBlue },
];

function AppHeader() {
  return (
    <Box
      as="header"
      className="flex justify-center items-center"
      w="100%"
      minH="16"
      bg="gray.500"
      mb="5"
      position="fixed"
      zIndex="99"
    >
      <Box
        className="flex justify-between items-center"
        px="5"
        maxW="1920"
        w="100%"
        flexDirection={{ base: 'row-reverse', md: 'row' }}
      >
        <Link href="/">
          <Image className="w-9 h-9" src={logoSrc} alt="logo" />
        </Link>
        
      <>
          {/* Мобильная версия */}
          <Box display={{ base: 'block', md: 'none' }}>
              <Box className="flex-col bg-white text-slate-600" as="ul">
                {links.map((link) => (
                  <Box key={link.id} className="mb-4 flex items-center" as="li">
                    <Link
                      href={link.path}
                      passHref
                      className="text-blue-400 flex cursor-pointer"
                    >
                      {link.title}                
                    </Link>
                  </Box>
                ))}
              
            </Box>
          </Box>

          {/* Десктопная версия */}
          <Box display={{ base: 'none', md: 'flex' }} as="ul" className="flex">
            {links.map((link) => (
              <Box key={link.id} className="mr-5 flex items-center" as="li">
                <Link
                  href={link.path}
                  passHref
                  className="text-blue-400 flex cursor-pointer"
                >
                  {link.title}
                  
                </Link>
              </Box>
            ))}
            
          </Box>
        </>
      </Box>
    </Box>
  );
}

export default AppHeader;

