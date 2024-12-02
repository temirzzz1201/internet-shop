import React from 'react';
import { Box, Button } from '@chakra-ui/react';

interface CartActionsProps {
  quantity: number;
  stock: number;
  handleOrder: () => void;
  handleResetQuantity: () => void;
  goToBusket: () => void;
}

const OrderActions: React.FC<CartActionsProps> = ({
  quantity,
  stock,
  handleOrder,
  handleResetQuantity,
  goToBusket,
}) => {
  return (
    <>
      <Box mb="3">
        <Button
          disabled={quantity === 0}
          size="sm"
          colorScheme="green"
          mr={3}
          onClick={handleOrder}
          isDisabled={stock === 0}
        >
          Добавить в корзину
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          onClick={handleResetQuantity}
          isDisabled={stock === 0}
        >
          Удалить
        </Button>
      </Box>
      <Box>
        <Button
          size="sm"
          colorScheme="blue"
          variant="ghost"
          onClick={goToBusket}
        >
          Перейти в корзину
        </Button>
      </Box>
    </>
  );
};

export default OrderActions;
