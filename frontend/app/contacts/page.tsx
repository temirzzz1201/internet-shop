import { Box, Text, Container } from "@chakra-ui/react";

export default function Profile() {
  return (
    <Box as="section" px='3'>
      <Container>
        <Box className="mb-6" color="blue.600" fontSize="4xl" as="h1">Контакты</Box>

        <Text className="mb-8" fontSize="14">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores similique eligendi officiis illum ullam veritatis error natus perspiciatis quod iste. Quas natus placeat quos similique accusantium ad omnis recusandae odit?
        </Text>
        <Text className="mb-8" fontSize="14">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores similique eligendi officiis illum ullam veritatis error natus perspiciatis quod iste. Quas natus placeat quos similique accusantium ad omnis recusandae odit?
        </Text>
        <Text className="mb-8" fontSize="14">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores similique eligendi officiis illum ullam veritatis error natus perspiciatis quod iste. Quas natus placeat quos similique accusantium ad omnis recusandae odit?
        </Text>
        <Text className="mb-8" fontSize="14">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores similique eligendi officiis illum ullam veritatis error natus perspiciatis quod iste. Quas natus placeat quos similique accusantium ad omnis recusandae odit?
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores similique eligendi officiis illum ullam veritatis error natus perspiciatis quod iste. Quas natus placeat quos similique accusantium ad omnis recusandae odit
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores similique eligendi officiis illum ullam veritatis error natus perspiciatis quod iste. Quas natus placeat quos similique accusantium ad omnis recusandae odit
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores similique eligendi officiis illum ullam veritatis error natus perspiciatis quod iste. Quas natus placeat quos similique accusantium ad omnis recusandae odit
        </Text>
        <Box className="flex justify-between">
          <Text fontWeight={"semibold"} className="mb-8" fontSize="16">
            some@gmail.com
          </Text>
          <Text fontWeight={"semibold"}  className="mb-8" fontSize="16">
            8 800 800 80 80
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
