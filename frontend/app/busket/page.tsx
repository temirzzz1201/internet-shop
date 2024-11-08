'use client';
import { Box, Button, HStack, Stack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import AppContainer from '@/components/app-container';
import AppModal from '@/components/app-modal';
import CartItem from '@/components/cart-item';
import { useCart } from '@/hooks/useCart';

const Busket = () => {
  const {
    cartItems,
    updateQuantity,
    removeProduct,
    clearCartItems,
    placeCartOrder,
  } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIncrement = (item: any) => {
    if (item.quantity < item.product.stock) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = (item: any) => {
    if (item.quantity > 0) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleOrder = () => {
    placeCartOrder();
    setIsModalOpen(true);
  };

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <AppContainer title="Оформление заказа" myClass="justify-center">
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Заказ оформлен"
        modalSize="xl"
      >
        {cartItems.map((item) => (
          <Box key={item.id} p="10px">
            <Box fontWeight="semibold">Товар: {item.product?.name}</Box>
            <Box>Количество: {item.quantity}</Box>
            <Box>Цена: {item.product?.price} руб.</Box>
          </Box>
        ))}
      </AppModal>

      <Stack direction={{ base: 'column', md: 'row' }} spacing="5" mb="5">
        <Box mr="20" bg="orange.100" p="5" borderRadius="20px" maxW="sm">
          <Box fontWeight="semibold" fontSize="2xl" mb="4">
            Перейти к оформлению
          </Box>
          <Box mb="2">Количество товаров: {totalQuantity}</Box>
          <Box mb="2">Итоговая цена: {totalPrice} руб.</Box>
          <HStack spacing="4">
            <Button colorScheme="teal" onClick={handleOrder}>
              Оформить заказ
            </Button>
            <Button colorScheme="red" onClick={clearCartItems}>
              Очистить корзину
            </Button>
          </HStack>
        </Box>

        <Box flex="1">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <Box mb="5">
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrement={() => handleIncrement(item)}
                  onDecrement={() => handleDecrement(item)}
                  onRemove={() => removeProduct(item.id)}
                />
              </Box>
            ))
          ) : (
            <Box>Корзина пуста</Box>
          )}
        </Box>
      </Stack>
    </AppContainer>
  );
};

export default Busket;
