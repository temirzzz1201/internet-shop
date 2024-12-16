import { Box, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function Footer() {
  const footerColumnFirst = [
    { id: 1, href: '/about', text: 'О нас' },
    { id: 2, href: '/contacts', text: 'Контакты' },
    { id: 3, href: '/#', text: 'vk' },
    { id: 4, href: '/#', text: 'telegram' },
  ];
  const year = new Date().getFullYear();

  return (
    <Box
      as="footer"
      px="5"
      bg="gray.500"
      w="100%"
      className="flex justify-center border-t-2 border-t-slate-600"
    >
      <Box
        maxW="1920"
        w="100%"
        className="flex flex-col items-center justify-center mt-3"
      >
        <Box className="flex justify-between items-center" w="100%">
          <Box as="ul" className="flex flex-col" mr="3">
            <Box as="li" className="flex flex-col text-white">
              {footerColumnFirst.map((item) => (
                <Link key={item.id} href={item.href}>
                  {item.text}
                </Link>
              ))}
            </Box>
          </Box>
          <Box as="ul" className="flex flex-col" mr="3">
            <Box as="li" className="flex flex-col text-white">
              {footerColumnFirst.map((item) => (
                <Link key={item.id} href={item.href}>
                  {item.text}
                </Link>
              ))}
            </Box>
          </Box>
          <Box as="ul" className="flex flex-col">
            <Box as="li" className="flex flex-col text-white">
              {footerColumnFirst.map((item) => (
                <Link key={item.id} href={item.href}>
                  {item.text}
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
        <Text className="mb-4 mt-3 text-white" fontSize="l">
          @ copyright {year}. created by Tmzzz
        </Text>
      </Box>
    </Box>
  );
}
