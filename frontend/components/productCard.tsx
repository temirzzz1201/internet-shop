import { IIProduct } from '@/types';
import Link from 'next/link';
import {
  Card,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Image,
  Stack,
  Divider,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';

export default function ProductCard({ product }: { product: IIProduct }) {
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.imageUrl}`;

  return (
    <Link href={`/detail:${product.id}`}>
      <Card maxW="sm">
        <CardBody>
          <Image
            boxSize="200px"
            objectFit="cover"
            src={imageUrl}
            alt={product.name}
            borderRadius="lg"
          />
          <Stack mt="6" spacing="3">
            <Heading color="blue.600" size="md">
              {product.name}
            </Heading>
            <Text noOfLines={2} color="blue.600" fontSize="md">
              {product.description}
            </Text>
            <Text color="blue.600" fontSize="sm">
              price: {product.price}
            </Text>
            <Text as="mark" fontSize="sm">
              stock: {product.stock}
            </Text>
            <Text color="blue.600" fontSize="xs">
              {new Date(product.createdAt).toLocaleDateString()}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button variant="solid" colorScheme="blue">
              Buy now
            </Button>
            <Button variant="ghost" colorScheme="blue">
              Add to cart
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </Link>
  );
}
