import { IIProduct } from '@/types';
import {
  Image,
  AspectRatio,
  Box,
  Badge,
} from '@chakra-ui/react';
import formatDate from '@/utils/dateHelper';

export default function ProductCard({ product }: { product: IIProduct }) {
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.imageUrl}`;

  return (
    <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <AspectRatio maxW='400px' ratio={4 / 6}>
        <Image
          boxSize="150px"
          objectFit="cover"
          src={imageUrl}
          alt={product.name}
          borderRadius="lg"
        />
      </AspectRatio>
      <Box p='6'>
        <Box display='flex' alignItems='baseline'>
          <Badge borderRadius='full' px='2' colorScheme='teal'>
            {product.stock}
          </Badge>
        </Box>
        <Box
          mt='1'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          noOfLines={1}
        >
          {product.name.toUpperCase()}
        </Box>
        <Box
          mt='1'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          noOfLines={1}
        >
          {product.description}
        </Box>
        <Box>
          {product.price}
          <Box as='span' color='gray.600' fontSize='sm'>
            / wk
          </Box>
        </Box>
        <Box display='flex' mt='2' alignItems='center'>
          {formatDate(product.createdAt)}
          <Box as='span' ml='2' color='gray.600' fontSize='sm'>
            reviews
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
