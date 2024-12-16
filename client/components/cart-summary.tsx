import {
  Box,
  Button,
  VStack,
  useBreakpointValue,
  Heading,
} from '@chakra-ui/react';
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
      w="100%"
      p={{ base: '3', sm: '4', md: '5' }}
      maxW={{ base: '100%', md: '320px' }}
      shadow="md"
      maxH="417px"
      h="100%"
      className="flex flex-col justify-between"
    >
      <Box>
        <Heading fontWeight="semibold" mb="5" size={{ base: 'md', md: 'xl' }}>
          Все товары
        </Heading>
        <Box as="p" fontSize={{ base: 'sm', md: 'md' }} mb="2">
          Всего товаров: {totalQuantity} шт.
        </Box>
        <Box as="p" fontSize={{ base: 'sm', md: 'md' }} mb="3">
          Итоговая цена: {totalPrice} руб.
        </Box>
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
