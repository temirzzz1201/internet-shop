import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as='footer' px='5' bg='gray.500' h='10' className="flex items-center justify-center border-t-2 border-t-slate-600">
      <Text fontSize='xl'>@ copyright 2024</Text>
    </Box>
  );
}
