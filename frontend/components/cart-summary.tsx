import { Box, Button, VStack, useBreakpointValue } from '@chakra-ui/react';
import { ICartSummaryProps } from '@/types';

const CartSummary: React.FC<ICartSummaryProps> = ({ totalQuantity, totalPrice, onOrder, onClear }) => {
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  return (
    <Box
      bg="orange.100"
      p={{ base: '3', sm: '4', md: '5' }}
      borderRadius="20px"
      width="100%"
      maxW={{ base: '100%', sm: '480px' }} 
      maxH="350px"
      mx="auto" 
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
