import { ReactNode } from 'react';
import { Text, Box } from '@chakra-ui/react';

interface IContainerProps {
  title: string;
  children: ReactNode;
  myClass: string;
}

export default function AppContainer({
  title,
  children,
  myClass,
}: IContainerProps) {
  return (
    <Box className="flex flex-col items-center">
      <Box
        as="section"
        className="flex justify-start"
        px="5"
        mb="10"
        maxW="1920"
        w="100%"
      >
        <Text color="blue.600" fontSize="2xl">
          {title}
        </Text>
      </Box>
      <Box
        as="section"
        className={['flex', myClass].join(' ')}
        px="5"
        maxW="1920"
        w="100%"
      >
        {children}
      </Box>
    </Box>
  );
}
