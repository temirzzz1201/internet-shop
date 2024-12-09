import { Text, Box } from '@chakra-ui/react';
import { IContainerProps } from '@/types';

export default function AppContainer({
  title,
  children,
  myClass,
}: IContainerProps) {
  return (
    <Box className="flex flex-col items-center bg-white">
      {title && (
        <Box
          as="section"
          className="flex justify-start"
          px={{ base: '10px', md: '5' }}
          mb="10"
          maxW="1920"
          w="100%"
        >
          <Text color="blue.600" fontSize="2xl">
            {title}
          </Text>
        </Box>
      )}
      <Box
        as="section"
        className={['flex', myClass].join(' ')}
        px={{ base: '10px', md: '5' }}
        maxW="1920"
        w="100%"
        pb="10"
      >
        {children}
      </Box>
    </Box>
  );
}
