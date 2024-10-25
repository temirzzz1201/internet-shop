'use client';
import NavLinks from './navlinks/nav-links';
import Image from 'next/image';
import logoSrc from '@/app/images/logo.svg';
import Link from 'next/link';
import { Box } from '@chakra-ui/react';

export default function Header() {
  return (
    <Box
      as="header"
      className="flex justify-center items-center"
      w="100%"
      minH="16"
      bg="gray.500"
      mb="5"
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
        <NavLinks />
      </Box>
    </Box>
  );
}
