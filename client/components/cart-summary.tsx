import { Box, Button, VStack, useBreakpointValue } from '@chakra-ui/react';
import { ICartSummaryProps } from '@/types';

const CartSummary: React.FC<ICartSummaryProps> = ({
  totalQuantity,
  totalPrice,
  onOrder,
  onClear,
}) => {
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  return (
    <Box
      bg="white"
      border="1px solid #DEDEDE"
      borderRadius="20px"
      p={{ base: '3', sm: '4', md: '5' }}
      maxW={{ base: '100%', md: '100%' }}
      shadow="md"
      maxH="350px"
    >
      <Box fontWeight="semibold" fontSize={{ base: 'md', md: 'xl' }} mb="3">
        Перейти к оформлению
      </Box>
      <Box fontSize={{ base: 'sm', md: 'md' }} mb="2">
        Количество товаров: {totalQuantity}
      </Box>
      <Box fontSize={{ base: 'sm', md: 'md' }} mb="3">
        Итоговая цена: {totalPrice} руб.
      </Box>
      <VStack spacing="3" align="stretch">
        <Button colorScheme="teal" size={buttonSize} onClick={onOrder}>
          Оформить заказ
        </Button>
        <Button colorScheme="red" size={buttonSize} onClick={onClear}>
          Очистить корзину
        </Button>
      </VStack>
    </Box>
  );
};

export default CartSummary;
