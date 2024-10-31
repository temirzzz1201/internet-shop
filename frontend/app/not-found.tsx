import { Box, Heading } from '@chakra-ui/react';

export default function NotFound() {
  return (
    <Box w="full" mt="120px" display="flex" justifyContent="center">
      <Heading size="lg">Нет такой страницы :(</Heading>
    </Box>
  );
}
