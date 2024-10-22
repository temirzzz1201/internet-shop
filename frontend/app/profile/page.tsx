'use client';
import { Box, Text } from "@chakra-ui/react";

function Profile() {
  return (
    <Box as='section' mb='8' className="flex justify-center items-center">
      <Box className="flex" maxW='1920' w='100%' px='5'>
        <Text color="blue.600" fontSize="4xl">Профиль</Text>
      </Box>
    </Box>
  );
}

export default Profile;
