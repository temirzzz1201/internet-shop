import { Box, Button, Heading, HStack, Image, Input } from '@chakra-ui/react';
import { IBusketProduct } from '@/types';

interface CartItemProps {
  item: IBusketProduct;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  return (
    <Box
      bg="white"
      border="1px solid #DEDEDE"
      borderRadius="20px"
      p={{ base: '3', sm: '4', md: '5' }}
      width="100%"
      shadow="md"
    >
      <Heading
        size={{ base: 'md', md: 'xl' }}
        fontWeight="semibold"
        mb="5"
        maxW={{ base: '100%', md: '70%' }}
      >
        {item.product?.name}
      </Heading>
      <Box
        display="flex"
        gap="4"
        mb="5"
        flexWrap="wrap"
        justifyContent={{ base: 'center', md: 'flex-start' }}
      >
        {item.product.images.map((image, imgIndex) => (
          <Image
            key={`${item.product.id}-${imgIndex}`}
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${image.imageUrl}`}
            alt={item.product.name}
            w={{ base: '300px', sm: '140px' }}
            h={{ base: '140px', sm: '140px' }}
            mr={{ base: '0', sm: '20px' }}
            objectFit="contain"
          />
        ))}
      </Box>
      <Box mb="2" as="p">
        Количество: {item.quantity} шт.
      </Box>
      <Box mb="2" as="p" fontWeight="semibold">
        Цена: {item.product?.price} руб.
      </Box>
      <HStack
        spacing="4"
        wrap="wrap"
        width="280px"
        sx={{
          '@media (max-width: 360px)': {
            width: '100%',
          },
        }}
      >
        <Box className="flex items-center">
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => onDecrement(item.id)}
            isDisabled={item.quantity < 1}
          >
            -
          </Button>
          <Input
            value={item.quantity}
            readOnly
            textAlign="center"
            width="100px"
            mx="3"
            sx={{
              '@media (max-width: 360px)': {
                width: '100%',
              },
            }}
          />
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => onIncrement(item.id)}
            isDisabled={item.quantity >= item.product?.stock}
          >
            +
          </Button>
        </Box>
        <Button
          colorScheme="red"
          size="sm"
          onClick={() => onRemove(item.id)}
          minW="90px"
          width="197px"
          sx={{
            '@media (max-width: 360px)': {
              width: '100%',
            },
          }}
        >
          Удалить
        </Button>
      </HStack>
    </Box>
  );
};

export default CartItem;
