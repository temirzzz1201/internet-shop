import { Box, Button, HStack, Image, Input } from '@chakra-ui/react';
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
      border="1px solid #DEDEDE"
      borderRadius="20px"
      p={{ base: '3', sm: '4', md: '5' }}
      width="100%"
      maxW={{ base: '100%', sm: '480px' }}
    >
      <Box as="h3" fontSize="xl" fontWeight="semibold" mb="5" maxW="70%">
        {item.product?.name}
      </Box>
      <Box display="flex" gap="4" mb="5" flexWrap="wrap">
        {item.product.images.map((image, imgIndex) => (
          <Image
            key={`${item.product.id}-${imgIndex}`}
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${image.imageUrl}`}
            alt={item.product.name}
            boxSize="100px"
            objectFit="contain"
          />
        ))}
      </Box>
      <Box mb="2" as="p">
        Количество: {item.quantity}
      </Box>
      <Box mb="2" as="p" fontWeight="semibold">
        Цена: {item.product?.price} руб.
      </Box>
      <HStack spacing="4" wrap="wrap">
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => onDecrement(item.id)}
          isDisabled={item.quantity < 1}
        >
          -
        </Button>
        <Input value={item.quantity} readOnly textAlign="center" width="60px" />
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => onIncrement(item.id)}
          isDisabled={item.quantity >= item.product?.stock}
        >
          +
        </Button>
        <Button
          colorScheme="red"
          size="sm"
          onClick={() => onRemove(item.id)}
          minW="90px"
        >
          Удалить
        </Button>
      </HStack>
    </Box>
  );
};

export default CartItem;
