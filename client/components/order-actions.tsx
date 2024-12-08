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
    <Box className='w-full'>
      <Box as='div' className='flex'>
        <Button
          disabled={quantity === 0}
          size="sm"
          colorScheme="green"
          mr={3}
          onClick={handleOrder}
          isDisabled={stock === 0}
          width="50%" 
          sx={{
            "@media (max-width: 360px)": {
              width: "100%", 
              marginBottom: "10px"
            },
          }}
        >
          В корзину
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          onClick={handleResetQuantity}
          isDisabled={stock === 0}
          width="50%" 
          sx={{
            "@media (max-width: 360px)": {
              width: "100%", 
            },
          }}
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
          width="100%" 
          mt='2'
        >
          Перейти в корзину
        </Button>
      </Box>
    </Box>
  );
};

export default OrderActions;
